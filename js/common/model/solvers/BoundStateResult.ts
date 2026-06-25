// Copyright 2026, University of Colorado Boulder

//TODO Convert this to a class and add BoundStateResultIO with data-type serialization.
/**
 * BoundStateResult is the result from a bound state calculation. It contains all information about
 * the computed quantum state, including potential energy values, energy levels, and normalized
 * wave functions.
 *
 * @author Martin Martin Veillette
 *
 * @example
 *
 * // Describe the x-axis
 * const xGrid = new XGrid( -4, 4, 1001 );
 *
 * // Access computed results
 * const result: BoundStateResult = NumerovSolver.solve( ... );
 *
 * // Get ground state energy
 * const E0 = result.energies[ 0 ];
 *
 * // Get ground state wave function
 * const psi0 = result.waveFunctions[ 0 ];
 *
 * // Plot wave function
 * for ( let i = 0; i < xGrid.xCoordinates.length; i++ ) {
 *   plot( xGrid.xCoordinates[ i ], psi0[ i ] );
 * }
 *
 * // Calculate probability density
 * const probabilityDensity = psi0.map( psi => psi * psi );
 */

// Enumeration of methods used to compute the bound state
type NumericMethod = 'numerov' | 'analytical';

export type BoundStateResult = {
  potentials: number[];      // Potential energy values in eV, from left to right
  energies: number[];        // Eigenvalues (energy levels) in eV (sorted from lowest to highest) TODO change to energyLevels
  waveFunctions: number[][]; // Normalized wave functions (each row is one state) TODO change to waveFunctionSolutions?
  method: NumericMethod;     // Name of the method used to compute the bound state TODO do we need this?
};