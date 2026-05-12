// Copyright 2026, University of Colorado Boulder

/**
 * ProbabilityDensityPlot plots the probability density of the time-dependent wave function.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import ProbabilityDensityGraph from '../model/ProbabilityDensityGraph.js';
import QBSColors from '../QBSColors.js';
import YLinePlot from './YLinePlot.js';

export default class ProbabilityDensityPlot extends YLinePlot {

  public constructor( probabilityDensityGraph: ProbabilityDensityGraph, chartTransform: ChartTransform ) {

    super( chartTransform, probabilityDensityGraph.xGrid.xCoordinates,
      probabilityDensityGraph.timeEvolvedSuperpositionProperty.value.probabilityDensityValues, {
        stroke: QBSColors.probabilityDensityStrokeProperty,
        lineWidth: 2
      } );

    probabilityDensityGraph.timeEvolvedSuperpositionProperty.lazyLink(
      timeEvolvedSuperposition => this.setYCoordinates( timeEvolvedSuperposition.probabilityDensityValues ) );
  }
}