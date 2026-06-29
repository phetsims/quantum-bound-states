// Copyright 2026, University of Colorado Boulder

/**
 * MorseSolution implements the analytical solution for a single-well Morse potential.
 *
 * The Morse potential models a diatomic-molecule-like well with a repulsive wall on
 * the left, a minimum at x = 0, and a flat asymptote at x → +∞.  It is parameterized
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
 *   Wave functions are normalized in log space to avoid overflow from z^(α/2).
 *   
 *   For generality, we add an xOffset to the wave functions to account for the horizontal position of the well.
 *   The xOffset is added to the wave functions to shift them horizontally so that they are centered on the well.
 *   We add an yOffset for the energy (yOffset in this case is an energy shift).
 * 
 * @author Martin Veillette
 */

import affirm from '../../../../../../perennial-alias/js/browser-and-node/affirm.js';
import BoundStateResult from '../BoundStateResult.js';
import NumerovSolver from '../NumerovSolver.js';
import { PotentialFunction } from '../PotentialFunction.js';
import XGrid from '../XGrid.js';

const HBAR = NumerovSolver.HBAR;

// Parameters for createPotentialFunction method
type PotentialParameters = {
  numberOfWells: number;
  xOffset: number; // Horizontal position x₀ of the singularity in nm
  yOffset: number; // Constant energy shift y₀ in eV
  wellWidth: number; // Width of the well L in nm
  wellDepth: number; // Depth of the well V₀ in eV (positive value)
  electricField: number; // Electric field in V/nm
};

// Parameters for solve method
type SolveParameters = {
  energyMin: number; // Minimum energy to search (eV)
  energyMax: number; // Maximum energy to search (eV)
  electronMasses: number; // Particle mass in electron masses
} & PotentialParameters;

export default class MorseSolution {

  private constructor() {
    // Not intended for instantiation.
  }

  /**
   * Creates the potential function for a single-well Morse potential.
   * V(x) = D_e · (1 − e^{−(x-xOffset)/w})² − D_e + yOffset
   *
   * @param parameters - See PotentialParameters
   * @returns Potential function V(x) in eV
   */
  public static createPotentialFunction( parameters: PotentialParameters ): PotentialFunction {

    // Unpack parameters
    const { numberOfWells, xOffset, yOffset, wellWidth, wellDepth, electricField } = parameters;
    affirm( numberOfWells === 1, 'MorseSolution does not support multiple wells' );
    affirm( electricField === 0, 'MorseSolution does not support electric field' );

    //TODO Should we constrain to QBSConstants.EFFECTIVELY_INFINITE_POTENTIAL_ENERGY, as is done for other potential types?
    return ( x: number ) => {
      const term = 1 - Math.exp( -( x - xOffset ) / wellWidth );
      return wellDepth * term * term - wellDepth + yOffset;
    };
  }

