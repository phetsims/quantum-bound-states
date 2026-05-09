// Copyright 2026, University of Colorado Boulder

/**
 * EnergyLevelSelectionListener supports clicking in the Energy Diagram to select and energy level.
 * With pointer input it highlights the energy level that is closest to the pointer.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartRectangle from '../../../../bamboo/js/ChartRectangle.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import PressListener, { PressListenerEvent } from '../../../../scenery/js/listeners/PressListener.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSModel from '../model/QBSModel.js';

// The pointer must be this close to an energy level to highlight it or select it.
const ENERGY_CLOSENESS_THRESHOLD = 1; // eV

export default class EnergyLevelSelectionListener extends PressListener {

  private readonly model: QBSModel;
  private readonly chartRectangle: ChartRectangle;
  private readonly chartTransform: ChartTransform;

  //TODO Reduce coupling to QBSModel
  public constructor( model: QBSModel,
                      chartRectangle: ChartRectangle,
                      chartTransform: ChartTransform,
                      tandem: Tandem ) {
    super( {
      tandem: tandem,
      press: event => {

        // Select the highlighted energy level.
        if ( model.highlightedEnergyLevelProperty.value !== null ) {
          model.energyLevelProperty.value = model.highlightedEnergyLevelProperty.value;
        }
      }
    } );

    this.model = model;
    this.chartRectangle = chartRectangle;
    this.chartTransform = chartTransform;

    // If the highlighted energy level becomes selected, clear the highlighted energy level.
    model.energyLevelProperty.link( energyLevel => {
      if ( !isSettingPhetioStateProperty.value ) {
        if ( energyLevel === model.highlightedEnergyLevelProperty.value ) {
          model.highlightedEnergyLevelProperty.value = null;
        }
      }
    } );
  }

  /**
   * Override move to handle highlighting of the closest energy level.
   */
  public override move( event: PressListenerEvent ): void {
    super.move( event );

    // Highlight the energy level that is closest to where the pointer is. Do not highlight the selected energy level.
    const energyLevel = this.eventToEnergyLevel( event );
    if ( energyLevel !== this.model.energyLevelProperty.value ) {
      this.model.highlightedEnergyLevelProperty.value = energyLevel;
    }
    else {
      this.model.highlightedEnergyLevelProperty.value = null;
    }
  }

  /**
   * Override exit to clear the highlighted energy level when the pointer exits the chart.
   */
  public override exit( event: PressListenerEvent ): void {
    super.exit( event );
    this.model.highlightedEnergyLevelProperty.value = null;
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
    return this.model.getClosestEnergyLevel( energy, ENERGY_CLOSENESS_THRESHOLD );
  }
}