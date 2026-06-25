// Copyright 2026, University of Colorado Boulder

//TODO Similar to WaveFunctionPlotsNode, factor out a base class.
/**
 * ProbabilityDensityPlotsNode draws the plots for the Probability Density graph. It uses Canvas to optimize performance.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import ChartCanvasNode from '../../../../bamboo/js/ChartCanvasNode.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import phetioStateSetEmitter from '../../../../tandem/js/phetioStateSetEmitter.js';
import Tandem from '../../../../tandem/js/Tandem.js';
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

    chartTransform.changedEmitter.addListener( () => updatePlots() );

    Multilink.multilink( [ probabilityDensityGraph.timeEvolvedSuperpositionProperty, probabilityDensityPlot.strokeProperty ],
      () => updatePlots() );

    // When PhET-iO state has been fully restored, update plots.
    if ( Tandem.PHET_IO_ENABLED ) {
      phetioStateSetEmitter.addListener( () => updatePlots() );
    }
  }
}