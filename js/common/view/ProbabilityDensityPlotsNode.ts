// Copyright 2026, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartCanvasNode from '../../../../bamboo/js/ChartCanvasNode.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import ProbabilityDensityGraph from '../model/ProbabilityDensityGraph.js';
import ProbabilityDensityPlot from './ProbabilityDensityPlot.js';

export default class ProbabilityDensityPlotsNode extends ChartCanvasNode {

  public constructor( probabilityDensityGraph: ProbabilityDensityGraph,
                      chartTransform: ChartTransform ) {

    const probabilityDensityPlot = new ProbabilityDensityPlot( probabilityDensityGraph, chartTransform );

    super( chartTransform, [ probabilityDensityPlot ] );

    const updatePlots = () => {
      probabilityDensityPlot.update();
      this.update();
    };

    // Update when the time-evolved state changes or the chartTransform changes.
    probabilityDensityGraph.timeEvolvedSuperpositionProperty.lazyLink( () => updatePlots() );
    chartTransform.changedEmitter.addListener( () => updatePlots() );
  }
}