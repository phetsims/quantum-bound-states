// Copyright 2026, University of Colorado Boulder

/**
 * FiniteSquareSolution implements the analytical solution for a single-well Finite Square potential.
 * It computes the potential energy curve for single-well and multi-well potentials.
 *
 * The finite square well extends the infinite well by allowing the potential to be
 * finite outside the well. Particles can penetrate into the classically forbidden
 * regions, demonstrating quantum tunneling.
 *
 * POTENTIAL for single well with no electric field (with xOffset and yOffset):
 *   V(x) = yOffset           for |x − x₀| < L/2  (inside well)
 *   V(x) = yOffset + V₀     for |x − x₀| > L/2  (outside well)
 *
 * Internally the solver works in a shifted coordinate frame where V_inside = −V₀
 * and V_outside = 0 (the standard textbook convention). The physical energy is
 * related to the internal energy by:
 *   E_phys = E_int + yOffset + V₀
 *
 * ENERGY EIGENVALUES:
 *   Energy eigenvalues are found by solving transcendental equations:
 *   - Even parity: tan(ξ) = η/ξ
 *   - Odd parity: -cot(ξ) = η/ξ
 *   where ξ = (L/2)√(2m(E_int+V₀)/ℏ²) and η = (L/2)√(−2mE_int/ℏ²)
 *
 * WAVEFUNCTIONS:
 *   Inside the well (|x − x₀| < L/2):
 *   - Even: ψ(x) = A cos(k(x − x₀))
 *   - Odd:  ψ(x) = A sin(k(x − x₀))
 *   Outside the well (|x − x₀| > L/2):
 *   - Even: ψ(x) = B exp(−κ|x − x₀|)
 *   - Odd:  ψ(x) = B sign(x − x₀) exp(−κ|x − x₀|)
 *   where k = √(2m(E_phys − yOffset)/ℏ²) and κ = √(2m(yOffset + V₀ − E_phys)/ℏ²)
 *
 *  The createPotentialFunction method is more general than the solve method, 
 *  it allows for multiple wells and a non-zero electric field. 
 *  See https://github.com/phetsims/quantum-bound-states/issues/43
 * 
 * @author Martin Veillette
 */

import { findRoot } from '../../../../../../dot/js/util/findRoot.js';
import affirm from '../../../../../../perennial-alias/js/browser-and-node/affirm.js';
import QBSConstants from '../../../QBSConstants.js';
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

// Parameters for createPotentialFunction method
type PotentialParameters = {
  numberOfWells: number;
  xOffset: number; // Horizontal position x₀ of the well center in nm
  yOffset: number; // Constant energy shift y₀ in eV
  wellWidth: number; // Width of the well L in nm
  wellDepth: number; // Depth of the well V₀ in eV
  electricField: number; // Electric field in V/nm
  separation: number; // Wall-to-wall distance between adjacent wells in nm (default: 0)
};

// Parameters for solve method
type SolveParameters = {
  energyMin: number; // Minimum energy to search (eV)
  energyMax: number; // Maximum energy to search (eV)
  electronMasses: number; // Particle mass in electron masses
} & PotentialParameters;

export default class FiniteSquareSolution {

  private constructor() {
    // Not intended for instantiation.
  }

