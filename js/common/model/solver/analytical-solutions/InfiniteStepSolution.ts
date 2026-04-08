// Copyright 2026, University of Colorado Boulder

/**
 * Analytical solution for the infinite step potential (infinite square well with an interior step).
 *
 * The well has impenetrable walls, but the floor is not flat: the right half sits at a higher
 * potential V₀ than the left half.  A particle in the left half "sees" a step barrier of height
 * V₀ at the centre; a particle with enough energy can classically enter the right half as well.
 *
 * POTENTIAL:
 *   V(x) = ∞       for x ≤ -L/2
 *   V(x) = 0       for -L/2 < x < 0      (left half)
 *   V(x) = V₀      for  0   < x < L/2    (right half, step)
 *   V(x) = ∞       for x ≥  L/2
 *
 * SOLUTIONS IN EACH REGION:
 *   Left  ( -L/2 < x < 0 ):
 *     ψ₁(x) = A sin( k₁(x + L/2) ),   k₁ = √(2mE/ℏ²)
 *     [automatically satisfies ψ(-L/2) = 0]
 *
 *   Right ( 0 < x < L/2 ) – two sub-cases:
 *     E > V₀:  ψ₂(x) = B sin( k₂(L/2 - x) ),   k₂ = √(2m(E-V₀)/ℏ²)
 *     E < V₀:  ψ₂(x) = C sinh( κ₂(L/2 - x) ),  κ₂ = √(2m(V₀-E)/ℏ²)
 *     [both automatically satisfy ψ(+L/2) = 0]
 *
 * MATCHING AT x = 0 (continuity of ψ and ψ′):
 *   E > V₀:  k₁ cot(k₁ L/2) + k₂ cot(k₂ L/2) = 0
 *   E < V₀:  k₁ cot(k₁ L/2) + κ₂ coth(κ₂ L/2) = 0
 *
 * @author Martin Veillette
 */

import { findRoot } from '../../../../../../dot/js/util/findRoot.js';
import { BoundStateResult } from '../BoundStateResult.js';
import NumerovSolver from '../NumerovSolver.js';
import { PotentialFunction } from '../PotentialFunction.js';
import WaveFunctionNormalizer from '../WaveFunctionNormalizer.js';
import XGrid from '../XGrid.js';

const HBAR = NumerovSolver.HBAR;

export default class InfiniteStepSolution {

  private constructor() {
    // Not intended for instantiation.
  }

  /**
   * Creates the potential function for an infinite step potential.
   *
   * @param wellWidth - Total width of the well L in nm (centred at x = 0)
   * @param stepHeight - Height of the potential step V₀ in eV (right half)
   * @param barrierHeight - Value used to represent the infinite walls in eV (default 1000 eV)
   * @returns Potential function V(x) in eV
   */
  public static createPotential( wellWidth: number, stepHeight: number, barrierHeight = 1000 ): PotentialFunction {
    const halfWidth = wellWidth / 2;
    return ( x: number ) => {
      if ( x <= -halfWidth || x >= halfWidth ) {
        return barrierHeight;
      }
      else if ( x >= 0 ) {
        return stepHeight;
      }
      else {
        return 0;
      }
    };
  }

