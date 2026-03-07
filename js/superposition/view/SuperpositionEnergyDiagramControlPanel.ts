// Copyright 2026, University of Colorado Boulder

/**
 * SuperpositionEnergyDiagramControlPanel contains controls related to what is shown in the Energy diagram
 * for the 'Superposition' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import AlignBox, { AlignBoxOptions } from '../../../../scenery/js/layout/nodes/AlignBox.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { EnergyDiagramControlPanel } from '../../common/view/EnergyDiagramControlPanel.js';
import ValuesCheckbox from '../../common/view/ValuesCheckbox.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import { SuperpositionConfigurationType } from '../model/SuperpositionConfigurationType.js';
import PresetCustomSwitch from './PresetCustomSwitch.js';
import SuperpositionCustomComboBox from './SuperpositionCustomComboBox.js';
import SuperpositionCustomizationDialog from './SuperpositionCustomizationDialog.js';
import SuperpositionEditButton from './SuperpositionEditButton.js';
import SuperpositionInfoButton from './SuperpositionInfoButton.js';
import SuperpositionInfoDialog from './SuperpositionInfoDialog.js';
import SuperpositionPresetComboBox from './SuperpositionPresetComboBox.js';

export class SuperpositionEnergyDiagramControlPanel extends EnergyDiagramControlPanel {

  public constructor( listboxParent: Node,
                      superpositionConfigurationTypeProperty: Property<SuperpositionConfigurationType>,
                      superpositionPresetProperty: NumberProperty,
                      valuesVisibleProperty: Property<boolean>,
                      tandem: Tandem ) {

    const presetHBox = new HBox( {
      spacing: 8,
      children: [
        new SuperpositionPresetComboBox( superpositionPresetProperty, listboxParent, tandem.createTandem( 'superpositionPresetComboBox' ) ),
        new SuperpositionInfoButton( {
          listener: () => new SuperpositionInfoDialog().show(),
          tandem: tandem.createTandem( 'infoButton' )
        } )
      ],
      visibleProperty: new DerivedProperty( [ superpositionConfigurationTypeProperty ], type => type === 'preset' )
    } );

    const customHBox = new HBox( {
      spacing: 8,
      children: [
        new SuperpositionCustomComboBox( superpositionPresetProperty, listboxParent, tandem.createTandem( 'superpositionCustomComboBox' ) ),
        new SuperpositionEditButton( {
          listener: () => new SuperpositionCustomizationDialog().show(),
          tandem: tandem.createTandem( 'editButton' )
        } )
      ],
      visibleProperty: new DerivedProperty( [ superpositionConfigurationTypeProperty ], type => type === 'custom' )
    } );

    const alignBoxOptions: AlignBoxOptions = {
      group: new AlignGroup(),
      xAlign: 'left'
    };

    const controls = [
      new PresetCustomSwitch( superpositionConfigurationTypeProperty, tandem.createTandem( 'presetCustomSwitch' ) ),
      new Node( {
        children: [
          new AlignBox( presetHBox, alignBoxOptions ),
          new AlignBox( customHBox, alignBoxOptions )
        ]
      } ),
      new ValuesCheckbox( valuesVisibleProperty, tandem.createTandem( 'valuesCheckbox' ) )
    ];

    super( controls, tandem );
  }
}

quantumBoundStates.register( 'SuperpositionEnergyDiagramControlPanel', SuperpositionEnergyDiagramControlPanel );