  /**
   * Creates the potential energy function V(x) for one or more finite square wells.
   *
   * At each position x, the function evaluates a piecewise-constant baseline plus a linear
   * electric-field term. The baseline is yOffset inside any well and yOffset + wellDepth
   * outside all wells; wells are placed symmetrically about xOffset with center-to-center
   * spacing wellWidth + separation. The returned function adds electricField * x to that
   * baseline, so a uniform electric field tilts the entire potential.
   *
   * This potential definition is general: it is valid for multiple wells and for a non-zero
   * electric field. The analytical solve() method in this class is more restricted—it only
   * applies to a single well with no electric field. See https://github.com/phetsims/quantum-bound-states/issues/43
   * 
   * @param parameters - See PotentialParameters
   * @returns Potential function V(x) in eV
   */
  public static createPotentialFunction( parameters: PotentialParameters ): PotentialFunction {

    // Unpack parameters
    const { numberOfWells, xOffset, yOffset, wellWidth, wellDepth, electricField } = parameters;
    const separation = parameters.separation ?? 0;

    const centerToCenter = wellWidth + separation; // center-to-center spacing between adjacent wells

    return ( x: number ) => {
      let potentialEnergy = wellDepth;
      for ( let i = 1; i <= numberOfWells; i++ ) {
        const xi = centerToCenter * ( i - ( numberOfWells + 1 ) / 2 );
        if ( ( x - xOffset ) >= xi - wellWidth / 2 && ( x - xOffset ) <= xi + wellWidth / 2 ) {
          potentialEnergy = 0;
          break;
        }
      }
      potentialEnergy += yOffset + electricField * ( x - xOffset );

      affirm( potentialEnergy < QBSConstants.EFFECTIVELY_INFINITE_POTENTIAL_ENERGY );
      return potentialEnergy;
    };
  }

  /**
   * Analytical solution for a single-well Finite Square potential.
   */
  public static solve( xGrid: XGrid, parameters: SolveParameters ): BoundStateResult {

    // Unpack parameters
    const { numberOfWells, energyMin, energyMax, xOffset, yOffset, wellWidth, wellDepth, electronMasses, electricField, separation } = parameters;
    affirm( numberOfWells === 1, 'FiniteSquareSolution does not support multiple wells' );
    affirm( electricField === 0, 'FiniteSquareSolution does not support electric field' );

    // Find all bound state energies (returned in physical coordinates)
    const { energies, parities } = findBoundStateEnergies(
      wellWidth,
      wellDepth,
      electronMasses,
      yOffset,
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
        electronMasses,
        yOffset,
        xOffset,
        xGrid.xCoordinates
      );
      waveFunctions.push( waveFunction );
    }

