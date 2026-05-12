// Copyright 2026, University of Colorado Boulder

/**
 * MagnitudePlot plots the magnitude of the time-dependent wave function.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import WaveFunctionGraph from '../model/WaveFunctionGraph.js';
import QBSColors from '../QBSColors.js';
import YLinePlot from './YLinePlot.js';

export default class MagnitudePlot extends YLinePlot {

  public constructor( waveFunctionGraph: WaveFunctionGraph, chartTransform: ChartTransform ) {

    super( chartTransform, waveFunctionGraph.xGrid.xCoordinates, waveFunctionGraph.timeEvolvedSuperpositionProperty.value.magnitudeValues, {
      stroke: QBSColors.magnitudeStrokeProperty,
      lineWidth: 2,
      visibleProperty: waveFunctionGraph.magnitudeVisibleProperty
    } );

    waveFunctionGraph.timeEvolvedSuperpositionProperty.lazyLink(
      timeEvolvedSuperposition => this.setYCoordinates( timeEvolvedSuperposition.magnitudeValues ) );
  }
}