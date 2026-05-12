// Copyright 2026, University of Colorado Boulder

/**
 * RealPartPlot plots the real part of the time-dependent wave function.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import WaveFunctionGraph from '../model/WaveFunctionGraph.js';
import QBSColors from '../QBSColors.js';
import YLinePlot from './YLinePlot.js';

export default class RealPartPlot extends YLinePlot {

  public constructor( waveFunctionGraph: WaveFunctionGraph, chartTransform: ChartTransform ) {

    super( chartTransform, waveFunctionGraph.xGrid.xCoordinates, waveFunctionGraph.realPartValuesProperty.value, {
      stroke: QBSColors.realPartStrokeProperty,
      lineWidth: 2,
      visibleProperty: waveFunctionGraph.realPartVisibleProperty
    } );

    waveFunctionGraph.realPartValuesProperty.lazyLink( values => this.setYCoordinates( values ) );
  }
}