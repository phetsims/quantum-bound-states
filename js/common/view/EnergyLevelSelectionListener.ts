// Copyright 2026, University of Colorado Boulder

/**
 * EnergyLevelSelectionListener supports clicking in the Energy Diagram to select and energy level.
 * This listener supports pointer input only.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import PressListener from '../../../../scenery/js/listeners/PressListener.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumPotential from '../model/potentials/QuantumPotential.js';
import { BoundStateResult } from '../model/solver/BoundStateResult.js';

const ENERGY_THRESHOLD = 0.1; // eV

export default class EnergyLevelSelectionListener extends PressListener {

  public constructor( energyLevelProperty: Property<number>,
                      potentialProperty: TReadOnlyProperty<QuantumPotential>,
                      energyDiagram: Node,
                      chartTransform: ChartTransform,
                      boundStateResultProperty: TReadOnlyProperty<BoundStateResult>,
                      tandem: Tandem ) {
    super( {
      tandem: tandem,
      press: event => {

        // Compute the energy value at the point where the press occurred.
        const globalPoint = event.pointer.point;
        const localPoint = energyDiagram.globalToLocalPoint( globalPoint );
        const pressedEnergy = chartTransform.viewToModelY( localPoint.y );
        phet.log && phet.log( 'EnergyLevelSelectionListener: pressedEnergy = ' + pressedEnergy );

        // Find the closest energy level.
        //TODO Investigate how the Java version handled this.
        const energies = boundStateResultProperty.value.energies;
        let closestEnergyLevelIndex: number | null = null;
        for ( let i = 0; i < energies.length; i++ ) {
          const energy = energies[ i ];
          if ( Math.abs( energy - pressedEnergy ) <= ENERGY_THRESHOLD ) {
            closestEnergyLevelIndex = i;
            break;
          }
        }

        // If there is a closest energy level, set the energy level, adjusting for the ground state index.
        if ( closestEnergyLevelIndex !== null ) {
          energyLevelProperty.value = closestEnergyLevelIndex + potentialProperty.value.groundStateIndex;
          phet.log && phet.log( 'EnergyLevelSelectionListener: selected energy level = E' + energyLevelProperty.value );
        }
      }
    } );
  }
}