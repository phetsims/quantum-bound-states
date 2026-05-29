// Copyright 2026, University of Colorado Boulder

/**
 * Analytical solution for a single-well 1D Coulomb potential.
 *
 * The 1D Coulomb potential is a hydrogen-like attractive well with a 1/|x| singularity
 * at x = x₀. Only the antisymmetric (odd-parity) family of states is included here,
 * which is the standard "1D Coulomb" choice — antisymmetric wave functions vanish at
 * x = x₀ and so avoid the singularity.
 *
 * POTENTIAL (singularity at x = x₀, energy reference y₀):
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

import affirm from '../../../../../../perennial-alias/js/browser-and-node/affirm.js';
import { BoundStateResult } from '../BoundStateResult.js';
import NumerovSolver from '../NumerovSolver.js';
import { PotentialFunction } from '../PotentialFunction.js';
import WaveFunctionNormalizer from '../WaveFunctionNormalizer.js';
import XGrid from '../XGrid.js';

const HBAR = NumerovSolver.HBAR;

// The Coulomb spectrum is infinite and accumulates at E = 0, but only the lowest few
// states are physically relevant for the sim. The Java reference also stopped at 10.
const MAX_PRINCIPAL_QUANTUM_NUMBER = 10;

// Magnitude of the singularity at x = x₀ in eV (positive)
const MAGNITUDE_AT_SINGULARITY = 1e5;
affirm( MAGNITUDE_AT_SINGULARITY > 0, 'MAGNITUDE_AT_SINGULARITY must be positive' );

// Parameters for createPotentialFunction method
type PotentialParameters = {
  numberOfWells: number; // number of wells, must be 1 for CoulombSolution
  xOffset: number; // Horizontal position x₀ of the singularity in nm
  yOffset: number; // Constant energy shift y₀ in eV
  electricField: number; // Electric field in V/nm, must be 0 for CoulombSolution
  coupling: number; // Coulomb coupling K = ke² in eV·nm (positive)
};

// Parameters for solve method
type SolveParameters = {
  energyMin: number; // Minimum energy to search (eV)
  energyMax: number; // Maximum energy to search (eV)
  electronMasses: number; // Particle mass in electron masses
} & PotentialParameters;

export default class CoulombSolution {

  private constructor() {
    // Not intended for instantiation.
  }

  /**
   * Creates the potential function for a single-well 1D Coulomb potential.
   *
   * V(x) = y₀ - K / |x - x₀|, 
   * and K is the Coulomb coupling.
   * with the singularity at x = x₀ capped so that a discrete
   * grid that includes x = x₀ sees a finite (but very deep) value.
   */
  public static createPotentialFunction( parameters: PotentialParameters ): PotentialFunction {

    // Unpack parameters
    const { numberOfWells, xOffset, yOffset, electricField, coupling } = parameters;
    affirm( numberOfWells === 1, 'CoulombSolution does not support multiple wells' );
    affirm( electricField === 0, 'CoulombSolution does not support electric field' );
    affirm( coupling > 0, 'coupling must be positive' );

    return ( x: number ) => {
      const ax = Math.abs( x - xOffset );
      let intrinsic: number;
      if ( ax === 0 ) {
        intrinsic = -MAGNITUDE_AT_SINGULARITY;
      }
      else {
        const v = -coupling / ax;
        intrinsic = ( v < -MAGNITUDE_AT_SINGULARITY ) ? -MAGNITUDE_AT_SINGULARITY : v;
      }
      return yOffset + intrinsic;
    };
  }

  /**
   * Analytical solution for a single-well 1D Coulomb potential.
   *
   * Energies are accepted and returned with the energy offset y₀ included (matching V(x) on the
   * grid). The solver works in the intrinsic Coulomb frame (y₀ = 0, standard −K/|x − x₀| form)
   * and adds y₀ back to each eigenvalue before returning. The singularity is at x₀; wave
   * functions are built from the coordinate (x − x₀).
   */
  public static solve( xGrid: XGrid, parameters: SolveParameters ): BoundStateResult {

    // Unpack parameters
    const { numberOfWells, energyMin, energyMax, xOffset, yOffset, electronMasses, electricField, coupling } = parameters;
    affirm( numberOfWells === 1, 'CoulombSolution does not support multiple wells' );
    affirm( electricField === 0, 'CoulombSolution does not support electric field' );
    affirm( coupling > 0, 'coupling must be positive' );

    // Work in the Coulomb frame where the potential floor is the standard 1/|x| form (no y₀).
    const intrinsicEnergyMin = energyMin - yOffset;
    const intrinsicEnergyMax = energyMax - yOffset;

    // Energy scale: |E_1| = m K² / ( 2 ℏ² ). Then E_n = -energyScale / n² (intrinsic energies).
    const energyScale = ( electronMasses * coupling * coupling ) / ( 2 * HBAR * HBAR );

    // Bohr radius for this (mass, coupling): a = ℏ² / ( m K ).
    const bohrRadius = ( HBAR * HBAR ) / ( electronMasses * coupling );

    // Collect the principal quantum numbers whose energies fall inside the requested window.
    const quantumNumbers: number[] = [];
    const energies: number[] = [];
    for ( let n = 1; n <= MAX_PRINCIPAL_QUANTUM_NUMBER; n++ ) {
      const intrinsicEnergy = -energyScale / ( n * n );

      // Display eigenvalue: intrinsic E_n + y₀.
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

    const potentialFunction = CoulombSolution.createPotentialFunction( {
      numberOfWells: numberOfWells,
      xOffset: xOffset,
      yOffset: yOffset,
      electricField: electricField,
      coupling: coupling
    } );
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
