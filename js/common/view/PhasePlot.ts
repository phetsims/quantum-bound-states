// Copyright 2026, University of Colorado Boulder

//TODO Cache colors?
/**
 * PhasePlot plots the phase of the time-dependent wave function.
 *
 * The dataSet consists of a fixed set of x-coordinates and arrays of magnitude and phase values that correspond to
 * each x-coordinate. When drawing a magnitude/phase pair (M1,P1), we look ahead at the next pair (M2,P2). M1 and M2
 * are used to construct a 4-sided polygon. The fill color for the polygon is derived from P1. (P2 is ignored.)
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import { toDegrees } from '../../../../dot/js/util/toDegrees.js';
import Shape from '../../../../kite/js/Shape.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Color from '../../../../scenery/js/util/Color.js';

type SelfOptions = EmptySelfOptions;

type PhasePlotOptions = SelfOptions & PickRequired<NodeOptions, 'visibleProperty'>;

export default class PhasePlot extends Node {

  private readonly chartTransform: ChartTransform;
  private readonly xCoordinates: readonly number[];
  private magnitudeValues: readonly number[];
  private phaseValues: readonly number[];
  private readonly mutableColor: Color; // One instance of Color is reused for phase to Color conversion.
  private readonly polygons: Path[]; // Polygons are reused to draw the phase.

  public constructor( chartTransform: ChartTransform,
                      xCoordinates: readonly number[],
                      magnitudeValues: readonly number[],
                      phaseValues: readonly number[],
                      providedOptions: PhasePlotOptions ) {
    affirm( xCoordinates.length > 1, 'xCoordinates must contain at least two values' );
    affirm( xCoordinates.length === magnitudeValues.length, 'xCoordinates and magnitudeValues must be the same length' );
    affirm( xCoordinates.length === phaseValues.length, 'xCoordinates and phaseValues must be the same length' );

    const options = providedOptions;

    super( options );

    this.chartTransform = chartTransform;
    this.xCoordinates = xCoordinates;
    this.magnitudeValues = magnitudeValues;
    this.phaseValues = phaseValues;

    this.mutableColor = new Color( 0, 0, 0 );

    this.polygons = [];
    for ( let i = 0; i < xCoordinates.length; i++ ) {
      this.polygons.push( new Path( null ) );
    }
    this.children = this.polygons;

    // Initialize
    this.update();

    // Update when the transform changes.
    const changedListener = () => this.update();
    chartTransform.changedEmitter.addListener( changedListener );
    this.disposeEmitter.addListener( () => chartTransform.changedEmitter.removeListener( changedListener ) );
  }

  /**
   * Sets the magnitude and phase, then redraws the plot.
   */
  public setDataSet( magnitudeValues: readonly number[], phaseValues: readonly number[] ): void {
    affirm( magnitudeValues.length === this.xCoordinates.length, 'magnitudeValues must be the same length as xCoordinates' );
    affirm( phaseValues.length === this.xCoordinates.length, 'phaseValues must be the same length as xCoordinates' );
    this.magnitudeValues = magnitudeValues;
    this.phaseValues = phaseValues;
    this.update();
  }

  /**
   * Updates the plot.
   */
  private update(): void {

    const dxView = this.chartTransform.modelToViewDeltaX( this.xCoordinates[ 1 ] - this.xCoordinates[ 0 ] );
    const yZeroView = this.chartTransform.modelToViewY( 0 );
    for ( let i = 0; i < this.xCoordinates.length - 1; i++ ) {

      const polygon = this.polygons[ i ];
      const yModel = this.magnitudeValues[ i ];
      const yNextModel = this.magnitudeValues[ i + 1 ];

      if ( yModel === 0 && yNextModel === 0 ) {
        polygon.shape = null;
      }
      else {

        const xView = this.chartTransform.modelToViewX( this.xCoordinates[ i ] );
        const xNextView = xView + dxView;
        const yView = this.chartTransform.modelToViewY( yModel );
        const yNextView = this.chartTransform.modelToViewY( yNextModel );

        const shape = new Shape()
          .moveTo( xView, yZeroView )
          .lineTo( xView, yView )
          .lineTo( xNextView, yNextView )
          .lineTo( xNextView, yZeroView )
          .close();
        shape.makeImmutable(); //TODO This is typically done in bamboo plots. Is it necessary?

        polygon.shape = shape;
        polygon.fill = this.phaseToColor( this.phaseValues[ i ] );
      }
    }
  }

  /**
   * Converts phase (in radians) to a CSS color string.
   */
  private phaseToColor( phase: number ): string {
    return this.mutableColor.setHSLA( toDegrees( phase ), 100, 50, 1 ).toCSS(); //TODO Java version used HSV colorspace
  }
}