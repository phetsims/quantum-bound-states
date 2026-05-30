// Copyright 2026, University of Colorado Boulder

/**
 * RealPartPlot plots the real part of the time-dependent wave function.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import { TimeEvolvedSuperposition } from '../model/TimeEvolvedSuperposition.js';
import WaveFunctionGraph from '../model/WaveFunctionGraph.js';
import QBSColors from '../QBSColors.js';
import YCanvasLinePlot from './YCanvasLinePlot.js';

export default class RealPartPlot extends YCanvasLinePlot {

  private readonly timeEvolvedSuperpositionProperty: TReadOnlyProperty<TimeEvolvedSuperposition>;

  public constructor( waveFunctionGraph: WaveFunctionGraph, chartTransform: ChartTransform ) {

    super( chartTransform, waveFunctionGraph.xGrid.xCoordinates, waveFunctionGraph.timeEvolvedSuperpositionProperty.value.realPartValues, {
      strokeProperty: QBSColors.realPartStrokeProperty,
      lineWidth: 2,
      visibleProperty: waveFunctionGraph.realPartSelectedProperty
    } );

    this.timeEvolvedSuperpositionProperty = waveFunctionGraph.timeEvolvedSuperpositionProperty;
    this.update();
  }

  /**
   * Must be called by the associated ChartCanvasNode.
   */
  public update(): void {
    this.setYCoordinates( this.timeEvolvedSuperpositionProperty.value.realPartValues );
  }
}