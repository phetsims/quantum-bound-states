// Copyright 2026, University of Colorado Boulder

/**
 * OneWellEnergyDiagramControlPanel contains controls related to what is shown in the Energy diagram for
 * the 'One Well' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { EnergyDiagramControlPanel } from '../../common/view/EnergyDiagramControlPanel.js';
import EnergyLevelControl from '../../common/view/EnergyLevelControl.js';
import MassControl from '../../common/view/MassControl.js';
import ValuesCheckbox from '../../common/view/ValuesCheckbox.js';
import quantumBoundStates from '../../quantumBoundStates.js';

export class OneWellEnergyDiagramControlPanel extends EnergyDiagramControlPanel {

  public constructor( energyLevelProperty: NumberProperty,
                      electronMassesProperty: NumberProperty,
                      valuesVisibleProperty: Property<boolean>,
                      tandem: Tandem ) {

    const controls = [
      new EnergyLevelControl( energyLevelProperty, tandem.createTandem( 'energyLevelControl' ) ),
      new MassControl( electronMassesProperty, tandem.createTandem( 'massControl' ) ),
      new ValuesCheckbox( valuesVisibleProperty, tandem.createTandem( 'valuesCheckbox' ) )
    ];

    super( controls, tandem );
  }
}

quantumBoundStates.register( 'OneWellEnergyDiagramControlPanel', OneWellEnergyDiagramControlPanel );