// Copyright 2026, University of Colorado Boulder

/**
 * Analytical solution for the finite square well.
 *
 * The finite square well extends the infinite well by allowing the potential to be
 * finite outside the well. Particles can penetrate into the classically forbidden
 * regions, demonstrating quantum tunneling.
 *
 * POTENTIAL:
 *   V(x) = -V₀   for |x| < L/2
 *   V(x) = 0     for |x| > L/2
 *
 * ENERGY EIGENVALUES:
 *   Energy eigenvalues are found by solving transcendental equations:
 *   - Even parity: tan(ξ) = η/ξ
 *   - Odd parity: -cot(ξ) = η/ξ
 *   where ξ = (L/2)√(2m(E+V₀)/ℏ²) and η = (L/2)√(-2mE/ℏ²)
 *
 * WAVEFUNCTIONS:
 *   Inside the well (|x| < L/2):
 *   - Even: ψ(x) = A cos(kx)
 *   - Odd: ψ(x) = A sin(kx)
 *   Outside the well (|x| > L/2):
 *   - Even: ψ(x) = B exp(-κ|x|)
 *   - Odd: ψ(x) = B sign(x) exp(-κ|x|)
 *   where k = √(2m(E+V₀)/ℏ²) and κ = √(-2mE/ℏ²)
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

/**
 * Parity of the wave function (even or odd symmetry).
 */
type Parity = 'even' | 'odd';

export default class FiniteSquareSolution {

  private constructor() {
    // Not intended for instantiation.
  }

  /**
   * Creates the potential function for a finite square well.
   * V(x) = -V₀ for |x| < L/2, V(x) = 0 for |x| > L/2
   *
   * @param wellWidth - Width of the well L in nm
   * @param wellDepth - Depth of the well V₀ in eV (positive value)
   * @returns Potential function V(x) in eV
   */
  public static createPotential( wellWidth: number, wellDepth: number ): PotentialFunction {
    return ( x: number ) => {
      // Inside well: V = -V₀
      // Outside well: V = 0
      if ( Math.abs( x ) < wellWidth / 2 ) {
        return -wellDepth;
      }
      return 0;
    };
  }

