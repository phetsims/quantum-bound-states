// Copyright 2026, University of Colorado Boulder

/**
 * EnergyLevelSelectionListener supports clicking in the Energy Diagram to select and energy level.
 * This listener supports pointer input only.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import PressListener from '../../../../scenery/js/listeners/PressListener.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSModel from '../model/QBSModel.js';

const ENERGY_CLOSENESS_THRESHOLD = 1; // eV

export default class EnergyLevelSelectionListener extends PressListener {

  //TODO Reduce coupling to QBSModel
  public constructor( model: QBSModel, energyDiagram: Node, chartTransform: ChartTransform, tandem: Tandem ) {
    super( {
      tandem: tandem,
      press: event => {

        // Compute the energy value at the point where the press occurred.
        const globalPoint = event.pointer.point;
        const localPoint = energyDiagram.globalToLocalPoint( globalPoint );
        const pressedEnergy = chartTransform.viewToModelY( localPoint.y );
        phet.log && phet.log( 'EnergyLevelSelectionListener: pressedEnergy = ' + pressedEnergy );

        // Find the closest energy level.
        const closestEnergyLevelIndex = model.getClosestEigenstateIndex( pressedEnergy, ENERGY_CLOSENESS_THRESHOLD );

        // If there is a closest energy level, set the energy level, adjusting for the ground state index.
        if ( closestEnergyLevelIndex !== -1 ) {
          model.energyLevelProperty.value = closestEnergyLevelIndex + model.potentialProperty.value.groundStateIndex;
          phet.log && phet.log( 'EnergyLevelSelectionListener: selected energy level = E' + model.energyLevelProperty.value );
        }
      }
    } );
  }
}