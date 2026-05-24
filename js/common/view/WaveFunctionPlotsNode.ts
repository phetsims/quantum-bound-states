// Copyright 2026, University of Colorado Boulder

/**
 * WaveFunctionPlotsNode draws the plots for the Wave Function graph. It uses Canvas to optimize performance.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import ChartCanvasNode from '../../../../bamboo/js/ChartCanvasNode.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import WaveFunctionGraph from '../model/WaveFunctionGraph.js';
import ImaginaryPartPlot from './ImaginaryPartPlot.js';
import MagnitudePlot from './MagnitudePlot.js';
import PhasePlot from './PhasePlot.js';
import RealPartPlot from './RealPartPlot.js';

export default class WaveFunctionPlotsNode extends ChartCanvasNode {

  public constructor( waveFunctionGraph: WaveFunctionGraph, chartTransform: ChartTransform ) {

    // Plots, in back-to-front rendering order.
    const plots = [
      new PhasePlot( waveFunctionGraph, chartTransform ),
      new MagnitudePlot( waveFunctionGraph, chartTransform ),
      new ImaginaryPartPlot( waveFunctionGraph, chartTransform ),
      new RealPartPlot( waveFunctionGraph, chartTransform )
    ];

    super( chartTransform, plots );

    // Update all plots at the same time.
    const updatePlots = () => {
      plots.forEach( plot => plot.update() );
      this.update();
    };

    // Update when the time-evolved state changes, the chartTransform changes, or the visibility of plots changes.
    waveFunctionGraph.timeEvolvedSuperpositionProperty.lazyLink( () => updatePlots() );
    chartTransform.changedEmitter.addListener( () => updatePlots() );
    Multilink.multilink( [
      waveFunctionGraph.realPartVisibleProperty,
      waveFunctionGraph.imaginaryPartVisibleProperty,
      waveFunctionGraph.magnitudeVisibleProperty,
      waveFunctionGraph.phaseVisibleProperty
    ], () => updatePlots() );
  }
}