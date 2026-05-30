// Copyright 2026, University of Colorado Boulder

/**
 * ImaginaryPartPlot plots the imaginary part of the time-dependent wave function.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import { TimeEvolvedSuperposition } from '../model/TimeEvolvedSuperposition.js';
import WaveFunctionGraph from '../model/WaveFunctionGraph.js';
import QBSColors from '../QBSColors.js';
import YCanvasLinePlot from './YCanvasLinePlot.js';

export default class ImaginaryPartPlot extends YCanvasLinePlot {

  private readonly timeEvolvedSuperpositionProperty: TReadOnlyProperty<TimeEvolvedSuperposition>;

  public constructor( waveFunctionGraph: WaveFunctionGraph, chartTransform: ChartTransform ) {

    super( chartTransform, waveFunctionGraph.xGrid.xCoordinates, waveFunctionGraph.timeEvolvedSuperpositionProperty.value.imaginaryPartValues, {
      strokeProperty: QBSColors.imaginaryPartStrokeProperty,
      lineWidth: 2,
      visibleProperty: waveFunctionGraph.imaginaryPartSelectedProperty
    } );

    this.timeEvolvedSuperpositionProperty = waveFunctionGraph.timeEvolvedSuperpositionProperty;
    this.update();
  }

  /**
   * Must be called by the associated ChartCanvasNode.
   */
  public update(): void {
    this.setYCoordinates( this.timeEvolvedSuperpositionProperty.value.imaginaryPartValues );
  }
}