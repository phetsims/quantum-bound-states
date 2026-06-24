// Copyright 2026, University of Colorado Boulder

/**
 * YCanvasLinePlot plots a curve with fixed x-coordinates and variable y-coordinates. The implementation uses
 * the Canvas API to optimize performance. Updating this plot and calling its paintCanvas method is the responsibility
 * of a parent ChartCanvasNode.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import CanvasPainter, { CanvasPainterOptions } from '../../../../bamboo/js/CanvasPainter.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Range from '../../../../dot/js/Range.js';
import affirm, { isAffirmEnabled } from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import ProfileColorProperty from '../../../../scenery/js/util/ProfileColorProperty.js';

type SelfOptions = {
  lineWidth?: number;
  lineDash?: number[];
  strokeProperty: ProfileColorProperty;
  visibleProperty?: TReadOnlyProperty<boolean>;
  yMax?: number | null;
};

export type YCanvasLinePlotOptions = SelfOptions & CanvasPainterOptions;

export default class YCanvasLinePlot extends CanvasPainter {

  private readonly chartTransform: ChartTransform;
  private readonly xCoordinates: readonly number[];
  private yCoordinates: readonly number[];

  // Constrain y-coordinates to the range [-yMax,yMax]. This addresses the fact that potential energies may be very
  // large numbers, and Canvas cannot handle large numbers. See https://github.com/phetsims/quantum-bound-states/issues/50
  private readonly yMaxRange: Range | null;

  public lineWidth: number;
  public lineDash: number[];
  public readonly strokeProperty: ProfileColorProperty;

  public constructor( chartTransform: ChartTransform,
                      xCoordinates: readonly number[],
                      yCoordinates: readonly number[],
                      providedOptions: YCanvasLinePlotOptions ) {

    if ( isAffirmEnabled() ) {
      affirm( xCoordinates.length > 1, 'xCoordinates must contain at least two values' );
      affirm( xCoordinates.length === yCoordinates.length, 'xCoordinates and yCoordinates must be the same length' );
      if ( isAffirmEnabled() ) {
        xCoordinates.forEach( ( x, index ) => {
          affirm( isFinite( x ) && !isNaN( x ), `xCoordinates[${index}] is invalid: ${x}` );
        } );
      }
    }

    const options = optionize<YCanvasLinePlotOptions, StrictOmit<SelfOptions, 'visibleProperty'>, CanvasPainterOptions>()( {

      // SelfOptions
      lineWidth: 1,
      lineDash: [], // solid
      yMax: null,

      // CanvasPainterOptions
      visible: providedOptions.visibleProperty ? providedOptions.visibleProperty.value : true
    }, providedOptions );

    super( options );

    this.chartTransform = chartTransform;
    this.xCoordinates = xCoordinates;
    this.yCoordinates = yCoordinates;
    this.yMaxRange = ( options.yMax === null ) ? null : new Range( -options.yMax, options.yMax );
    this.lineWidth = options.lineWidth;
    this.lineDash = options.lineDash;
    this.strokeProperty = options.strokeProperty;

    options.visibleProperty && options.visibleProperty.lazyLink( visible => {
      this.visible = visible;
    } );
  }

  /**
   * Sets the y-coordinates. The associated ChartCanvasNode must call update.
   */
  public setYCoordinates( yCoordinates: readonly number[] ): void {
    isAffirmEnabled() && affirm( yCoordinates.length === this.xCoordinates.length, 'yCoordinates must be the same length as xCoordinates' );
    this.yCoordinates = yCoordinates;
  }

  /**
   * To be called by the update method of the associated ChartCanvasNode.
   */
  public override paintCanvas( context: CanvasRenderingContext2D ): void {
    if ( this.visible ) {

      context.beginPath();
      context.strokeStyle = this.strokeProperty.value.toCSS();
      context.lineWidth = this.lineWidth;
      context.setLineDash( this.lineDash );

      const length = this.xCoordinates.length;
      for ( let i = 0; i < length; i++ ) {

        // Convert to view coordinates.
        const x = this.chartTransform.modelToViewX( this.xCoordinates[ i ] );
        let y = this.chartTransform.modelToViewY( this.yCoordinates[ i ] );

        // Optionally constrain y-coordinates to a range that does not cause problems with Canvas.
        if ( this.yMaxRange ) {
          y = this.yMaxRange.constrainValue( y );
        }

        if ( i === 0 ) {
          context.moveTo( x, y );
        }
        else {
          context.lineTo( x, y );
        }
      }
      context.stroke();
    }
  }
}