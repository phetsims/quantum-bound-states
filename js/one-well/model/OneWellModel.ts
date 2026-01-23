// Copyright 2025, University of Colorado Boulder

/**
 * OneWellModel is the top-level model for the 'One Well' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TModel from '../../../../joist/js/TModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import MagnifierTool from '../../common/model/MagnifierTool.js';
import ReferenceLine from '../../common/model/ReferenceLine.js';
import quantumBoundStates from '../../quantumBoundStates.js';

export default class OneWellModel implements TModel {

  public readonly magnifierTool: MagnifierTool;
  public readonly referenceLine: ReferenceLine;

  public constructor( tandem: Tandem ) {

    this.magnifierTool = new MagnifierTool( tandem.createTandem( 'magnifierTool' ) );

    this.referenceLine = new ReferenceLine( tandem.createTandem( 'referenceLine' ) );
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    this.magnifierTool.reset();
    this.referenceLine.reset();
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    //TODO
  }
}

quantumBoundStates.register( 'OneWellModel', OneWellModel );