  /**
   * Analytical solution for the finite square well.
   *
   * This function returns a BoundStateResult compatible with NumerovSolver output.
   * The API matches NumerovSolver.solve() by taking energy bounds.
   *
   * @param xGrid - uniformly spaced x-coordinates in nm
   * @param wellWidth - Width of the well L in nm
   * @param wellDepth - Depth of the well V₀ in eV (positive value)
   * @param mass - Particle mass in electron masses
   * @param energyMin - Minimum energy to search (eV)
   * @param energyMax - Maximum energy to search (eV)
   * @returns Bound state results with energies (eV) and wave functions
   *
   * @example
   * // Solve for states within energy range
   * const L = 2; // 2 nm well
   * const V0 = 10; // 10 eV deep
   * const mass = 1; // electron mass
   *
   * const result = solveFiniteSquareWell(
   *   L,
   *   V0,
   *   mass,
   *   { xMin: -3, xMax: 3, numPoints: 1001 },  // ±3 nm
   *   -V0,
   *   0
   * );
   *
   * console.log( 'Number of bound states:', result.energies.length );
   */
  public static solve(
    xGrid: XGrid,
    wellWidth: number,
    wellDepth: number,
    mass: number,
    energyMin: number,
    energyMax: number
  ): BoundStateResult {

    // Find all bound state energies
    const { energies, parities } = findBoundStateEnergies(
      wellWidth,
      wellDepth,
      mass,
      energyMin,
      energyMax
    );

    // Calculate wave functions for each state
    const waveFunctions: number[][] = [];
    for ( let i = 0; i < energies.length; i++ ) {
      const waveFunction = calculateWaveFunction(
        energies[ i ],
        parities[ i ],
        wellWidth,
        wellDepth,
        mass,
        xGrid.xCoordinates
      );
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
 * Solve the transcendental equation for even parity states.
 * Equation: tan(ξ) = η/ξ where ξ = (L/2)k and η = (L/2)κ
 *
 * @param xi - Value of ξ
 * @param z0 - Value of (L/2)√(2mV₀/ℏ²)
 * @returns Value of the transcendental equation (zero at solutions)
 */
function evenParityEquation( xi: number, z0: number ): number {
  const eta = Math.sqrt( z0 * z0 - xi * xi );
  return Math.tan( xi ) - eta / xi;
}

/**
 * Solve the transcendental equation for odd parity states.
 * Equation: -cot(ξ) = η/ξ where ξ = (L/2)k and η = (L/2)κ
 *
 * @param xi - Value of ξ
 * @param z0 - Value of (L/2)√(2mV₀/ℏ²)
 * @returns Value of the transcendental equation (zero at solutions)
 */
function oddParityEquation( xi: number, z0: number ): number {
  const eta = Math.sqrt( z0 * z0 - xi * xi );
  return -1 / Math.tan( xi ) - eta / xi;
}

/**
 * Derivative of the even parity transcendental equation with respect to ξ.
 *
 * d/dξ [tan(ξ) − η/ξ] = sec²(ξ) + z₀² / (η ξ²)
 * (always positive → function is strictly increasing in each search interval)
 *
 * @param xi - Value of ξ
 * @param z0 - Value of (L/2)√(2mV₀/ℏ²)
 * @returns df/dξ for the even parity equation
 */
function evenParityDerivative( xi: number, z0: number ): number {
  const cos = Math.cos( xi );
  const eta = Math.sqrt( z0 * z0 - xi * xi );
  return 1 / ( cos * cos ) + z0 * z0 / ( eta * xi * xi );
}

/**
 * Derivative of the odd parity transcendental equation with respect to ξ.
 *
 * d/dξ [−cot(ξ) − η/ξ] = csc²(ξ) + z₀² / (η ξ²)
 * (always positive → function is strictly increasing in each search interval)
 *
 * @param xi - Value of ξ
 * @param z0 - Value of (L/2)√(2mV₀/ℏ²)
 * @returns df/dξ for the odd parity equation
 */
function oddParityDerivative( xi: number, z0: number ): number {
  const sin = Math.sin( xi );
  const eta = Math.sqrt( z0 * z0 - xi * xi );
  return 1 / ( sin * sin ) + z0 * z0 / ( eta * xi * xi );
}

/**
 * Find a root of a transcendental equation using dot's hybrid Newton/bisection.
 * Returns null if no sign change is detected (no bound state in this interval).
 *
 * @param f  - Transcendental equation (strictly increasing in the given interval)
 * @param df - Derivative of f
 * @param xiLeft  - Left bound
 * @param xiRight - Right bound
 * @returns Root of the equation, or null if none found
 */
function findRootInInterval(
  f: ( xi: number ) => number,
  df: ( xi: number ) => number,
  xiLeft: number,
  xiRight: number
): number | null {
  // No sign change → no bound state in this interval
  if ( f( xiLeft ) * f( xiRight ) > 0 ) {
    return null;
  }
  return findRoot( xiLeft, xiRight, 1e-10, f, df );
}

/**
 * Find all bound state energies for a finite square well.
 *
 * @param wellWidth - Width of the well L in nm
 * @param wellDepth - Depth of the well V₀ in eV (positive value)
 * @param mass - Particle mass in electron masses
 * @param energyMin - Minimum energy to search (eV)
 * @param energyMax - Maximum energy to search (eV)
 * @returns Arrays of energies and parities
 */
function findBoundStateEnergies(
  wellWidth: number,
  wellDepth: number,
  mass: number,
  energyMin: number,
  energyMax: number
): { energies: number[]; parities: Parity[] } {

  // All bound states have energies between -V₀ and 0
  const actualEnergyMin = Math.max( energyMin, -wellDepth );
  const actualEnergyMax = Math.min( energyMax, 0 );

  if ( actualEnergyMin >= actualEnergyMax ) {
    return { energies: [], parities: [] };
  }

  // Calculate z0 = (L/2)√(2mV₀/ℏ²)
  const z0 = ( wellWidth / 2 ) * Math.sqrt( 2 * mass * wellDepth / ( HBAR * HBAR ) );

  const energies: number[] = [];
  const parities: Parity[] = [];

  // Maximum number of bound states (approximate)
  const maxStates = Math.floor( z0 / ( Math.PI / 2 ) ) + 1;

  // Search for states systematically, alternating even/odd by state index
  let evenCount = 0;
  let oddCount = 0;

  for ( let stateIndex = 0; stateIndex < maxStates; stateIndex++ ) {
    let xi: number | null = null;
    let parity: Parity;

    // Alternate between even (stateIndex=0,2,4,...) and odd (stateIndex=1,3,5,...)
    if ( stateIndex % 2 === 0 ) {
      // Even parity state: search in interval [evenCount*π, (evenCount+1/2)*π]
      const xiMin = evenCount * Math.PI + 0.001;
      const xiMax = Math.min( evenCount * Math.PI + Math.PI / 2 - 0.001, z0 - 0.001 );

      if ( xiMin < xiMax && xiMin < z0 ) {
        xi = findRootInInterval(
          ( xiVal: number ) => evenParityEquation( xiVal, z0 ),
          ( xiVal: number ) => evenParityDerivative( xiVal, z0 ),
          xiMin, xiMax
        );
      }

      parity = 'even';
      evenCount++;
    }
    else {
      // Odd parity state: search in interval [(oddCount+1/2)*π, (oddCount+1)*π]
      const xiMin = oddCount * Math.PI + Math.PI / 2 + 0.001;
      const xiMax = Math.min( ( oddCount + 1 ) * Math.PI - 0.001, z0 - 0.001 );

      if ( xiMin < xiMax && xiMin < z0 ) {
        xi = findRootInInterval(
          ( xiVal: number ) => oddParityEquation( xiVal, z0 ),
          ( xiVal: number ) => oddParityDerivative( xiVal, z0 ),
          xiMin, xiMax
        );
      }

      parity = 'odd';
      oddCount++;
    }

    // Skip if state could not be found
    if ( xi === null ) {
      continue;
    }

    // Convert ξ back to energy: ξ = (L/2)√(2m(E+V₀)/ℏ²)
    // E = ξ²ℏ²/(2m(L/2)²) - V₀
    const energy = ( xi * xi * HBAR * HBAR ) / ( 2 * mass * ( wellWidth / 2 ) * ( wellWidth / 2 ) ) - wellDepth;

    // Check if energy is within requested bounds
    if ( energy >= actualEnergyMin && energy <= actualEnergyMax ) {
      energies.push( energy );
      parities.push( parity );
    }
  }

  return { energies: energies, parities: parities };
}

/**
 * Calculate normalized wave function for a finite square well state.
 *
 * @param energy - Energy of the state in eV
 * @param parity - Parity of the state (even or odd)
 * @param wellWidth - Width of the well L in nm
 * @param wellDepth - Depth of the well V₀ in eV (positive value)
 * @param mass - Particle mass in electron masses
 * @param xGridArray - Array of x positions in nm
 * @returns Normalized wave function array
 */
function calculateWaveFunction(
  energy: number,
  parity: Parity,
  wellWidth: number,
  wellDepth: number,
  mass: number,
  xGridArray: number[]
): number[] {

  // Calculate wave numbers
  const k = Math.sqrt( 2 * mass * ( energy + wellDepth ) / ( HBAR * HBAR ) );
  const kappa = Math.sqrt( -2 * mass * energy / ( HBAR * HBAR ) );

  const waveFunction: number[] = [];

  // Calculate wave function at each grid point
  for ( const x of xGridArray ) {
    let value: number;

    if ( Math.abs( x ) < wellWidth / 2 ) {
      // Inside the well
      if ( parity === 'even' ) {
        value = Math.cos( k * x );
      }
      else {
        value = Math.sin( k * x );
      }
    }
    else {
      // Outside the well - exponentially decaying
      if ( parity === 'even' ) {
        // Even: symmetric exponential decay
        const xEdge = wellWidth / 2;
        const amplitude = Math.cos( k * xEdge );
        value = amplitude * Math.exp( -kappa * ( Math.abs( x ) - xEdge ) );
      }
      else {
        // Odd: antisymmetric exponential decay
        const xEdge = wellWidth / 2;
        const amplitude = Math.sin( k * xEdge );
        const sign = x > 0 ? 1 : -1;
        value = sign * amplitude * Math.exp( -kappa * ( Math.abs( x ) - xEdge ) );
      }
    }

    waveFunction.push( value );
  }

  const dx = xGridArray.length > 1 ? xGridArray[ 1 ] - xGridArray[ 0 ] : 0;
  return new WaveFunctionNormalizer().normalize( waveFunction, dx );
}