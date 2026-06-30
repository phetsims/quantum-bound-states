// Copyright 2026, University of Colorado Boulder

/**
 * MagnitudePlot plots the magnitude of the time-dependent wave function.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import { TimeEvolvedSuperposition } from '../model/TimeEvolvedSuperposition.js';
import WaveFunctionGraph from '../model/WaveFunctionGraph.js';
import QBSColors from '../QBSColors.js';
import QBSConstants from '../QBSConstants.js';
import YCanvasLinePlot from './YCanvasLinePlot.js';

export default class MagnitudePlot extends YCanvasLinePlot {

  private readonly timeEvolvedSuperpositionProperty: TReadOnlyProperty<TimeEvolvedSuperposition>;

  public constructor( waveFunctionGraph: WaveFunctionGraph, chartTransform: ChartTransform ) {

    super( chartTransform, waveFunctionGraph.xGrid.xCoordinates, waveFunctionGraph.timeEvolvedSuperpositionProperty.value.magnitudeValues, {
      strokeProperty: QBSColors.magnitudeStrokeProperty,
      lineWidth: QBSConstants.WAVE_FUNCTION_LINE_WIDTH,
      visibleProperty: waveFunctionGraph.magnitudeSelectedProperty
    } );

    this.timeEvolvedSuperpositionProperty = waveFunctionGraph.timeEvolvedSuperpositionProperty;
  }

  /**
   * Must be called by the associated ChartCanvasNode.
   */
  public update(): void {
    this.setYCoordinates( this.timeEvolvedSuperpositionProperty.value.magnitudeValues );
  }
}