// Copyright 2026, University of Colorado Boulder

/**
 * Result from a bound state calculation.
 *
 * @author Martin Martin Veillette
 *
 * Contains all information about the computed quantum states including
 * energy eigenvalues, normalized wavefunctions, and the spatial grid.
 *
 * @example
 * // Access computed results
 * const result: BoundStateResult = solver.solve( ... );
 *
 * // Get ground state energy
 * const E0 = result.energies[ 0 ];
 *
 * // Get ground state wavefunction
 * const psi0 = result.wavefunctions[ 0 ];
 *
 * // Plot wavefunction
 * for ( let i = 0; i < result.xGrid.length; i++ ) {
 *   plot( result.xGrid[ i ], psi0[ i ] );
 * }
 *
 * // Calculate probability density
 * const probability = psi0.map( psi => psi * psi );
 */
export type BoundStateResult = {
  energies: number[];       // Energy eigenvalues in Joules (sorted from lowest to highest)
  wavefunctions: number[][]; // Normalized wavefunctions (each row is one state)
  xGridArray: number[];          // Spatial grid points in meters
  method: string;           // Name of the numerical method used ('numerov' or 'numerov-symmetric')
};