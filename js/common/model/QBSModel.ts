// Copyright 2026, University of Colorado Boulder

/**
 * QBSModel is the base class for the top-level model in this sim. It includes the model elements and functionality
 * that is common to all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TModel from '../../../../joist/js/TModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import MagnifierTool from './MagnifierTool.js';
import ReferenceLine from './ReferenceLine.js';

export default class QBSModel implements TModel {

  public readonly magnifierTool: MagnifierTool;

  public readonly referenceLine: ReferenceLine;

  protected constructor( tandem: Tandem ) {

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

quantumBoundStates.register( 'QBSModel', QBSModel );