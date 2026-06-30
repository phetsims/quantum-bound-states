// Copyright 2026, University of Colorado Boulder

/**
 * EnergyDiagramPlotsNode draws the plots for the Energy Diagram. It uses Canvas to optimize performance.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import ChartCanvasNode from '../../../../bamboo/js/ChartCanvasNode.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import phetioStateSetEmitter from '../../../../tandem/js/phetioStateSetEmitter.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSModel from '../model/QBSModel.js';
import QBSColors from '../QBSColors.js';
import QBSConstants from '../QBSConstants.js';
import EnergyLevelsPlot from './EnergyLevelsPlot.js';
import YCanvasLinePlot from './YCanvasLinePlot.js';

export default class EnergyDiagramPlotsNode extends ChartCanvasNode {

  //TODO Reduce coupling with QBSModel
  public constructor( model: QBSModel, chartTransform: ChartTransform ) {

    const potentialPlot = new YCanvasLinePlot( chartTransform, model.xGrid.xCoordinates, model.boundStateResultProperty.value.potentials, {
      strokeProperty: QBSColors.potentialEnergyColorProperty,
      lineWidth: QBSConstants.POTENTIAL_ENERGY_LINE_WIDTH,
      yMax: QBSConstants.EFFECTIVELY_INFINITE_POTENTIAL_ENERGY
    } );

    const energyLevelsPlot = new EnergyLevelsPlot( chartTransform, model.boundStateResultProperty.value.energies, {
      strokeProperty: QBSColors.totalEnergyColorProperty,
      lineWidth: QBSConstants.ENERGY_LEVELS_LINE_WIDTH
    } );

    const selectedEnergyLevelPlot = new EnergyLevelsPlot( chartTransform,
      [ model.getEnergyAtEnergyLevel( model.selectedEnergyLevelIndexProperty.value ) ], {
        strokeProperty: QBSColors.selectedEnergyLevelColorProperty,
        lineWidth: QBSConstants.SELECTED_ENERGY_LEVEL_LINE_WIDTH,
        hasArrowHeads: true
      } );

    const highlightedEnergyLevelPlot = new EnergyLevelsPlot( chartTransform, [], {
      strokeProperty: QBSColors.highlightedEnergyLevelColorProperty,
      lineWidth: QBSConstants.HIGHLIGHTED_ENERGY_LEVEL_LINE_WIDTH
    } );

    // Back-to-front rendering order.
    const plots = [
      energyLevelsPlot,
      highlightedEnergyLevelPlot,
      selectedEnergyLevelPlot,
      potentialPlot
    ];

    super( chartTransform, plots );


    // Update all plots at the same time.
    const updatePlots = () => {

      const boundStateResult = model.boundStateResultProperty.value;
      potentialPlot.setYCoordinates( boundStateResult.potentials );
      energyLevelsPlot.setEnergies( boundStateResult.energies );

      const selectedEnergyLevelIndex = model.selectedEnergyLevelIndexProperty.value;
      if ( model.isEnergyLevelIndexValid( selectedEnergyLevelIndex ) ) {
        const selectedEnergy = model.getEnergyAtEnergyLevel( selectedEnergyLevelIndex );
        selectedEnergyLevelPlot.setEnergy( selectedEnergy );
      }

      const highlightedEnergyLevelIndex = model.highlightedEnergyLevelIndexProperty.value;
      if ( highlightedEnergyLevelIndex === null || model.isEnergyLevelIndexValid( highlightedEnergyLevelIndex ) ) {
        const highlightedEnergy = ( highlightedEnergyLevelIndex === null ) ? null : model.getEnergyAtEnergyLevel( highlightedEnergyLevelIndex );
        highlightedEnergyLevelPlot.setEnergy( highlightedEnergy );
      }

      this.update();
    };

    chartTransform.changedEmitter.addListener( () => updatePlots() );

    Multilink.multilinkAny( [
        model.boundStateResultProperty,
        model.selectedEnergyLevelIndexProperty,
        model.highlightedEnergyLevelIndexProperty,
        ...plots.map( plot => plot.strokeProperty )
      ],
      () => {
        if ( !isSettingPhetioStateProperty.value ) {
          updatePlots();
        }
      } );

    // When PhET-iO state has been completely restored, update plots.
    if ( Tandem.PHET_IO_ENABLED ) {
      phetioStateSetEmitter.addListener( () => updatePlots() );
    }
  }
}