// Copyright 2026, University of Colorado Boulder

/**
 * ProbabilityDensityPlot plots the probability density of the time-dependent wave function.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import ProbabilityDensityGraph from '../model/ProbabilityDensityGraph.js';
import { TimeEvolvedSuperposition } from '../model/TimeEvolvedSuperposition.js';
import QBSColors from '../QBSColors.js';
import QBSConstants from '../QBSConstants.js';
import YCanvasLinePlot from './YCanvasLinePlot.js';

export default class ProbabilityDensityPlot extends YCanvasLinePlot {

  private readonly timeEvolvedSuperpositionProperty: TReadOnlyProperty<TimeEvolvedSuperposition>;

  public constructor( probabilityDensityGraph: ProbabilityDensityGraph, chartTransform: ChartTransform ) {

    super( chartTransform, probabilityDensityGraph.xGrid.xCoordinates,
      probabilityDensityGraph.timeEvolvedSuperpositionProperty.value.probabilityDensityValues, {
        strokeProperty: QBSColors.probabilityDensityStrokeProperty,
        lineWidth: QBSConstants.PROBABILITY_DENSITY_LINE_WIDTH
      } );

    this.timeEvolvedSuperpositionProperty = probabilityDensityGraph.timeEvolvedSuperpositionProperty;
    this.update();
  }

  public update(): void {
    this.setYCoordinates( this.timeEvolvedSuperpositionProperty.value.probabilityDensityValues );
  }
}