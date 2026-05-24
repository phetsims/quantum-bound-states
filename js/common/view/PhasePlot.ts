// Copyright 2026, University of Colorado Boulder

/**
 * PhasePlot plots the phase of the time-dependent wave function. The implementation uses the Canvas API to optimize
 * performance. Updating the YCanvasLinePlot and calling its paintCanvas method is the responsibility of a parent
 * ChartCanvasNode.
 *
 * The dataSet consists of a fixed set of x-coordinates and arrays of magnitude and phase values that correspond to
 * each x-coordinate. When drawing a magnitude/phase pair (M1,P1), we look ahead at the next pair (M2,P2). M1 and M2
 * are used to construct a 4-sided polygon. The fill color for the polygon is derived from P1. (P2 is ignored.)
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import CanvasPainter from '../../../../bamboo/js/CanvasPainter.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import { TimeEvolvedSuperposition } from '../model/TimeEvolvedSuperposition.js';
import WaveFunctionGraph from '../model/WaveFunctionGraph.js';
import QBSQueryParameters from '../QBSQueryParameters.js';
import PhaseColormap from './PhaseColormap.js';

export default class PhasePlot extends CanvasPainter {

  private readonly timeEvolvedSuperpositionProperty: TReadOnlyProperty<TimeEvolvedSuperposition>;
  private readonly chartTransform: ChartTransform;
  private readonly xCoordinates: readonly number[];
  private phaseValues: readonly number[];
  private magnitudeValues: readonly number[];

  public constructor( waveFunctionGraph: WaveFunctionGraph, chartTransform: ChartTransform ) {

    super( {
      visible: waveFunctionGraph.phaseVisibleProperty.value
    } );

    waveFunctionGraph.phaseVisibleProperty.lazyLink( phaseVisible => {
      this.visible = phaseVisible;
    } );

    this.chartTransform = chartTransform;
    this.xCoordinates = waveFunctionGraph.xGrid.xCoordinates;
    this.timeEvolvedSuperpositionProperty = waveFunctionGraph.timeEvolvedSuperpositionProperty;
    this.phaseValues = waveFunctionGraph.timeEvolvedSuperpositionProperty.value.phaseValues;
    this.magnitudeValues = waveFunctionGraph.timeEvolvedSuperpositionProperty.value.magnitudeValues;
  }

  /**
   * Must be called by the associated ChartCanvasNode.
   */
  public update(): void {
    this.phaseValues = this.timeEvolvedSuperpositionProperty.value.phaseValues;
    this.magnitudeValues = this.timeEvolvedSuperpositionProperty.value.magnitudeValues;
  }

  /**
   * To be called by the associated ChartCanvasNode.
   */
  public override paintCanvas( context: CanvasRenderingContext2D ): void {

    if ( this.visible ) {

      const phaseValues = this.phaseValues;
      const magnitudeValues = this.magnitudeValues;
      const chartTransform = this.chartTransform;

      const dxView = chartTransform.modelToViewDeltaX( this.xCoordinates[ 1 ] - this.xCoordinates[ 0 ] );
      const yZeroView = chartTransform.modelToViewY( 0 );

      for ( let i = 0; i < this.xCoordinates.length - 1; i++ ) {
        const yModel = magnitudeValues[ i ];
        const yNextModel = magnitudeValues[ i + 1 ];
        if ( yModel !== 0 && yNextModel !== 0 ) {

          // Describe a polygon of a thin slice of phase.
          const xView = chartTransform.modelToViewX( this.xCoordinates[ i ] );
          const xNextView = xView + dxView;
          const yView = chartTransform.modelToViewY( yModel );
          const yNextView = chartTransform.modelToViewY( yNextModel );
          context.beginPath();
          context.moveTo( xView, yZeroView );
          context.lineTo( xView, yView );
          context.lineTo( xNextView, yNextView );
          context.lineTo( xNextView, yZeroView );
          context.closePath();

          // Fill the polygon with the phase mapped to a color.
          const fillColor = ( QBSQueryParameters.phaseToColor === 'twilight' ) ?
                            PhaseColormap.phaseToTwilight( phaseValues[ i ] ) :
                            PhaseColormap.phaseToRainbow( phaseValues[ i ] );
          context.fillStyle = fillColor.toCSS();
          context.fill();
        }
      }
    }
  }
}