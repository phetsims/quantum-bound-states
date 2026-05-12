// Copyright 2026, University of Colorado Boulder

/**
 * ImaginaryPartPlot plots the imaginary part of the time-dependent wave function.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import WaveFunctionGraph from '../model/WaveFunctionGraph.js';
import QBSColors from '../QBSColors.js';
import YLinePlot from './YLinePlot.js';

export default class ImaginaryPartPlot extends YLinePlot {

  public constructor( waveFunctionGraph: WaveFunctionGraph, chartTransform: ChartTransform ) {

    super( chartTransform, waveFunctionGraph.xGrid.xCoordinates, waveFunctionGraph.imaginaryPartValuesProperty.value, {
      stroke: QBSColors.imaginaryPartStrokeProperty,
      lineWidth: 2,
      visibleProperty: waveFunctionGraph.imaginaryPartVisibleProperty
    } );

    waveFunctionGraph.imaginaryPartValuesProperty.lazyLink( values => this.setYCoordinates( values ) );
  }
}