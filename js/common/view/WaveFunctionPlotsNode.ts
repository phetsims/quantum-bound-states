// Copyright 2026, University of Colorado Boulder

/**
 * WaveFunctionPlotsNode draws the plots for the Wave Function graph. It uses Canvas to optimize performance.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import ChartCanvasNode from '../../../../bamboo/js/ChartCanvasNode.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import phetioStateSetEmitter from '../../../../tandem/js/phetioStateSetEmitter.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSPreferences from '../model/QBSPreferences.js';
import WaveFunctionGraph from '../model/WaveFunctionGraph.js';
import ImaginaryPartPlot from './ImaginaryPartPlot.js';
import MagnitudePlot from './MagnitudePlot.js';
import PhasePlot from './PhasePlot.js';
import RealPartPlot from './RealPartPlot.js';

export default class WaveFunctionPlotsNode extends ChartCanvasNode {

  public constructor( waveFunctionGraph: WaveFunctionGraph, chartTransform: ChartTransform ) {

    const linePlots = [
      new MagnitudePlot( waveFunctionGraph, chartTransform ),
      new ImaginaryPartPlot( waveFunctionGraph, chartTransform ),
      new RealPartPlot( waveFunctionGraph, chartTransform )
    ];

    // Plots, in back-to-front rendering order.
    const plots = [
      new PhasePlot( waveFunctionGraph, chartTransform ),
      ...linePlots
    ];

    super( chartTransform, plots );

    // Update all plots at the same time.
    const updatePlots = () => {
      plots.forEach( plot => plot.update() );
      this.update();
    };

    chartTransform.changedEmitter.addListener( () => updatePlots() );

    Multilink.multilinkAny( [
      waveFunctionGraph.timeEvolvedSuperpositionProperty,
      waveFunctionGraph.realPartSelectedProperty,
      waveFunctionGraph.imaginaryPartSelectedProperty,
      waveFunctionGraph.magnitudeSelectedProperty,
      waveFunctionGraph.phaseSelectedProperty,
      QBSPreferences.phaseCheckboxVisibleProperty,
      ...linePlots.map( plot => plot.strokeProperty )
    ], () => {
      if ( !isSettingPhetioStateProperty.value ) {
        updatePlots();
      }
    } );

    // When PhET-iO state has been fully restored, update plots.
    if ( Tandem.PHET_IO_ENABLED ) {
      phetioStateSetEmitter.addListener( () => updatePlots() );
    }
  }
}