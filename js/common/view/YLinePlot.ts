// Copyright 2026, University of Colorado Boulder

/**
 * YLinePlotOptions plots a curve with fixed x-coordinates and variable y-coordinates.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Shape from '../../../../kite/js/Shape.js';
import affirm, { isAffirmEnabled } from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Path, { PathOptions } from '../../../../scenery/js/nodes/Path.js';

type SelfOptions = EmptySelfOptions;

export type YLinePlotOptions = SelfOptions & PathOptions;

export default class YLinePlot extends Path {

  private readonly chartTransform: ChartTransform;
  private readonly xCoordinates: readonly number[];
  private yCoordinates: readonly number[];

  public constructor( chartTransform: ChartTransform,
                      xCoordinates: readonly number[],
                      yCoordinates: readonly number[],
                      providedOptions?: YLinePlotOptions ) {

    if ( isAffirmEnabled() ) {
      affirm( xCoordinates.length > 1, 'xCoordinates must contain at least two values' );
      affirm( xCoordinates.length === yCoordinates.length, 'xCoordinates and yCoordinates must be the same length' );
    }

    const options = optionize<YLinePlotOptions, SelfOptions, PathOptions>()( {

      // Path options
      isDisposable: false,
      stroke: 'black'
    }, providedOptions );

    super( null, options );

    this.chartTransform = chartTransform;
    this.xCoordinates = xCoordinates;
    this.yCoordinates = yCoordinates;

    // Initialize
    this.update();

    // Update when the transform changes.
    const changedListener = () => this.update();
    chartTransform.changedEmitter.addListener( changedListener );
    this.disposeEmitter.addListener( () => chartTransform.changedEmitter.removeListener( changedListener ) );
  }

  /**
   * Sets the y-coordinates and redraws the plot.
   */
  public setYCoordinates( yCoordinates: readonly number[] ): void {
    isAffirmEnabled() && affirm( yCoordinates.length === this.xCoordinates.length, 'yCoordinates must be the same length as xCoordinates' );
    this.yCoordinates = yCoordinates;
    this.update();
  }

  /**
   *  Recomputes the rendered shape.
   */
  private update(): void {
    const shape = new Shape();
    for ( let i = 0; i < this.yCoordinates.length; i++ ) {
      const x = this.chartTransform.modelToViewX( this.xCoordinates[ i ] );
      const y = this.chartTransform.modelToViewY( this.yCoordinates[ i ] );
      if ( i === 0 ) {
        shape.moveTo( x, y );
      }
      else {
        shape.lineTo( x, y );
      }
    }
    this.shape = shape.makeImmutable(); //TODO This is typically done in bamboo plots. Is it necessary?
  }
}