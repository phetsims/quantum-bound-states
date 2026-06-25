// Copyright 2026, University of Colorado Boulder

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

// Enumeration of methods used to solve for the bound state
type SolutionMethod = 'numerov' | 'analytical';

type BoundStateResultOptions = {
  potentials: number[];      // Potential energy values in eV, from left to right TODO change to potentialEnergies
  energies: number[];        // Energy levels (eigenvalues) in eV, sorted from lowest to highest TODO change to energyLevels
  waveFunctions: number[][]; // Normalized wave function solutions (each row is one state) TODO change to waveFunctionSolutions
  solutionMethod: SolutionMethod;    // Name of the method used to solve for the bound state TODO rename to solutionMethod
};

export default class BoundStateResult {

  public readonly potentials: number[];
  public readonly energies: number[];
  public readonly waveFunctions: number[][];
  public readonly solutionMethod: SolutionMethod;

  public constructor( options: BoundStateResultOptions ) {
    this.potentials = options.potentials;
    this.energies = options.energies;
    this.waveFunctions = options.waveFunctions;
    this.solutionMethod = options.solutionMethod;
  }

  //TODO BoundStateResultIO for PhET-iO data-type serialization
}