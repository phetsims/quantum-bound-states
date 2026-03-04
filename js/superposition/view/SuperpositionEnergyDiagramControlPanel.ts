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

export class SuperpositionEnergyDiagramControlPanel extends EnergyDiagramControlPanel {

  public constructor( valuesVisibleProperty: Property<boolean>,
                      tandem: Tandem ) {

    const controls = [
      new ValuesCheckbox( valuesVisibleProperty, tandem.createTandem( 'valuesCheckbox' ) )
      //TODO presetCustomSwitch
      //TODO superpositionComboBox + eyeToggleButton
    ];

    super( controls, tandem );
  }
}

quantumBoundStates.register( 'SuperpositionEnergyDiagramControlPanel', SuperpositionEnergyDiagramControlPanel );