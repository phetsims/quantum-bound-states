// Copyright 2026, University of Colorado Boulder

/**
 * Analytical solution for the 1D Coulomb potential.
 *
 * The 1D Coulomb potential is a hydrogen-like attractive well with a 1/|x| singularity
 * at x = x₀. Only the antisymmetric (odd-parity) family of states is included here,
 * which is the standard "1D Coulomb" choice — antisymmetric wave functions vanish at
 * x = x₀ and so avoid the singularity.
 *
 * POTENTIAL (well centred at x = x₀ in the lab frame):
 *   V(x) = energyOffset - K / |x - x₀|        where K = ke²  (eV·nm)
 *
 * ENERGY EIGENVALUES (Bohr formula):
 *   E_n = -m K² / ( 2 ℏ² n² ),   n = 1, 2, 3, ...
 *
 * WAVEFUNCTIONS:
 *   ψ_n(x) ∝ (x - x₀) · e^{-|x - x₀| / (n a)} · Σ_{j=0}^{n-1} b_j |x - x₀|^j
 *
 *   where a = ℏ² / ( m K ) is the Bohr radius and the polynomial coefficients are
 *   defined by the recurrence (with the angular-momentum quantum number ℓ = 0):
 *
 *     b_0 = 1
 *     b_j = ( 2 / ( n a ) ) · ( j - n ) / ( j ( j + 1 ) ) · b_{j-1}
 *
 *   The recurrence terminates at j = n (since the (j - n) factor vanishes), so the
 *   polynomial has degree n - 1. The overall amplitude is set by WaveFunctionNormalizer
 *   rather than the analytic prefactor.
 *
 * Reference: Sam McKagan, "Coulomb potential formula" (2006-05-11),
 *
 * @author Martin Veillette
 */

import { BoundStateResult } from '../BoundStateResult.js';
import NumerovSolver from '../NumerovSolver.js';
import { PotentialFunction } from '../PotentialFunction.js';
import WaveFunctionNormalizer from '../WaveFunctionNormalizer.js';
import XGrid from '../XGrid.js';

const HBAR = NumerovSolver.HBAR;

// The Coulomb spectrum is infinite and accumulates at E = 0, but only the lowest few
// states are physically relevant for the sim. The Java reference also stopped at 10.
const MAX_PRINCIPAL_QUANTUM_NUMBER = 10;

export default class CoulombSolution {

  private constructor() {
    // Not intended for instantiation.
  }

  /**
   * Creates the potential function for a single 1D Coulomb well in the lab frame.
   * V(x) = y₀ - K / |x - x₀|, with the singularity at x = x₀ capped so that a discrete
   * grid that includes x = x₀ sees a finite (but very deep) value.
   *
   * @param coupling - Coulomb coupling K = ke² in eV·nm (positive)
   * @param bigNegative - Magnitude of the cap at the singularity, in eV (positive)
   * @param xOffset - Horizontal position x₀ of the singularity in nm (default 0)
   * @param yOffset - Constant energy shift y₀ in eV (default 0)
   * @returns Potential function V(x) in eV
   */
  public static createPotential( coupling: number, bigNegative = 1e5, xOffset = 0, yOffset = 0 ): PotentialFunction {
    return ( x: number ) => {
      const ax = Math.abs( x - xOffset );
      let intrinsic: number;
      if ( ax === 0 ) {
        intrinsic = -bigNegative;
      }
      else {
        const v = -coupling / ax;
        intrinsic = v < -bigNegative ? -bigNegative : v;
      }
      return yOffset + intrinsic;
    };
  }