    const potentialFunction = FiniteSquareSolution.createPotentialFunction( {
      numberOfWells: numberOfWells,
      xOffset: xOffset,
      yOffset: yOffset,
      wellWidth: wellWidth,
      wellDepth: wellDepth,
      electricField: electricField,
      separation: separation
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
 * Internally uses the textbook convention V_inside = −V₀, V_outside = 0.
 * The returned energies are in physical units (shifted by yOffset + V₀).
 *
 * @param wellWidth - Width of the well L in nm
 * @param wellDepth - Depth of the well V₀ in eV (positive value)
 * @param electronMasses - Particle mass in electron masses
 * @param yOffset - Energy shift y₀ in eV (well bottom is at yOffset)
 * @param energyMin - Minimum physical energy to search (eV)
 * @param energyMax - Maximum physical energy to search (eV)
 * @returns Arrays of physical energies (eV) and parities
 */
function findBoundStateEnergies(
  wellWidth: number,
  wellDepth: number,
  electronMasses: number,
  yOffset: number,
  energyMin: number,
  energyMax: number
): { energies: number[]; parities: Parity[] } {

  // Internally energies are measured from the dissociation limit (V_outside = 0).
  // Physical and internal energies are related by: E_phys = E_int + yOffset + wellDepth.
  const energyShift = yOffset + wellDepth;

  // Clamp requested range to the valid internal bound-state range (−V₀, 0).
  const internalEnergyMin = Math.max( energyMin - energyShift, -wellDepth );
  const internalEnergyMax = Math.min( energyMax - energyShift, 0 );

  if ( internalEnergyMin >= internalEnergyMax ) {
    return { energies: [], parities: [] };
  }

  // Calculate z0 = (L/2)√(2mV₀/ℏ²)
  const z0 = ( wellWidth / 2 ) * Math.sqrt( 2 * electronMasses * wellDepth / ( HBAR * HBAR ) );

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
      // Even parity state: search in interval [evenCount*π, (evenCount+1/2)*π].
      // Use 1e-9 as the upper guard against the z0 singularity so that the
      // ground state is found even when z0 is very small (≪ 0.001) — the 1D finite square
      // well ALWAYS has at least one bound state, and its root ξ₁ approaches z0 from below
      // as the well becomes shallow/narrow.
      const xiMin = evenCount * Math.PI + 0.001;
      const xiMax = Math.min( evenCount * Math.PI + Math.PI / 2 - 0.001, z0 - 1e-9 );

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
      // Odd parity state: search in interval [(oddCount+1/2)*π, (oddCount+1)*π].
      // Same rationale: use 1e-9 guard instead of 0.001 for the z0 upper bound.
      const xiMin = oddCount * Math.PI + Math.PI / 2 + 0.001;
      const xiMax = Math.min( ( oddCount + 1 ) * Math.PI - 0.001, z0 - 1e-9 );

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

    if ( xi === null ) {
      continue;
    }

    // Convert ξ to internal energy: E_int = ξ²ℏ²/(2m(L/2)²) − V₀
    const internalEnergy = ( xi * xi * HBAR * HBAR ) / ( 2 * electronMasses * ( wellWidth / 2 ) * ( wellWidth / 2 ) ) - wellDepth;

    // Convert to physical energy and check if within requested bounds
    const physicalEnergy = internalEnergy + energyShift;
    if ( physicalEnergy >= energyMin && physicalEnergy <= energyMax ) {
      energies.push( physicalEnergy );
      parities.push( parity );
    }
  }

  return { energies: energies, parities: parities };
}

/**
 * Calculate normalized wave function for a finite square well state.
 *
 * @param energy - Physical energy of the state in eV
 * @param parity - Parity of the state (even or odd)
 * @param wellWidth - Width of the well L in nm
 * @param wellDepth - Depth of the well V₀ in eV (positive value)
 * @param electronMasses - Particle mass in electron masses
 * @param yOffset - Energy shift y₀ in eV (well bottom is at yOffset)
 * @param xOffset - Horizontal position x₀ of the well center in nm
 * @param xGridArray - Array of x positions in nm
 * @returns Normalized wave function array
 */
function calculateWaveFunction(
  energy: number,
  parity: Parity,
  wellWidth: number,
  wellDepth: number,
  electronMasses: number,
  yOffset: number,
  xOffset: number,
  xGridArray: readonly number[]
): number[] {

  // Wave number inside the well (kinetic energy = E_phys − V_inside = E_phys − yOffset)
  const k = Math.sqrt( 2 * electronMasses * ( energy - yOffset ) / ( HBAR * HBAR ) );

  // Decay constant outside the well (barrier height = V_outside − E_phys = yOffset + V₀ − E_phys)
  const kappa = Math.sqrt( 2 * electronMasses * ( yOffset + wellDepth - energy ) / ( HBAR * HBAR ) );

  const waveFunction: number[] = [];

  for ( const x of xGridArray ) {
    let value: number;
    const xRel = x - xOffset; // position relative to well center

    if ( Math.abs( xRel ) < wellWidth / 2 ) {
      // Inside the well
      if ( parity === 'even' ) {
        value = Math.cos( k * xRel );
      }
      else {
        value = Math.sin( k * xRel );
      }
    }
    else {
      // Outside the well - exponentially decaying, continuous at the well edge
      const xEdge = wellWidth / 2;
      if ( parity === 'even' ) {
        const amplitude = Math.cos( k * xEdge );
        value = amplitude * Math.exp( -kappa * ( Math.abs( xRel ) - xEdge ) );
      }
      else {
        const amplitude = Math.sin( k * xEdge );
        const sign = xRel > 0 ? 1 : -1;
        value = sign * amplitude * Math.exp( -kappa * ( Math.abs( xRel ) - xEdge ) );
      }
    }

    waveFunction.push( value );
  }

  const dx = xGridArray.length > 1 ? xGridArray[ 1 ] - xGridArray[ 0 ] : 0;
  return new WaveFunctionNormalizer().normalize( waveFunction, dx );
}
