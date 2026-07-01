// Copyright 2026, University of Colorado Boulder

/**
 * EnergyLevelHighlightListener supports clicking in the Energy Diagram to select and energy level.
 * With pointer input it highlights the energy level that is closest to the pointer.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartRectangle from '../../../../bamboo/js/ChartRectangle.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PressListener, { PressListenerEvent, PressListenerOptions } from '../../../../scenery/js/listeners/PressListener.js';
import sharedSoundPlayers from '../../../../tambo/js/sharedSoundPlayers.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import QBSModel from '../model/QBSModel.js';

// The pointer must be this close to an energy level to highlight it or select it.
const ENERGY_CLOSENESS_THRESHOLD = 1; // eV

type SelfOptions = {

  // Whether clicking on the highlighted energy level causes it to be selected.
  hasEnergyLevelSelection?: boolean;
};

export type EnergyLevelHighlightListenerOptions = SelfOptions & PickRequired<PressListenerOptions, 'tandem'>;

export default class EnergyLevelHighlightListener extends PressListener {

  private readonly model: QBSModel;
  private readonly chartRectangle: ChartRectangle;
  private readonly chartTransform: ChartTransform;

  public constructor( model: QBSModel,
                      chartRectangle: ChartRectangle,
                      chartTransform: ChartTransform,
                      providedOptions: EnergyLevelHighlightListenerOptions ) {

    const soundPlayer = sharedSoundPlayers.get( 'pushButton' );

    const options = optionize<EnergyLevelHighlightListenerOptions, SelfOptions, PressListenerOptions>()( {

      // SelfOptions
      hasEnergyLevelSelection: true
    }, providedOptions );

    // Press to select the highlighted energy level.
    if ( options.hasEnergyLevelSelection ) {
      options.press = event => {
        if ( model.highlightedEnergyLevelIndexProperty.value !== null ) {
          model.selectedEnergyLevelIndexProperty.value = model.highlightedEnergyLevelIndexProperty.value;
          soundPlayer.play();
        }
      };
    }

    super( options );

    this.model = model;
    this.chartRectangle = chartRectangle;
    this.chartTransform = chartTransform;

    // If the highlighted energy level becomes selected, clear the highlighted energy level.
    model.selectedEnergyLevelIndexProperty.link( selectedEnergyLevel => {
      if ( !isSettingPhetioStateProperty.value ) {
        if ( model.highlightedEnergyLevelIndexProperty.value === selectedEnergyLevel ) {
          model.highlightedEnergyLevelIndexProperty.value = null;
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
    if ( energyLevel !== this.model.selectedEnergyLevelIndexProperty.value ) {
      this.model.highlightedEnergyLevelIndexProperty.value = energyLevel;
    }
    else {
      this.model.highlightedEnergyLevelIndexProperty.value = null;
    }
  }

  /**
   * Override exit to clear the highlighted energy level when the pointer exits the chart.
   */
  public override exit( event: PressListenerEvent ): void {
    super.exit( event );
    this.model.highlightedEnergyLevelIndexProperty.value = null;
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
    return this.model.getClosestEnergyLevelIndex( energy, ENERGY_CLOSENESS_THRESHOLD );
  }
}