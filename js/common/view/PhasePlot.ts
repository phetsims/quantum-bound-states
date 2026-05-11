// Copyright 2026, University of Colorado Boulder

/**
 * PhasePlot plots the phase of the time-dependent wave function.
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
  private readonly polygons: Path[];

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

    this.polygons = [];
    for ( let i = 0; i < xCoordinates.length; i++ ) {
      this.polygons.push( new Path( null ) );
    }

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

        const shape = new Shape().moveTo( xView, yZeroView ).lineTo( xView, yView ).lineTo( xNextView, yNextView ).lineTo( xNextView, yZeroView ).close();
        shape.makeImmutable(); //TODO This is typically done in bamboo plots. Is it necessary?

        polygon.shape = shape;
        polygon.fill = phaseToColor( this.phaseValues[ i ] );
      }
    }
    this.children = [ ...this.polygons ]; //TODO Is there a different way?
  }
}

/**
 * Converts phase (in radians) to a Color.
 */
function phaseToColor( phase: number ): Color {
  return new Color( 0, 0, 0 ).setHSLA( toDegrees( phase ), 100, 50, 1 ); //TODO Java version was HSV colorspace
}