  /**
   * Analytical solution for a single-well Morse potential.
   *
   * Returns a BoundStateResult compatible with NumerovSolver output.
   *
   * @param xGrid - Uniformly spaced x-coordinates in nm
   * @param parameters - See SolveParameters
   * @returns Bound state results with exact energies (eV) and wave functions
   */
  public static solve( xGrid: XGrid, parameters: SolveParameters ): BoundStateResult {

    // Unpack parameters
    const { numberOfWells, energyMin, energyMax, xOffset, yOffset, wellWidth, wellDepth, electronMasses, electricField } = parameters;
    affirm( numberOfWells === 1, 'MorseSolution does not support multiple wells' );
    affirm( electricField === 0, 'MorseSolution does not support electric field' );

    const { energies, quantumNumbers } = findBoundStateEnergies( wellDepth, wellWidth, electronMasses, yOffset, energyMin, energyMax );

    const waveFunctions: number[][] = [];
    for ( let i = 0; i < energies.length; i++ ) {
      const waveFunction = calculateWaveFunction( quantumNumbers[ i ], wellDepth, wellWidth, electronMasses, xOffset, xGrid.xCoordinates );
      waveFunctions.push( waveFunction );
    }

    const potentialFunction = MorseSolution.createPotentialFunction( {
      numberOfWells: numberOfWells,
      xOffset: xOffset,
      yOffset: yOffset,
      wellWidth: wellWidth,
      wellDepth: wellDepth,
      electricField: electricField
    } );
    const potentials = xGrid.xCoordinates.map( x => potentialFunction( x ) );

    return new BoundStateResult( {
      potentials: potentials,
      energies: energies,
      waveFunctions: waveFunctions,
      solutionMethod: 'analytical'
    } );
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
 * @param wellWidth - w = 1/a in nm
 * @param electronMasses - Particle mass in electron masses
 * @param yOffset - Constant energy shift y₀ in eV
 * @param energyMin - Lower bound of requested range (eV)
 * @param energyMax - Upper bound of requested range (eV)
 * @returns Energies (eV) and corresponding vibrational quantum numbers
 */
function findBoundStateEnergies(
  wellDepth: number,
  wellWidth: number,
  electronMasses: number,
  yOffset: number,
  energyMin: number,
  energyMax: number
): { energies: number[]; quantumNumbers: number[] } {

  // ℏω_e = (ℏ/w) · √(2D_e/m)
  const hbarOmegaE = ( HBAR / wellWidth ) * Math.sqrt( 2 * wellDepth / electronMasses );

  // λ = w√(2mD_e)/ℏ; bound states exist for v = 0, 1, …, ⌊λ−½⌋
  const lambda = wellWidth * Math.sqrt( 2 * electronMasses * wellDepth ) / HBAR;
  const vMax = Math.floor( lambda - 0.5 );

  const energies: number[] = [];
  const quantumNumbers: number[] = [];

  for ( let v = 0; v <= vMax; v++ ) {
    const s = v + 0.5; // v + ½
    // E_v = ℏω_e·s − (ℏω_e)²·s²/(4D_e) − D_e + y₀
    const energy = hbarOmegaE * s - hbarOmegaE * hbarOmegaE * s * s / ( 4 * wellDepth ) - wellDepth + yOffset;

    if ( energy >= energyMin && energy <= energyMax ) {
      energies.push( energy );
      quantumNumbers.push( v );
    }
  }

  return { energies: energies, quantumNumbers: quantumNumbers };
}

/**
 * Compute the normalized wave function for a single Morse eigenstate.
 *
 * Uses the substitution z = 2λ e^{−x/w} to map to a Laguerre equation:
 *   ψ_v(x) = N_v · z^{α/2} · e^{−z/2} · L_v^{(α)}(z),   α = 2λ−2v−1
 *
 * where:
 *   N_v = sqrt( α Γ(v+1) / (w Γ(v+α+1)) )
 *
 * For large negative x, z → ∞ and e^{−z/2} suppresses the wavefunction to zero;
 * for large positive x, z → 0 and z^{α/2} → 0.
 *
 * Note that the z^(alpha/2) can be problematic for large values of alpha,
 * as it can lead to overflow. To avoid this, we compute the wave function in log space where is is merely alpha * Math.log( z ) / 2
 * see https://github.com/phetsims/quantum-bound-states/issues/43 for more details.
 *
 * @param v - Vibrational quantum number
 * @param wellDepth - D_e in eV
 * @param wellWidth - w = 1/a in nm
 * @param electronMasses - Particle mass in electron masses
 * @param xOffset
 * @param xArray - Array of x positions in nm
 * @returns Normalized wave function values
 */
function calculateWaveFunction(
  v: number,
  wellDepth: number,
  wellWidth: number,
  electronMasses: number,
  xOffset: number,
  xArray: readonly number[]
): number[] {

  const lambda = wellWidth * Math.sqrt( 2 * electronMasses * wellDepth ) / HBAR;
  const alpha = 2 * lambda - 2 * v - 1; // Laguerre parameter; also equals 2·(z-exponent)
  const logNormalization = 0.5 * (
    Math.log( alpha ) +
    logGamma( v + 1 ) -
    Math.log( wellWidth ) -
    logGamma( v + alpha + 1 )
  );

  const waveFunction: number[] = [];

  for ( const x of xArray ) {
    const z = 2 * lambda * Math.exp( -( x - xOffset ) / wellWidth );
    const laguerre = associatedLaguerre( v, alpha, z );

    // Compute the normalized envelope in log space to avoid overflow from z^(α/2) before N_v is applied.
    // see https://github.com/phetsims/quantum-bound-states/issues/43 for more details.
    const logEnvelope = logNormalization + alpha * Math.log( z ) / 2 - z / 2;
    const value = Math.exp( logEnvelope ) * laguerre;
    waveFunction.push( isFinite( value ) ? value : 0 );
  }

  return waveFunction;
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

/**
 * Natural logarithm of the Gamma function using the Lanczos approximation.
 * This implementation is based on the implementation in https://en.wikipedia.org/wiki/Lanczos_approximation for more details.
 * It claims to be accurate to 13 decimal places
 * @param z - Positive argument
 * @returns ln(Γ(z))
 */
function logGamma( z: number ): number {
  const coefficients = [
    0.9999999999998099,
    676.5203681218851,
    -1259.1392167224028,
    771.3234287776531,
    -176.6150291621406,
    12.507343278686905,
    -0.13857109526572012,
    9.984369578019572e-6,
    1.5056327351493116e-7
  ];

  // This recursive approach may looks strange, but  it allows to extend the approximation 
  // to values of z where z< 0.5, where the Lanczos solutionMethod is not valid.
  if ( z < 0.5 ) {
    return Math.log( Math.PI ) - Math.log( Math.sin( Math.PI * z ) ) - logGamma( 1 - z );
  }

  // Apply the Lanczos approximation
  z = z - 1;
  let x = coefficients[ 0 ];
  for ( let i = 1; i < coefficients.length; i++ ) { // Add the remaining coefficients to the sum.
    x += coefficients[ i ] / ( z + i );
  }

  const t = z + coefficients.length - 1.5; // Compute the argument of the logarithm.
  return Math.log( 2 * Math.PI ) / 2 + ( z + 0.5 ) * Math.log( t ) - t + Math.log( x );
}
