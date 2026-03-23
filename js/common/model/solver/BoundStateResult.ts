// Copyright 2026, University of Colorado Boulder

/**
 * Result from a bound state calculation.
 *
 * @author Martin Martin Veillette
 *
 * Contains all information about the computed quantum states including
 * energy eigenvalues, normalized wave functions, and the spatial grid.
 *
 * @example
 *
 * // Describe the x-axis
 * const xGrid = new XGrid( -4, 4, 1001 );
 *
 * // Access computed results
 * const result: BoundStateResult = solver.solve( ... );
 *
 * // Get ground state energy
 * const E0 = result.eigenvalues[ 0 ];
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
  energies: number[];        // Energy eigenvalues in eV (sorted from lowest to highest)
  waveFunctions: number[][]; // Normalized wave functions (each row is one state)
  method: NumericMethod;     // Name of the numerical method used
};