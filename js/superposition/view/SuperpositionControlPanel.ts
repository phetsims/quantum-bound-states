// Copyright 2026, University of Colorado Boulder

/**
 * SuperpositionControlPanel is the control panel that is specific to the 'Superposition' screen,
 * positioned to the right of the 'Energy' diagram.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
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
import QBSColors from '../../common/QBSColors.js';
import QBSConstants from '../../common/QBSConstants.js';
import PotentialComboBox from '../../common/view/PotentialComboBox.js';
import QuantumStateGraphControlPanel from '../../common/view/QuantumStateGraphControlPanel.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import CustomSuperpositionState from '../model/CustomSuperpositionState.js';
import PresetSuperpositionState from '../model/PresetSuperpositionState.js';
import { SuperpositionStateType } from '../model/SuperpositionStateType.js';
import PresetCustomSwitch from './PresetCustomSwitch.js';
import SuperpositionCustomButton from './SuperpositionCustomButton.js';
import SuperpositionCustomComboBox from './SuperpositionCustomComboBox.js';
import SuperpositionCustomDialog from './SuperpositionCustomDialog.js';
import SuperpositionPresetButton from './SuperpositionPresetButton.js';
import SuperpositionPresetComboBox from './SuperpositionPresetComboBox.js';
import SuperpositionPresetDialog from './SuperpositionPresetDialog.js';

// Space between the combo box and the button.
const BUTTON_SPACING = 8;

export class SuperpositionControlPanel extends Panel {

  public constructor( listboxParent: Node,
                      potentialProperty: Property<QuantumPotential>,
                      superpositionStateTypeProperty: Property<SuperpositionStateType>,
                      superpositionPresetProperty: Property<PresetSuperpositionState>,
                      superpositionCustomProperty: Property<CustomSuperpositionState>,
                      tandem: Tandem ) {

    const titleText = new Text( QuantumBoundStatesFluent.energyDiagramStringProperty, {
      font: QBSConstants.TITLE_FONT,
      maxWidth: 200,
      tandem: tandem.createTandem( 'titleText' ),
      phetioVisiblePropertyInstrumented: true,
      visiblePropertyOptions: { phetioFeatured: true }
    } );

    const subtitleText = new Text( QuantumBoundStatesFluent.superpositionStateStringProperty, {
      font: QBSConstants.TITLE_FONT,
      maxWidth: 200,
      phetioVisiblePropertyInstrumented: true,
      visiblePropertyOptions: { phetioFeatured: true }
    } );

    // To make both push buttons have the same effective size.
    const buttonAlignGroup = new AlignGroup();

    // To make both combo boxes have the same actual size by making their items have the same effective size.
    // This is a workaround for the lack of dynamic layout support in ComboBox.
    const comboBoxItemAlignGroup = new AlignGroup();

    const presetComboBox = new SuperpositionPresetComboBox( superpositionPresetProperty, listboxParent,
      comboBoxItemAlignGroup, tandem.createTandem( 'superpositionPresetComboBox' ) );

    const presetButton = new SuperpositionPresetButton( {
      listener: () => new SuperpositionPresetDialog( superpositionPresetProperty.value, potentialProperty.value.groundStateIndex ).show(),
      tandem: tandem.createTandem( 'presetButton' )
    } );

    const presetHBox = new HBox( {
      spacing: BUTTON_SPACING,
      children: [ presetComboBox, buttonAlignGroup.createBox( presetButton ) ],
      visibleProperty: superpositionStateTypeProperty.derived( superpositionStateType => superpositionStateType === 'preset' )
    } );

    const customComboBox = new SuperpositionCustomComboBox( superpositionCustomProperty, listboxParent,
      comboBoxItemAlignGroup, tandem.createTandem( 'customComboBox' ) );

    const customButton = new SuperpositionCustomButton( {
      listener: () => new SuperpositionCustomDialog( superpositionCustomProperty.value, potentialProperty.value.groundStateIndex ).show(),
      tandem: tandem.createTandem( 'customButton' )
    } );

    const customHBox = new HBox( {
      spacing: BUTTON_SPACING,
      children: [ customComboBox, buttonAlignGroup.createBox( customButton ) ],
      visibleProperty: superpositionStateTypeProperty.derived( type => type === 'custom' )
    } );

    const content = new VBox( combineOptions<VBoxOptions>( {}, QBSConstants.VBOX_OPTIONS, {
      children: [
        titleText,
        new PotentialComboBox( potentialProperty, listboxParent, tandem.createTandem( 'potentialComboBox' ) ),
        new HSeparator( { stroke: QBSColors.separatorStrokeProperty } ),
        subtitleText,
        new PresetCustomSwitch( superpositionStateTypeProperty, tandem.createTandem( 'presetCustomSwitch' ) ),
        new Node( {
          children: [ presetHBox, customHBox ]
        } )
      ]
    } ) );

    const options = combineOptions<PanelOptions>( {}, QBSConstants.PANEL_OPTIONS, {
      isDisposable: false,
      minWidth: QuantumStateGraphControlPanel.FIXED_WIDTH,
      maxWidth: QuantumStateGraphControlPanel.FIXED_WIDTH,
      accessibleHeading: QuantumBoundStatesFluent.a11y.energyDiagramControls.accessibleHeadingStringProperty,
      tandem: tandem
    } );

    super( content, options );
  }
}
