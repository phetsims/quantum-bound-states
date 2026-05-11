// Copyright 2026, University of Colorado Boulder

//TODO Should this be promoted to a class that also handles time-dependent propagation?
/**
 * Result from a bound state calculation.
 *
 * @author Martin Martin Veillette
 *
 * Contains all information about the computed quantum states including
 * eigenvalues (energy levels), normalized wave functions, and the spatial grid.
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
 * const probability = psi0.map( psi => psi * psi );
 */

type NumericMethod = 'numerov' | 'analytical';

export type BoundStateResult = {
  potentials: number[];      // Potential energy values in eV, from left to right
  energies: number[];        // Eigenvalues (energy levels) in eV (sorted from lowest to highest) TODO change to energyLevels
  waveFunctions: number[][]; // Normalized wave functions (each row is one state) TODO change to waveFunctionSolutions?
  method: NumericMethod;     // Name of the numerical method used TODO do we need this?
};