  /**
   * Analytical solution for the infinite step potential.
   *
   * Returns a BoundStateResult compatible with NumerovSolver output.
   *
   * @param xGrid - Uniformly spaced x-coordinates in nm
   * @param wellWidth - Total width of the well L in nm
   * @param stepHeight - Height of the potential step V₀ in eV
   * @param mass - Particle mass in electron masses
   * @param energyMin - Minimum energy to search (eV)
   * @param energyMax - Maximum energy to search (eV)
   * @returns Bound state results with energies (eV) and wave functions
   */
  public static solve(
    xGrid: XGrid,
    wellWidth: number,
    stepHeight: number,
    mass: number,
    energyMin: number,
    energyMax: number
  ): BoundStateResult {

    const energies = findBoundStateEnergies( wellWidth, stepHeight, mass, energyMin, energyMax );

    const waveFunctions: number[][] = [];
    for ( const energy of energies ) {
      const waveFunction = calculateWaveFunction( energy, wellWidth, stepHeight, mass, xGrid.xCoordinates );
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
 * Value of the transcendental equation whose zeros are the bound-state energies.
 *
 * For E > V₀:  f = k₁ cot(k₁ L/2) + k₂ cot(k₂ L/2)
 * For E < V₀:  f = k₁ cot(k₁ L/2) + κ₂ coth(κ₂ L/2)
 *
 * The function diverges when k₁ L/2 = n π (singularities of cot). These are the same energies
 * as the even-indexed states of a symmetric infinite well of total width L.
 *
 * @param energy - Candidate energy (eV), must be > 0
 * @param wellWidth - Total width of the well L in nm
 * @param stepHeight - Step height V₀ in eV
 * @param mass - Particle mass in electron masses
 * @returns Value of the matching equation (zero at eigenvalues)
 */
function transcendentalEquation( energy: number, wellWidth: number, stepHeight: number, mass: number ): number {
  const halfWidth = wellWidth / 2;
  const k1 = Math.sqrt( 2 * mass * energy / ( HBAR * HBAR ) );
  const arg1 = k1 * halfWidth;

  const leftTerm = k1 / Math.tan( arg1 ); // k₁ cot(k₁ L/2)

  let rightTerm: number;
  if ( energy > stepHeight ) {
    // Oscillatory right region
    const k2 = Math.sqrt( 2 * mass * ( energy - stepHeight ) / ( HBAR * HBAR ) );
    const arg2 = k2 * halfWidth;
    rightTerm = k2 / Math.tan( arg2 ); // k₂ cot(k₂ L/2)
  }
  else {
    // Evanescent right region (energy < stepHeight)
    const kappa2 = Math.sqrt( 2 * mass * ( stepHeight - energy ) / ( HBAR * HBAR ) );
    const arg2 = kappa2 * halfWidth;
    // coth(u) = cosh(u)/sinh(u); use the identity coth(u) = 1/tanh(u)
    rightTerm = kappa2 / Math.tanh( arg2 ); // κ₂ coth(κ₂ L/2)
  }

  return leftTerm + rightTerm;
}

/**
 * Derivative of the transcendental equation with respect to energy.
 *
 * Using d/dE [k cot(ka)] = (m/ℏ²k) · (cot(ka) - ka/sin²(ka))
 * and   d/dE [κ coth(κa)] = (-m/ℏ²κ) · (coth(κa) - κa/sinh²(κa))
 *
 * @param energy - Candidate energy (eV), must be > 0
 * @param wellWidth - Total width of the well L in nm
 * @param stepHeight - Step height V₀ in eV
 * @param mass - Particle mass in electron masses
 * @returns df/dE at the given energy
 */
function transcendentalDerivative( energy: number, wellWidth: number, stepHeight: number, mass: number ): number {
  const halfWidth = wellWidth / 2;
  const hbar2 = HBAR * HBAR;
  const k1 = Math.sqrt( 2 * mass * energy / hbar2 );
  const arg1 = k1 * halfWidth;
  const sin1 = Math.sin( arg1 );

  // d/dE [k₁ cot(k₁ a)] = (m / ℏ²k₁) · (cot(k₁a) - k₁a / sin²(k₁a))
  const dLeftTerm = ( mass / ( hbar2 * k1 ) ) * ( Math.cos( arg1 ) / sin1 - arg1 / ( sin1 * sin1 ) );

  let dRightTerm: number;
  if ( energy > stepHeight ) {
    const k2 = Math.sqrt( 2 * mass * ( energy - stepHeight ) / hbar2 );
    const arg2 = k2 * halfWidth;
    const sin2 = Math.sin( arg2 );
    // d/dE [k₂ cot(k₂ a)] = (m / ℏ²k₂) · (cot(k₂a) - k₂a / sin²(k₂a))
    dRightTerm = ( mass / ( hbar2 * k2 ) ) * ( Math.cos( arg2 ) / sin2 - arg2 / ( sin2 * sin2 ) );
  }
  else {
    const kappa2 = Math.sqrt( 2 * mass * ( stepHeight - energy ) / hbar2 );
    const arg2 = kappa2 * halfWidth;
    const sinh2 = Math.sinh( arg2 );
    // d/dE [κ₂ coth(κ₂ a)] = (-m / ℏ²κ₂) · (coth(κ₂a) - κ₂a / sinh²(κ₂a))
    dRightTerm = ( -mass / ( hbar2 * kappa2 ) ) * ( Math.cosh( arg2 ) / sinh2 - arg2 / ( sinh2 * sinh2 ) );
  }

  return dLeftTerm + dRightTerm;
}

/**
 * Find all bound-state energies using a scan-and-bisect strategy.
 *
 * The transcendental equation has singularities at energies where k₁ L/2 = n π and (for
 * E > V₀) where k₂ L/2 = n π.  We partition the search range at these singularities so that
 * the function is continuous within each sub-interval, then hunt for sign changes and bisect.
 *
 * @param wellWidth - Total width of the well L in nm
 * @param stepHeight - Step height V₀ in eV
 * @param mass - Particle mass in electron masses
 * @param energyMin - Lower bound of search range (eV)
 * @param energyMax - Upper bound of search range (eV)
 * @returns Array of eigenvalues in ascending order (eV)
 */
function findBoundStateEnergies(
  wellWidth: number,
  stepHeight: number,
  mass: number,
  energyMin: number,
  energyMax: number
): number[] {

  // Bound states exist only for E > 0 (left region must be classically accessible).
  const eMin = Math.max( energyMin, 1e-6 );
  const eMax = energyMax;

  if ( eMin >= eMax ) {
    return [];
  }

  // Collect the energies at which cot(k₁ L/2) diverges: k₁ L/2 = n π  →  E_n = (2nπ/L)² ℏ²/(2m)
  // These are the singularities in the left-region term.
  const singularities: number[] = [];
  const halfWidth = wellWidth / 2;

  for ( let n = 1; ; n++ ) {
    const k1Singular = n * Math.PI / halfWidth;
    const eSingular = k1Singular * k1Singular * HBAR * HBAR / ( 2 * mass );
    if ( eSingular > eMax ) {
      break;
    }
    singularities.push( eSingular );
  }

  // Also include singularities from the right region when E > V₀: k₂ L/2 = n π
  for ( let n = 1; ; n++ ) {
    const k2Singular = n * Math.PI / halfWidth;
    const eSingular = stepHeight + k2Singular * k2Singular * HBAR * HBAR / ( 2 * mass );
    if ( eSingular > eMax ) {
      break;
    }
    singularities.push( eSingular );
  }

  // Build a sorted, unique list of interval break-points
  const breakPoints = [ eMin, ...singularities.filter( s => s > eMin && s < eMax ), eMax ];
  breakPoints.sort( ( a, b ) => a - b );

  // Scan each sub-interval for sign changes and bisect to find roots
  const energies: number[] = [];
  const MARGIN = 1e-9; // stay clear of singularities

  for ( let i = 0; i < breakPoints.length - 1; i++ ) {
    const lo = breakPoints[ i ] + MARGIN;
    const hi = breakPoints[ i + 1 ] - MARGIN;

    if ( lo >= hi ) {
      continue;
    }

    const root = findRootInInterval(
      ( e: number ) => transcendentalEquation( e, wellWidth, stepHeight, mass ),
      ( e: number ) => transcendentalDerivative( e, wellWidth, stepHeight, mass ),
      lo,
      hi
    );

    if ( root !== null ) {
      energies.push( root );
    }
  }

  return energies;
}

/**
 * Find a root in an interval using dot's findRoot (hybrid Newton/bisection).
 * Returns null if no sign change is detected (no bound state in this interval).
 *
 * findRoot requires the function to be increasing through the root (f < 0 left,
 * f > 0 right); we negate both f and df when the function is decreasing.
 *
 * @param f  - Continuous function on [lo, hi]
 * @param df - Derivative of f
 * @param lo - Left endpoint
 * @param hi - Right endpoint
 * @returns The root, or null if none found
 */
function findRootInInterval(
  f: ( e: number ) => number,
  df: ( e: number ) => number,
  lo: number,
  hi: number
): number | null {

  const fLo = f( lo );
  const fHi = f( hi );

  // No sign change → no bound state in this interval
  if ( fLo * fHi > 0 ) {
    return null;
  }

  // findRoot requires f to go from − to + through the root; negate if decreasing.
  if ( fLo < 0 ) {
    return findRoot( lo, hi, 1e-10, f, df );
  }
  else {
    return findRoot( lo, hi, 1e-10, e => -f( e ), e => -df( e ) );
  }
}

/**
 * Compute the normalised wave function for a single eigenstate.
 *
 * @param energy - Eigenvalue in eV
 * @param wellWidth - Total width of the well L in nm
 * @param stepHeight - Step height V₀ in eV
 * @param mass - Particle mass in electron masses
 * @param xArray - Array of x positions in nm
 * @returns Normalised wave function values
 */
function calculateWaveFunction(
  energy: number,
  wellWidth: number,
  stepHeight: number,
  mass: number,
  xArray: number[]
): number[] {

  const halfWidth = wellWidth / 2;
  const k1 = Math.sqrt( 2 * mass * energy / ( HBAR * HBAR ) );

  // Amplitude ratio B/A (or C/A) from continuity of ψ at x = 0.
  // ψ₁(0) = A sin(k₁ L/2),  so we set A = 1 and derive B or C.
  const psi1AtZero = Math.sin( k1 * halfWidth );

  // Unnormalised wave function: A = 1
  const waveFunction: number[] = [];

  for ( const x of xArray ) {
    let value: number;

    if ( x <= -halfWidth || x >= halfWidth ) {
      // Outside the well – infinite walls force ψ = 0
      value = 0;
    }
    else if ( x < 0 ) {
      // Left region: ψ₁(x) = sin( k₁(x + L/2) )
      value = Math.sin( k1 * ( x + halfWidth ) );
    }
    else {
      // Right region
      if ( energy > stepHeight ) {
        const k2 = Math.sqrt( 2 * mass * ( energy - stepHeight ) / ( HBAR * HBAR ) );
        const psi2AtZero = Math.sin( k2 * halfWidth );
        // Amplitude ratio from ψ₁(0) = B ψ₂_unit(0):  B = psi1AtZero / psi2AtZero
        const B = psi2AtZero !== 0 ? psi1AtZero / psi2AtZero : 0;
        value = B * Math.sin( k2 * ( halfWidth - x ) );
      }
      else {
        // Evanescent right region
        const kappa2 = Math.sqrt( 2 * mass * ( stepHeight - energy ) / ( HBAR * HBAR ) );
        const psi2AtZero = Math.sinh( kappa2 * halfWidth );
        const C = psi2AtZero !== 0 ? psi1AtZero / psi2AtZero : 0;
        value = C * Math.sinh( kappa2 * ( halfWidth - x ) );
      }
    }

    waveFunction.push( value );
  }

  const dx = xArray.length > 1 ? xArray[ 1 ] - xArray[ 0 ] : 0;
  return new WaveFunctionNormalizer().normalize( waveFunction, dx );
}