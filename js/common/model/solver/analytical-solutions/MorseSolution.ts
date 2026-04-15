// Copyright 2026, University of Colorado Boulder

//TODO Add to testSolvers?
/**
 * Analytical solution for the Morse potential.
 *
 * The Morse potential models a diatomic-molecule-like well with a repulsive wall on
 * the left, a minimum at x = 0, and a flat asymptote at x → +∞.  It is parameterised
 * by well depth D_e and width w = 1/a (replacing the standard Morse parameter a).
 *
 * POTENTIAL:
 *   V(x) = D_e · (1 − e^{−x/w})² − D_e
 *
 *   V(0)    = −D_e        (well bottom)
 *   V(+∞)  =  0           (dissociation limit)
 *   V(−∞)  → +∞           (repulsive wall)
 *
 * DIMENSIONLESS DEPTH PARAMETER:
 *   λ = w · √(2mD_e) / ℏ
 *   The total number of bound states is ⌊λ − ½⌋ + 1.
 *
 * ENERGY EIGENVALUES (exact):
 *   ℏω_e = (ℏ/w) · √(2D_e/m)        (harmonic vibrational quantum)
 *   E_v  = ℏω_e(v + ½) − (ℏω_e)²(v + ½)² / (4D_e) − D_e
 *   for v = 0, 1, …, ⌊λ − ½⌋
 *
 *   The anharmonic correction −(ℏω_e)²(v+½)²/(4D_e) causes the levels to converge
 *   toward the dissociation limit as v increases.
 *
 * WAVEFUNCTIONS (exact):
 *   z = 2λ · e^{−x/w}         (dimensionless coordinate, z > 0)
 *   α = 2λ − 2v − 1           (Laguerre parameter; equals twice the z-exponent)
 *   ψ_v(x) ∝ z^{α/2} · e^{−z/2} · L_v^{(α)}(z)
 *
 *   where L_v^{(α)} is the associated Laguerre polynomial computed by 3-term recurrence.
 *   Wave functions are normalised numerically using WaveFunctionNormalizer.
 *
 * @author Martin Veillette
 */

import { BoundStateResult } from '../BoundStateResult.js';
import NumerovSolver from '../NumerovSolver.js';
import { PotentialFunction } from '../PotentialFunction.js';
import WaveFunctionNormalizer from '../WaveFunctionNormalizer.js';
import XGrid from '../XGrid.js';

const HBAR = NumerovSolver.HBAR;

export default class MorseSolution {

  private constructor() {
    // Not intended for instantiation.
  }

  /**
   * Creates the potential function for the Morse potential.
   * V(x) = D_e · (1 − e^{−x/w})² − D_e
   *
   * @param wellDepth - Dissociation energy D_e in eV (positive)
   * @param width - Width parameter w = 1/a in nm (positive)
   * @returns Potential function V(x) in eV
   */
  public static createPotential( wellDepth: number, width: number ): PotentialFunction {
    return ( x: number ) => {
      const term = 1 - Math.exp( -x / width );
      return wellDepth * term * term - wellDepth;
    };
  }

  /**
   * Analytical solution for the Morse potential.
   *
   * Returns a BoundStateResult compatible with NumerovSolver output.
   *
   * @param xGrid - Uniformly spaced x-coordinates in nm
   * @param wellDepth - Dissociation energy D_e in eV (positive)
   * @param width - Width parameter w = 1/a in nm (positive)
   * @param mass - Particle mass in electron masses
   * @param energyMin - Minimum energy to include (eV)
   * @param energyMax - Maximum energy to include (eV)
   * @returns Bound state results with exact energies (eV) and wave functions
   */
  public static solve(
    xGrid: XGrid,
    wellDepth: number,
    width: number,
    mass: number,
    energyMin: number,
    energyMax: number
  ): BoundStateResult {

    const { energies, quantumNumbers } = findBoundStateEnergies( wellDepth, width, mass, energyMin, energyMax );

    const waveFunctions: number[][] = [];
    for ( let i = 0; i < energies.length; i++ ) {
      const waveFunction = calculateWaveFunction( quantumNumbers[ i ], wellDepth, width, mass, xGrid.xCoordinates );
      waveFunctions.push( waveFunction );
    }

    return {
      potentials: [], // not relevant for analytical solution
      energies: energies,
      waveFunctions: waveFunctions,
      method: 'analytical'
    };
  }
}

