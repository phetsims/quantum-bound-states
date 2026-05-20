// Copyright 2026, University of Colorado Boulder

/**
 * Analytical solution for a single-well Infinite Square potential (particle in a box).
 *
 * The infinite square well is the simplest quantum mechanical system where a particle
 * is confined to a region with impenetrable walls.
 *
 * POTENTIAL (well centred at x = x₀):
 *   V(x) = 0     for x₀ - L/2 < x < x₀ + L/2
 *   V(x) = ∞     otherwise
 *
 * ENERGY EIGENVALUES (independent of x₀):
 *   E_n = (n² π² ℏ²) / (2mL²)    for n = 1, 2, 3, ...
 *
 * WAVEFUNCTIONS:
 *   ψ_n(x) = √(2/L) sin(nπ((x - x₀) + L/2)/L),  x₀ - L/2 ≤ x ≤ x₀ + L/2
 *   ψ_n(x) = 0,  |x - x₀| > L/2
 *
 * @author Martin Veillette
 */

import affirm from '../../../../../../perennial-alias/js/browser-and-node/affirm.js';
import { BoundStateResult } from '../BoundStateResult.js';
import NumerovSolver from '../NumerovSolver.js';
import { PotentialFunction } from '../PotentialFunction.js';
import XGrid from '../XGrid.js';

const HBAR = NumerovSolver.HBAR;

// Absolute energy value used for the infinite walls in eV
const BARRIER_HEIGHT = 1000;

// Parameters for createPotentialFunction method
type PotentialParameters = {
  numberOfWells: number;
  xOffset: number; // Horizontal position x₀ of the singularity in nm
  yOffset: number; // Constant energy shift y₀ in eV
  wellWidth: number; // Width of the well L in nm
  electricField: number; // Electric field in V/nm
};

// Parameters for solve method
type SolveParameters = {
  energyMin: number; // Minimum energy to search (eV)
  energyMax: number; // Maximum energy to search (eV)
  electronMasses: number; // Particle mass in electron masses
} & PotentialParameters;

export default class InfiniteSquareSolution {

  private constructor() {
    // Not intended for instantiation.
  }

  /**
   * Creates the potential function for a single-well Infinite Square potential.
   */
  public static createPotentialFunction( parameters: PotentialParameters ): PotentialFunction {

    // Unpack parameters
    const { numberOfWells, xOffset, yOffset, wellWidth, electricField } = parameters;
    affirm( numberOfWells === 1, 'InfiniteSquareSolution does not support multiple wells' );
    affirm( electricField === 0, 'InfiniteSquareSolution does not support electric field' );

    const halfWidth = wellWidth / 2;
    return ( x: number ) => {
      const xLocal = x - xOffset;
      return ( xLocal >= -halfWidth && xLocal <= halfWidth ) ? yOffset : BARRIER_HEIGHT;
    };
  }

  //TODO https://github.com/phetsims/quantum-bound-states/issues/43 What is "the lab frame"?
  /**
   * Analytical solution for a single-well Infinite Square potential.
   *
   * Energies are accepted and returned in the lab frame. yOffset is the energy of the well
   * bottom; the solver converts to the well frame internally and shifts eigenvalues back before
   * returning, so callers never need to manage the frame conversion themselves.
   */
  public static solve( xGrid: XGrid, parameters: SolveParameters ): BoundStateResult {

    // Unpack parameters
    const { numberOfWells, energyMin, energyMax, wellWidth, xOffset, yOffset, electronMasses, electricField } = parameters;
    affirm( numberOfWells === 1, 'InfiniteSquareSolution does not support multiple wells' );
    affirm( electricField === 0, 'InfiniteSquareSolution does not support electric field' );

    // Work in the well frame where the well bottom is at E = 0.
    const wellEnergyMin = energyMin - yOffset;
    const wellEnergyMax = energyMax - yOffset;

    // Calculate energies: E_n = (n² π² ℏ²) / (2mL²) for n = 1, 2, 3, ...
    // Find all n where wellEnergyMin <= E_n <= wellEnergyMax

    // Solve for n from E_n = (n² π² ℏ²) / (2mL²)
    // n = √(2mL² E_n / (π² ℏ²))
    const factor = 2 * electronMasses * wellWidth * wellWidth / ( Math.PI * Math.PI * HBAR * HBAR );

    // Find minimum n: n >= √(2mL² wellEnergyMin / (π² ℏ²))
    // Important: n starts at 1, not 0!
    const nMin = Math.max( 1, Math.ceil( Math.sqrt( factor * wellEnergyMin ) ) );

    // Find maximum n: n <= √(2mL² wellEnergyMax / (π² ℏ²))
    const nMax = Math.floor( Math.sqrt( factor * wellEnergyMax ) );

    // Collect all quantum numbers within the energy range
    const quantumNumbers: number[] = [];
    const energies: number[] = [];
    for ( let n = nMin; n <= nMax; n++ ) {

      // Well-frame eigenvalue shifted back to the lab frame.
      const energy = ( n * n * Math.PI * Math.PI * HBAR * HBAR ) / ( 2 * electronMasses * wellWidth * wellWidth ) + yOffset;
      quantumNumbers.push( n );
      energies.push( energy );
    }

    // Calculate wave functions: ψ_n(x) = √(2/L) sin(nπ((x - x₀) + L/2)/L)
    // The well is centred at x₀ = xOffset; (x - xOffset) maps to the well frame.
    const waveFunctions: number[][] = [];
    const normalization = Math.sqrt( 2 / wellWidth );
    const halfWidth = wellWidth / 2;

    for ( const n of quantumNumbers ) {
      const waveFunction: number[] = [];

      for ( const x of xGrid.xCoordinates ) {
        const xLocal = x - xOffset;

        // Wave function is zero outside the well [x₀ - L/2, x₀ + L/2]
        if ( xLocal <= -halfWidth || xLocal >= halfWidth ) {
          waveFunction.push( 0 );
        }
        else {
          // Inside the well: ψ_n(x) = √(2/L) sin(nπ((x - x₀) + L/2)/L)
          const value = normalization * Math.sin( n * Math.PI * ( xLocal + halfWidth ) / wellWidth );
          waveFunction.push( value );
        }
      }
      waveFunctions.push( waveFunction );
    }

    const potentialFunction = InfiniteSquareSolution.createPotentialFunction( {
      numberOfWells: numberOfWells,
      xOffset: xOffset,
      yOffset: yOffset,
      wellWidth: wellWidth,
      electricField: electricField
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
