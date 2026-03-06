// Copyright 2026, University of Colorado Boulder

/**
 * SuperpositionEnergyDiagramControlPanel contains controls related to what is shown in the Energy diagram
 * for the 'Superposition' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { EnergyDiagramControlPanel } from '../../common/view/EnergyDiagramControlPanel.js';
import ValuesCheckbox from '../../common/view/ValuesCheckbox.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import { SuperpositionConfigurationType } from '../model/SuperpositionConfigurationType.js';
import PresetCustomSwitch from './PresetCustomSwitch.js';

export class SuperpositionEnergyDiagramControlPanel extends EnergyDiagramControlPanel {

  public constructor(
    superpositionConfigurationTypeProperty: Property<SuperpositionConfigurationType>,
    valuesVisibleProperty: Property<boolean>,
    tandem: Tandem ) {

    const controls = [
      new PresetCustomSwitch( superpositionConfigurationTypeProperty, tandem.createTandem( 'presetCustomSwitch' ) ),
      //TODO superpositionPresetsComboBox + eyeToggleButton
      //TODO superpositionCustomComboBox + editButton
      new ValuesCheckbox( valuesVisibleProperty, tandem.createTandem( 'valuesCheckbox' ) )
    ];

    super( controls, tandem );
  }
}

quantumBoundStates.register( 'SuperpositionEnergyDiagramControlPanel', SuperpositionEnergyDiagramControlPanel );