  /**
   * Analytical solution for the 1D Coulomb potential.
   *
   * Returns a BoundStateResult compatible with NumerovSolver output. The API matches
   * NumerovSolver.solve() by taking energy bounds in the lab frame.
   *
   * Energies are accepted and returned in the lab frame. y₀ shifts V and all eigenvalues by
   * the same constant; the Coulomb nucleus is at x₀ and wave functions use (x − x₀).
   *
   * @param xGrid - Uniformly spaced x-coordinates in nm
   * @param coupling - Coulomb coupling K = ke² in eV·nm (positive)
   * @param mass - Particle mass in electron masses
   * @param energyMin - Minimum energy to include in the lab frame (eV, typically negative)
   * @param energyMax - Maximum energy to include in the lab frame (eV)
   * @param xOffset - Horizontal position x₀ of the nucleus in nm (default 0)
   * @param yOffset - Constant energy shift y₀ in the lab frame (eV) (default 0)
   * @returns Bound state results with energies in the lab frame and normalized wave functions
   *
   * @example
   * // Hydrogen-like: m = 1 mₑ, K = 1.44 eV·nm gives E_1 ≈ -13.6 eV
   * const result = CoulombSolution.solve(
   *   new XGrid( -3.5, 3.5, 1001 ),
   *   1.44,
   *   1,
   *   -20,
   *   0
   * );
   */
  public static solve(
    xGrid: XGrid,
    coupling: number,
    mass: number,
    energyMin: number,
    energyMax: number,
    xOffset = 0,
    yOffset = 0
  ): BoundStateResult {

    // Work in the Coulomb frame where the potential floor is the standard 1/|x| form (no y₀).
    const intrinsicEnergyMin = energyMin - yOffset;
    const intrinsicEnergyMax = energyMax - yOffset;

    // Energy scale: |E_1| = m K² / ( 2 ℏ² ). Then E_n = -energyScale / n² (intrinsic energies).
    const energyScale = ( mass * coupling * coupling ) / ( 2 * HBAR * HBAR );

    // Bohr radius for this (mass, coupling): a = ℏ² / ( m K ).
    const bohrRadius = ( HBAR * HBAR ) / ( mass * coupling );

    // Collect the principal quantum numbers whose energies fall inside the requested window.
    const quantumNumbers: number[] = [];
    const energies: number[] = [];
    for ( let n = 1; n <= MAX_PRINCIPAL_QUANTUM_NUMBER; n++ ) {
      const intrinsicEnergy = -energyScale / ( n * n );

      // Lab-frame eigenvalue E_n' = intrinsic E_n + y₀.
      if ( intrinsicEnergy >= intrinsicEnergyMin && intrinsicEnergy <= intrinsicEnergyMax ) {
        quantumNumbers.push( n );
        energies.push( intrinsicEnergy + yOffset );
      }
    }

    // Build and normalize each wave function: ψ_n(x) ∝ (x − x₀) · e^{-|x − x₀|/(n a)} · P_n(|x − x₀|).
    const normalizer = new WaveFunctionNormalizer();
    const waveFunctions: number[][] = [];

    for ( const n of quantumNumbers ) {
      const polynomialCoefficients = computePolynomialCoefficients( n, bohrRadius );
      const inverseNA = 1 / ( n * bohrRadius );

      const psi: number[] = [];
      for ( const x of xGrid.xCoordinates ) {
        const xLocal = x - xOffset;
        const r = Math.abs( xLocal );
        const polynomial = evaluatePolynomial( polynomialCoefficients, r );
        psi.push( xLocal * Math.exp( -r * inverseNA ) * polynomial );
      }

      waveFunctions.push( normalizer.normalize( psi, xGrid.dx ) );
    }

    const potentialFunction = CoulombSolution.createPotential( coupling, 1e5, xOffset, yOffset );
    const potentials = xGrid.xCoordinates.map( x => potentialFunction( x ) );

    return {
      potentials: potentials,
      energies: energies,
      waveFunctions: waveFunctions,
      method: 'analytical'
    };
  }
}

/**
 * Recurrence for the polynomial coefficients of ψ_n with ℓ = 0.
 *   b_0 = 1
 *   b_j = ( 2 / ( n a ) ) · ( j - n ) / ( j ( j + 1 ) ) · b_{j-1}
 *
 * Returns coefficients [b_0, b_1, ..., b_{n-1}]. b_n vanishes, so the polynomial degree is n - 1.
 *
 * b_0 is set to 1 because the analytic prefactor 2(na)^{-3/2} is absorbed into the
 * numerical normalization step.
 */
function computePolynomialCoefficients( n: number, bohrRadius: number ): number[] {
  const b = new Array<number>( n );
  b[ 0 ] = 1;
  const factor = 2 / ( n * bohrRadius );
  for ( let j = 1; j < n; j++ ) {
    b[ j ] = factor * ( ( j - n ) / ( j * ( j + 1 ) ) ) * b[ j - 1 ];
  }
  return b;
}

/**
 * Horner-form evaluation of Σ_{j=0}^{n-1} b_j r^j.
 */
function evaluatePolynomial( coefficients: number[], r: number ): number {
  let sum = 0;
  for ( let j = coefficients.length - 1; j >= 0; j-- ) {
    sum = sum * r + coefficients[ j ];
  }
  return sum;
}
