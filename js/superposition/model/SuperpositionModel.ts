// Copyright 2025, University of Colorado Boulder

/**
 * SuperpositionModel is the top-level model for the 'Superposition' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TModel from '../../../../joist/js/TModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';

export default class SuperpositionModel implements TModel {

  public constructor( tandem :Tandem ) {
    //TODO
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    //TODO
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    //TODO
  }
}

quantumBoundStates.register( 'SuperpositionModel', SuperpositionModel );