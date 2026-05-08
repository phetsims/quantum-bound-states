// Copyright 2026, University of Colorado Boulder

/**
 * EnergyLevelSelectionListener supports clicking in the Energy Diagram to select and energy level.
 * With pointer input it highlights the energy level that is closest to the pointer.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import ChartRectangle from '../../../../bamboo/js/ChartRectangle.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import TInputListener from '../../../../scenery/js/input/TInputListener.js';
import PressListener, { PressListenerEvent } from '../../../../scenery/js/listeners/PressListener.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSModel from '../model/QBSModel.js';

// The pointer must be this close to an energy level to select it.
const ENERGY_CLOSENESS_THRESHOLD = 1; // eV

export default class EnergyLevelSelectionListener extends PressListener implements TInputListener {

  private readonly model: QBSModel;
  private readonly chartRectangle: ChartRectangle;
  private readonly chartTransform: ChartTransform;
  private readonly highlightedEnergyLevelProperty: Property<number | null>;

  //TODO Reduce coupling to QBSModel
  public constructor( model: QBSModel,
                      chartRectangle: ChartRectangle,
                      chartTransform: ChartTransform,
                      highlightedEnergyLevelProperty: Property<number | null>,
                      tandem: Tandem ) {
    super( {
      tandem: tandem,
      press: event => {

        // Find the energy level that is closest to where the press occurred.
        const closestEnergyLevel = this.eventToEnergyLevel( event );

        // If there is a closest energy level, set the energy level
        if ( closestEnergyLevel !== null ) {
          model.energyLevelProperty.value = closestEnergyLevel;
        }
      }
    } );

    this.model = model;
    this.chartRectangle = chartRectangle;
    this.chartTransform = chartTransform;
    this.highlightedEnergyLevelProperty = highlightedEnergyLevelProperty;
  }

  /**
   * Override move to handle highlighting of the closest energy level.
   */
  public override move( event: PressListenerEvent ): void {
    super.move( event );

    // Highlight the energy level that is closest to where the pointer is.
    this.highlightedEnergyLevelProperty.value = this.eventToEnergyLevel( event );
  }

  /**
   * Finds the energy level that is closest to the position of the provided scenery event.
   * Returns null if no energy level is found.
   */
  private eventToEnergyLevel( event: PressListenerEvent ): number | null {

    // Compute the energy value at the point where the press occurred.
    const globalPoint = event.pointer.point;
    const localPoint = this.chartRectangle.globalToLocalPoint( globalPoint );
    const energy = this.chartTransform.viewToModelY( localPoint.y );

    // Find the closest energy level.
    const index = this.model.getClosestEigenstateIndex( energy, ENERGY_CLOSENESS_THRESHOLD );

    // Adjust for the ground state index.
    const energyLevel = ( index === -1 ) ? null : index + this.model.potentialProperty.value.groundStateIndex;
    phet.log && phet.log( `EnergyLevelSelectionListener.eventToEnergyLevel: energy=${energyLevel}, index=${index}, energyLevel=${energyLevel}` );

    return energyLevel;
  }
}