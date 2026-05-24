// Copyright 2026, University of Colorado Boulder

/**
 * TODO
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

    // Plots
    const realPartPlot = new RealPartPlot( waveFunctionGraph, chartTransform );
    const imaginaryPartPlot = new ImaginaryPartPlot( waveFunctionGraph, chartTransform );
    const magnitudePlot = new MagnitudePlot( waveFunctionGraph, chartTransform );
    const phasePlot = new PhasePlot( waveFunctionGraph, chartTransform );

    super( chartTransform, [
      // Back-to-front rendering order.
      phasePlot,
      magnitudePlot,
      imaginaryPartPlot,
      realPartPlot
    ] );

    // Update all plots at the same time.
    const updatePlots = () => {
      realPartPlot.update();
      imaginaryPartPlot.update();
      magnitudePlot.update();
      phasePlot.update();
      this.update();
    };

    // Update when the state time-evolved changes, the chartTransform changes, or visibility of plots changes.
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