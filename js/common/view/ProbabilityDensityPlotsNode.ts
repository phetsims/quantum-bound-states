// Copyright 2026, University of Colorado Boulder

//TODO Similar to WaveFunctionPlotsNode, factor out a base class.
/**
 * ProbabilityDensityPlotsNode draws the plots for the Probability Density graph. It uses Canvas to optimize performance.
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

    // Plots, in back-to-front rendering order.
    const plots = [
      new ProbabilityDensityPlot( probabilityDensityGraph, chartTransform )
    ];

    super( chartTransform, plots );

    const updatePlots = () => {
      plots.forEach( plot => plot.update() );
      this.update();
    };

    // Update when the time-evolved state changes or the chartTransform changes.
    probabilityDensityGraph.timeEvolvedSuperpositionProperty.lazyLink( () => updatePlots() );
    chartTransform.changedEmitter.addListener( () => updatePlots() );
  }
}