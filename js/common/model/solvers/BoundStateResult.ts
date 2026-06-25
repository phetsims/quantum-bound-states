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

import ArrayIO from '../../../../../tandem/js/types/ArrayIO.js';
import IOType from '../../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../../tandem/js/types/NumberIO.js';
import StringIO from '../../../../../tandem/js/types/StringIO.js';

const STATE_SCHEMA = {
  potentials: ArrayIO( NumberIO ),
  energies: ArrayIO( NumberIO ),
  waveFunctions: ArrayIO( ArrayIO( NumberIO ) ),
  solutionMethod: StringIO
};

type BoundStateResultStateObject = {
  potentials: number[];
  energies: number[];
  waveFunctions: number[][];
  solutionMethod: string;
};

// Enumeration of methods used to solve for the bound state
type SolutionMethod = 'numerov' | 'analytical';

//TODO If we can delete solutionMethod, then we can use SchemaOrientedIOType to create the IOType, similar to TimeEvolvedSuperpositionIO
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

  private toStateObject(): BoundStateResultStateObject {
    return {
      potentials: this.potentials,
      energies: this.energies,
      waveFunctions: this.waveFunctions,
      solutionMethod: this.solutionMethod
    };
  }

  private static fromStateObject( stateObject: BoundStateResultStateObject ): BoundStateResult {
    return new BoundStateResult( {
      potentials: stateObject.potentials,
      energies: stateObject.energies,
      waveFunctions: stateObject.waveFunctions,
      solutionMethod: stateObject.solutionMethod as SolutionMethod
    } );
  }

  /**
   * BoundStateResultIO implements data-type serialization for BoundStateResult instances.
   */
  public static readonly BoundStateResultIO = new IOType<BoundStateResult, BoundStateResultStateObject>( 'BoundStateResultIO', {
    valueType: BoundStateResult,
    stateSchema: STATE_SCHEMA,
    toStateObject: ( boundStateResult: BoundStateResult ) => boundStateResult.toStateObject(),
    fromStateObject: ( stateObject: BoundStateResultStateObject ) => BoundStateResult.fromStateObject( stateObject ),
    //TODO When BoundStateResult field names are changed, update documentation.
    documentation: 'Bounds state information for the selected quantum potential. Fields include:' +
                   '<ul>' +
                   '<li>potentials: TODO</li>' +
                   '<li>energies: TODO</li>' +
                   '<li>waveFunctions: TODO</li>' +
                   '<li>solutionMethod: the method used to solve for the bound state</li>'
  } );
}