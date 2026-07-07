// Copyright 2026, University of Colorado Boulder

/**
 * SuperpositionEnergyDiagramPanel is the Energy Diagram panel that is specific to the 'Superposition' screen,
 * positioned to the right of the 'Energy' diagram.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import HSeparator from '../../../../scenery/js/layout/nodes/HSeparator.js';
import VBox, { VBoxOptions } from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumPotential from '../../common/model/potentials/QuantumPotential.js';
import QBSTime from '../../common/model/QBSTime.js';
import BoundStateResult from '../../common/model/solvers/BoundStateResult.js';
import QBSColors from '../../common/QBSColors.js';
import QBSConstants from '../../common/QBSConstants.js';
import PotentialComboBox from '../../common/view/PotentialComboBox.js';
import QuantumStateGraphPanel from '../../common/view/QuantumStateGraphPanel.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import CustomSuperpositionState from '../model/CustomSuperpositionState.js';
import PresetSuperpositionState from '../model/PresetSuperpositionState.js';
import { SuperpositionStateType } from '../model/SuperpositionStateType.js';
import CustomComboBox from './CustomComboBox.js';
import CustomDialog from './CustomDialog.js';
import CustomEditButton from './CustomEditButton.js';
import EnergyLevelsText from './EnergyLevelsText.js';
import PresetComboBox from './PresetComboBox.js';
import PresetCustomSwitch from './PresetCustomSwitch.js';
import PresetDialog from './PresetDialog.js';
import PresetInfoButton from './PresetInfoButton.js';

// Space between the combo box and the button.
const BUTTON_SPACING = 8;

export class SuperpositionEnergyDiagramPanel extends Panel {

  public constructor( listboxParent: Node,
                      potentialProperty: Property<QuantumPotential>,
                      boundStatesResultProperty: TReadOnlyProperty<BoundStateResult>,
                      superpositionStateTypeProperty: Property<SuperpositionStateType>,
                      superpositionPresetProperty: Property<PresetSuperpositionState>,
                      superpositionCustomProperty: Property<CustomSuperpositionState>,
                      time: QBSTime,
                      tandem: Tandem ) {

    const energyDiagramText = new Text( QuantumBoundStatesFluent.energyDiagramStringProperty, {
      font: QBSConstants.TITLE_FONT,
      maxWidth: 200,
      tandem: tandem.createTandem( 'energyDiagramText' ),
      phetioVisiblePropertyInstrumented: true,
      visiblePropertyOptions: { phetioFeatured: true }
    } );

    const superpositionStateText = new Text( QuantumBoundStatesFluent.superpositionStateStringProperty, {
      font: QBSConstants.TITLE_FONT,
      maxWidth: 200,
      tandem: tandem.createTandem( 'superpositionStateText' ),
      phetioVisiblePropertyInstrumented: true,
      visiblePropertyOptions: { phetioFeatured: true }
    } );

    // To make both push buttons have the same effective size.
    const buttonAlignGroup = new AlignGroup();

    // To make both combo boxes have the same actual size by making their items have the same effective size.
    // This is a workaround for the lack of dynamic layout support in ComboBox.
    const comboBoxItemAlignGroup = new AlignGroup();

    const presetComboBox = new PresetComboBox( superpositionPresetProperty, listboxParent,
      comboBoxItemAlignGroup, tandem.createTandem( 'presetComboBox' ) );

    const presetInfoButton = new PresetInfoButton( {
      listener: () => {
        const wasPlaying = time.isPlayingProperty.value;
        const presetDialog = new PresetDialog( superpositionPresetProperty.value, potentialProperty.value.groundStateIndex, {
          showCallback: () => {
            time.isPlayingProperty.value = false;
          },
          hideCallback: () => {
            time.isPlayingProperty.value = wasPlaying;
            presetDialog.dispose();
          }
        } );
        presetDialog.show();
      },
      tandem: tandem.createTandem( 'presetInfoButton' )
    } );

    const presetHBox = new HBox( {
      spacing: BUTTON_SPACING,
      children: [ presetComboBox, buttonAlignGroup.createBox( presetInfoButton ) ],
      visibleProperty: superpositionStateTypeProperty.derived( superpositionStateType => superpositionStateType === 'preset' )
    } );

    const customComboBox = new CustomComboBox( superpositionCustomProperty, listboxParent,
      comboBoxItemAlignGroup, tandem.createTandem( 'customComboBox' ) );

    const customEditButton = new CustomEditButton( {
      listener: () => {
        //TODO Duplication with presetInfoButton.listener
        const wasPlaying = time.isPlayingProperty.value;
        const customDialog = new CustomDialog( superpositionCustomProperty.value, potentialProperty.value,
          boundStatesResultProperty.value.energies.length, {
            showCallback: () => {
              time.isPlayingProperty.value = false;
            },
            hideCallback: () => {
              time.isPlayingProperty.value = wasPlaying;
              customDialog.dispose();
            }
          } );
        customDialog.show();
      },
      tandem: tandem.createTandem( 'customEditButton' )
    } );

    const customHBox = new HBox( {
      spacing: BUTTON_SPACING,
      children: [ customComboBox, buttonAlignGroup.createBox( customEditButton ) ],
      visibleProperty: superpositionStateTypeProperty.derived( type => type === 'custom' )
    } );

    const content = new VBox( combineOptions<VBoxOptions>( {}, QBSConstants.VBOX_OPTIONS, {
      spacing: 12, // Add more spacing for this screen.
      children: [
        energyDiagramText,
        new PotentialComboBox( potentialProperty, listboxParent, tandem.createTandem( 'potentialComboBox' ) ),
        new EnergyLevelsText( potentialProperty, boundStatesResultProperty,
          tandem.createTandem( 'energyLevelsText' ) ),
        new HSeparator( { stroke: QBSColors.separatorStrokeProperty } ),
        superpositionStateText,
        new PresetCustomSwitch( superpositionStateTypeProperty, tandem.createTandem( 'presetCustomSwitch' ) ),
        new Node( {
          children: [ presetHBox, customHBox ]
        } )
      ]
    } ) );

    const options = combineOptions<PanelOptions>( {}, QBSConstants.PANEL_OPTIONS, {
      isDisposable: false,
      minWidth: QuantumStateGraphPanel.FIXED_WIDTH,
      maxWidth: QuantumStateGraphPanel.FIXED_WIDTH,
      accessibleHeading: QuantumBoundStatesFluent.a11y.energyDiagramControls.accessibleHeadingStringProperty,
      tandem: tandem
    } );

    super( content, options );
  }
}
