// Copyright 2026, University of Colorado Boulder

/**
 * Analytical solution for a single-well Pöschl-Teller potential.
 *
 * The Pöschl-Teller potential is a symmetric quantum well with exact analytical solutions.
 * It is parameterized by well depth V₀ and width w.
 * For generality, we have included an offset y₀ and offset x₀ 
 * so that the potential can be shifted horizontally and vertically.
 *
 * POTENTIAL for single well with no electric field (with xOffset and yOffset):
 *   V(x) = −V₀ / cosh²((x − x₀)/w) + y₀
 *
 *   V(x₀)  = −V₀ + y₀     (well bottom)
 *   V(±∞)  =  y₀           (dissociation limit)
 *
 * DIMENSIONLESS DEPTH PARAMETER:
 *   λ = w · √(2mV₀) / ℏ
 *   The total number of bound states is ⌊λ − ½⌋ + 1.
 *
 * ENERGY EIGENVALUES (exact):
 *   E_n = −V₀ · (λ − n − ½)² / λ² + y₀
 *   for n = 0, 1, …, ⌊λ − ½⌋
 *
 *   The ground state (n=0) has the lowest energy; all bound states satisfy −V₀ + y₀ < E_n < y₀.
 *
 * WAVEFUNCTIONS (exact):
 *   α_n = λ − n − ½              (Jacobi parameter, specific to each state)
 *   t   = tanh((x − x₀)/w)       (dimensionless coordinate, t ∈ (−1, 1))
 *   ψ_n(x) ∝ sech^{α_n}((x − x₀)/w) · P_n^{(α_n, α_n)}(t)
 *
 *   where P_n^{(α,α)} is the symmetric Jacobi polynomial computed via 3-term recurrence.
 *   Wave functions are normalized numerically using WaveFunctionNormalizer.
 *
 *   The wave functions are normalized so that the integral of |ψ_n(x)|² over all x is 1.
 * 
 *  The createPotentialFunction method is more general than the solve method, 
 *  it allows for multiple wells and a non-zero electric field. 
 *  
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import affirm from '../../../../../../perennial-alias/js/browser-and-node/affirm.js';
import QBSConstants from '../../../QBSConstants.js';
import { BoundStateResult } from '../BoundStateResult.js';
import NumerovSolver from '../NumerovSolver.js';
import { PotentialFunction } from '../PotentialFunction.js';
import WaveFunctionNormalizer from '../WaveFunctionNormalizer.js';
import XGrid from '../XGrid.js';

const HBAR = NumerovSolver.HBAR;

// Parameters for createPotentialFunction method
type PotentialParameters = {
  numberOfWells: number;
  xOffset: number; // Horizontal position x₀ of the well center in nm
  yOffset: number; // Constant energy shift y₀ in eV
  wellWidth: number; // Width parameter w in nm
  wellDepth: number; // Well depth V₀ in eV (positive value)
  electricField: number; // Electric field in V/nm
  spacing: number; // Center-to-center distance between adjacent wells in nm (default: 0)
};

// Parameters for solve method
type SolveParameters = {
  energyMin: number; // Minimum energy to search (eV)
  energyMax: number; // Maximum energy to search (eV)
  electronMasses: number; // Particle mass in electron masses
} & PotentialParameters;

export default class PoschlTellerSolution {

  private constructor() {
    // Not intended for instantiation.
  }

  /**
   * Creates the potential energy function V(x) for one or more Pöschl-Teller wells.
   *
   * At each position x, the function sums a hyperbolic-secant-squared well term for every
   * well, then adds a constant vertical offset and a linear electric-field term:
   * V(x) = Σᵢ −V₀/cosh²((x − xᵢ)/w) + y₀ + electricField·x. Wells are placed
   * symmetrically about xOffset with center-to-center spacing given by spacing.
   *
   * This potential definition is general: it is valid for multiple wells and for a non-zero
   * electric field. The analytical solve() method in this class is more restricted, it only
   * applies to a single well with no electric field. See https://github.com/phetsims/quantum-bound-states/issues/43
   *
   * @param parameters - See PotentialParameters
   * @returns Potential function V(x) in eV
   */
  public static createPotentialFunction( parameters: PotentialParameters ): PotentialFunction {

    const { numberOfWells, xOffset, yOffset, wellWidth, wellDepth, electricField, spacing } = parameters;

    return ( x: number ) => {
      let potentialEnergy = 0;
      for ( let i = 1; i <= numberOfWells; i++ ) {
        const xi = xOffset + spacing * ( i - ( numberOfWells + 1 ) / 2 );
        const sech = 1 / Math.cosh( ( x - xi ) / wellWidth );
        potentialEnergy += -wellDepth * sech * sech;
      }
      potentialEnergy += yOffset + electricField * ( x - xOffset );

      affirm( potentialEnergy < QBSConstants.EFFECTIVELY_INFINITE_POTENTIAL_ENERGY );
      return potentialEnergy;
    };
  }

  /**
   * Analytical solution for a single-well Pöschl-Teller potential.
   *
   * Returns a BoundStateResult compatible with NumerovSolver output.
   *
   * @param xGrid - Uniformly spaced x-coordinates in nm
   * @param parameters - See SolveParameters
   * @returns Bound state results with exact energies (eV) and wave functions
   */
  public static solve( xGrid: XGrid, parameters: SolveParameters ): BoundStateResult {

    const { numberOfWells, energyMin, energyMax, xOffset, yOffset, wellWidth, wellDepth, electronMasses, electricField, spacing } = parameters;
    affirm( numberOfWells === 1, 'PoschlTellerSolution does not support multiple wells' );
    affirm( electricField === 0, 'PoschlTellerSolution does not support electric field' );

    const { energies, quantumNumbers } = findBoundStateEnergies( wellDepth, wellWidth, electronMasses, yOffset, energyMin, energyMax );

    const waveFunctions: number[][] = [];
    for ( let i = 0; i < energies.length; i++ ) {
      const waveFunction = calculateWaveFunction( quantumNumbers[ i ], wellDepth, wellWidth, electronMasses, xOffset, xGrid.xCoordinates );
      waveFunctions.push( waveFunction );
    }

    const potentialFunction = PoschlTellerSolution.createPotentialFunction( {
      numberOfWells: numberOfWells,
      xOffset: xOffset,
      yOffset: yOffset,
      wellWidth: wellWidth,
      wellDepth: wellDepth,
      electricField: electricField,
      spacing: spacing
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
 * Find all bound-state energies within the requested range.
 *
 * The exact closed-form formula is used; no root-finding is required.
 * All bound states satisfy −V₀ + y₀ < E_n < y₀.
 *
 * @param wellDepth - V₀ in eV (positive)
 * @param wellWidth - w in nm
 * @param electronMasses - Particle mass in electron masses
 * @param yOffset - Energy offset y₀ in eV
 * @param energyMin - Lower bound of requested range (eV)
 * @param energyMax - Upper bound of requested range (eV)
 * @returns Energies (eV) and corresponding quantum numbers
 */
function findBoundStateEnergies(
  wellDepth: number,
  wellWidth: number,
  electronMasses: number,
  yOffset: number,
  energyMin: number,
  energyMax: number
): { energies: number[]; quantumNumbers: number[] } {

  // λ = w · √(2mV₀) / ℏ; bound states exist for n = 0, 1, …, ⌊λ − ½⌋
  const lambda = wellWidth * Math.sqrt( 2 * electronMasses * wellDepth ) / HBAR;
  const nMax = Math.floor( lambda - 0.5 );

  const energies: number[] = [];
  const quantumNumbers: number[] = [];

  for ( let n = 0; n <= nMax; n++ ) {
    const alphaN = lambda - n - 0.5; // α_n = λ − n − ½
    // E_n = −V₀ · α_n² / λ² + y₀
    const energy = -wellDepth * alphaN * alphaN / ( lambda * lambda ) + yOffset;

    if ( energy >= energyMin && energy <= energyMax ) {
      energies.push( energy );
      quantumNumbers.push( n );
    }
  }

  return { energies: energies, quantumNumbers: quantumNumbers };
}

/**
 * Compute the normalized wave function for a single Pöschl-Teller eigenstate.
 *
 *   α = λ − n − ½              (Jacobi parameter for state n)
 *   t = tanh((x − x₀)/w)
 *   ψ_n(x) ∝ sech^α((x − x₀)/w) · P_n^{(α,α)}(t)
 *
 * Any non-finite values (from intermediate overflow at extreme x) are replaced with zero.
 *
 * @param n - Quantum number
 * @param wellDepth - V₀ in eV
 * @param wellWidth - w in nm
 * @param electronMasses - Particle mass in electron masses
 * @param xOffset - x₀ in nm
 * @param xArray - Array of x positions in nm
 * @returns Normalized wave function values
 */
function calculateWaveFunction(
  n: number,
  wellDepth: number,
  wellWidth: number,
  electronMasses: number,
  xOffset: number,
  xArray: readonly number[]
): number[] {

  const lambda = wellWidth * Math.sqrt( 2 * electronMasses * wellDepth ) / HBAR;
  const alpha = lambda - n - 0.5; // Jacobi parameter α = λ − n − ½

  const waveFunction: number[] = [];

  for ( const x of xArray ) {
    const xi = ( x - xOffset ) / wellWidth;
    const sech = 1 / Math.cosh( xi );
    const t = Math.tanh( xi );
    const poly = symmetricJacobiPolynomial( n, alpha, t );
    // ψ_n ∝ sech^α · P_n^{(α,α)}(t)
    const value = Math.pow( sech, alpha ) * poly;
    waveFunction.push( isFinite( value ) ? value : 0 );
  }

  const dx = xArray.length > 1 ? xArray[ 1 ] - xArray[ 0 ] : 0;
  return new WaveFunctionNormalizer().normalize( waveFunction, dx );
}

/**
 * Symmetric Jacobi polynomial P_n^{(α,α)}(t) via the stable 3-term recurrence
 * (DLMF 18.9.1 specialized to a = b = α) (see https://dlmf.nist.gov/18.9)
 *   P_0^{(α,α)}(t) = 1
 *   P_1^{(α,α)}(t) = (α + 1) · t
 *
 *   For k ≥ 2:
 *   2k(k+2α)(2k+2α−2) · P_k = (2k+2α−1)(2k+2α)(2k+2α−2)·t · P_{k−1}
 *                             − 2(k+α−1)²(2k+2α) · P_{k−2}
 *
 * The symmetry P_n^{(α,α)}(−t) = (−1)^n P_n^{(α,α)}(t) is preserved.
 *
 * @param n - Polynomial degree (quantum number)
 * @param alpha - Jacobi parameter α = λ − n − ½ (fixed for the whole recurrence)
 * @param t - Argument t = tanh((x − x₀)/w), t ∈ (−1, 1)
 * @returns P_n^{(α,α)}(t)
 */
function symmetricJacobiPolynomial( n: number, alpha: number, t: number ): number {
  if ( n === 0 ) {
    return 1;
  }
  if ( n === 1 ) {
    return ( alpha + 1 ) * t;
  }

  let pPrev2 = 1;
  let pPrev1 = ( alpha + 1 ) * t;

  for ( let k = 2; k <= n; k++ ) {
    const s = 2 * k + 2 * alpha; // 2k + 2α
    const pNext = ( ( s - 1 ) * s * ( s - 2 ) * t * pPrev1 - 2 * ( k + alpha - 1 ) * ( k + alpha - 1 ) * s * pPrev2 )
                / ( 2 * k * ( k + 2 * alpha ) * ( s - 2 ) );
    pPrev2 = pPrev1;
    pPrev1 = pNext;
  }

  return pPrev1;
}