/**
 * Find all bound-state energies within the requested range.
 *
 * The exact closed-form formula is used; no root-finding is required.
 * Energies are measured from the dissociation limit (V(+∞) = 0) so that
 * all bound states have E_v < 0.
 *
 * @param wellDepth - D_e in eV
 * @param width - w = 1/a in nm
 * @param mass - Particle mass in electron masses
 * @param energyMin - Lower bound of requested range (eV)
 * @param energyMax - Upper bound of requested range (eV)
 * @returns Energies (eV) and corresponding vibrational quantum numbers
 */
function findBoundStateEnergies(
  wellDepth: number,
  width: number,
  mass: number,
  energyMin: number,
  energyMax: number
): { energies: number[]; quantumNumbers: number[] } {

  // ℏω_e = (ℏ/w) · √(2D_e/m)
  const hbarOmegaE = ( HBAR / width ) * Math.sqrt( 2 * wellDepth / mass );

  // λ = w√(2mD_e)/ℏ; bound states exist for v = 0, 1, …, ⌊λ−½⌋
  const lambda = width * Math.sqrt( 2 * mass * wellDepth ) / HBAR;
  const vMax = Math.floor( lambda - 0.5 );

  const energies: number[] = [];
  const quantumNumbers: number[] = [];

  for ( let v = 0; v <= vMax; v++ ) {
    const s = v + 0.5; // v + ½
    // E_v = ℏω_e·s − (ℏω_e)²·s²/(4D_e) − D_e
    const energy = hbarOmegaE * s - hbarOmegaE * hbarOmegaE * s * s / ( 4 * wellDepth ) - wellDepth;

    if ( energy >= energyMin && energy <= energyMax ) {
      energies.push( energy );
      quantumNumbers.push( v );
    }
  }

  return { energies: energies, quantumNumbers: quantumNumbers };
}

/**
 * Compute the normalised wave function for a single Morse eigenstate.
 *
 * Uses the substitution z = 2λ e^{−x/w} to map to a Laguerre equation:
 *   ψ_v(x) ∝ z^{α/2} · e^{−z/2} · L_v^{(α)}(z),   α = 2λ−2v−1
 *
 * For large negative x, z → ∞ and e^{−z/2} suppresses the wavefunction to zero;
 * for large positive x, z → 0 and z^{α/2} → 0.  Any non-finite values (from
 * intermediate overflow at extreme x) are replaced with zero.
 *
 * @param v - Vibrational quantum number
 * @param wellDepth - D_e in eV
 * @param width - w = 1/a in nm
 * @param mass - Particle mass in electron masses
 * @param xArray - Array of x positions in nm
 * @returns Normalised wave function values
 */
function calculateWaveFunction(
  v: number,
  wellDepth: number,
  width: number,
  mass: number,
  xArray: number[]
): number[] {

  const lambda = width * Math.sqrt( 2 * mass * wellDepth ) / HBAR;
  const alpha = 2 * lambda - 2 * v - 1; // Laguerre parameter; also equals 2·(z-exponent)

  const waveFunction: number[] = [];

  for ( const x of xArray ) {
    const z = 2 * lambda * Math.exp( -x / width );
    const laguerre = associatedLaguerre( v, alpha, z );
    // ψ_v ∝ z^{α/2} · e^{−z/2} · L_v^{(α)}(z)
    const value = Math.pow( z, alpha / 2 ) * Math.exp( -z / 2 ) * laguerre;
    waveFunction.push( isFinite( value ) ? value : 0 );
  }

  const dx = xArray.length > 1 ? xArray[ 1 ] - xArray[ 0 ] : 0;
  return new WaveFunctionNormalizer().normalize( waveFunction, dx );
}

/**
 * Associated Laguerre polynomial L_n^{(α)}(z) via the stable 3-term recurrence:
 *   L_0^{(α)}(z) = 1
 *   L_1^{(α)}(z) = 1 + α − z
 *   L_n^{(α)}(z) = [(2n−1+α−z)·L_{n−1}^{(α)}(z) − (n−1+α)·L_{n−2}^{(α)}(z)] / n
 *
 * @param n - Polynomial order (vibrational quantum number)
 * @param alpha - Parameter α = 2λ−2n−1
 * @param z - Argument z = 2λ e^{−x/w}
 * @returns L_n^{(α)}(z)
 */
function associatedLaguerre( n: number, alpha: number, z: number ): number {
  if ( n === 0 ) {
    return 1;
  }
  if ( n === 1 ) {
    return 1 + alpha - z;
  }

  let lPrev2 = 1;
  let lPrev1 = 1 + alpha - z;

  for ( let k = 2; k <= n; k++ ) {
    const lNext = ( ( 2 * k - 1 + alpha - z ) * lPrev1 - ( k - 1 + alpha ) * lPrev2 ) / k;
    lPrev2 = lPrev1;
    lPrev1 = lNext;
  }

  return lPrev1;
}