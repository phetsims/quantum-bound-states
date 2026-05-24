// Copyright 2026, University of Colorado Boulder

/**
 * EnergyDiagramPlotsNode draws the plots for the Energy Diagram. It uses Canvas to optimize performance.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import ChartCanvasNode from '../../../../bamboo/js/ChartCanvasNode.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import QBSModel from '../model/QBSModel.js';
import QBSColors from '../QBSColors.js';
import EnergyLevelsPlot from './EnergyLevelsPlot.js';
import YCanvasLinePlot from './YCanvasLinePlot.js';

export default class EnergyDiagramPlotsNode extends ChartCanvasNode {

  //TODO Reduce coupling with QBSModel
  public constructor( model: QBSModel, chartTransform: ChartTransform ) {

    const potentialPlot = new YCanvasLinePlot( chartTransform, model.xGrid.xCoordinates, model.boundStateResultProperty.value.potentials, {
      strokeProperty: QBSColors.potentialEnergyColorProperty,
      lineWidth: 3
    } );

    const energyLevelsPlot = new EnergyLevelsPlot( chartTransform, model.boundStateResultProperty.value.energies, {
      strokeProperty: QBSColors.totalEnergyColorProperty,
      lineWidth: 2
    } );

    const selectedEnergyLevelPlot = new EnergyLevelsPlot( chartTransform,
      [ model.getEnergyAtEnergyLevel( model.selectedEnergyLevelProperty.value ) ], {
        strokeProperty: QBSColors.selectedEnergyLevelColorProperty,
        lineWidth: 2,
        hasArrowHeads: true
      } );

    const highlightedEnergyLevelPlot = new EnergyLevelsPlot( chartTransform, [], {
      strokeProperty: QBSColors.highlightedEnergyLevelColorProperty,
      lineWidth: 3
    } );

    super( chartTransform, [
      // Back-to-front rendering order.
      energyLevelsPlot,
      highlightedEnergyLevelPlot,
      selectedEnergyLevelPlot,
      potentialPlot
    ] );

    // Update all plots at the same time.
    const updatePlots = () => {

      const boundStateResult = model.boundStateResultProperty.value;
      potentialPlot.setYCoordinates( boundStateResult.potentials );
      energyLevelsPlot.setEnergies( boundStateResult.energies );

      const selectedEnergyLevel = model.selectedEnergyLevelProperty.value;
      const selectedEnergy = model.getEnergyAtEnergyLevel( selectedEnergyLevel );
      selectedEnergyLevelPlot.setEnergy( selectedEnergy );

      const highlightedEnergyLevel = model.highlightedEnergyLevelProperty.value;
      const highlightedEnergy = ( highlightedEnergyLevel === null ) ? null : model.getEnergyAtEnergyLevel( highlightedEnergyLevel );
      highlightedEnergyLevelPlot.setEnergy( highlightedEnergy );

      this.update();
    };

    // Update when the model changes or chartTransform changes.
    Multilink.multilink( [ model.boundStateResultProperty, model.selectedEnergyLevelProperty, model.highlightedEnergyLevelProperty ],
      () => updatePlots() );
    chartTransform.changedEmitter.addListener( () => updatePlots() );
  }
}