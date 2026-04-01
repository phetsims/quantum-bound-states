// Copyright 2026, University of Colorado Boulder

//TODO This control panel is visibly scaled down for some reason.
/**
 * SuperpositionControlPanel is the control panel that is specific to the 'Superposition' screen,
 * positioned to the right of the 'Energy' diagram.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox, { VBoxOptions } from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Potential from '../../common/model/potentials/Potential.js';
import QBSConstants from '../../common/QBSConstants.js';
import PotentialComboBox from '../../common/view/PotentialComboBox.js';
import QuantumStateGraphControlPanel from '../../common/view/QuantumStateGraphControlPanel.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import { SuperpositionConfigurationType } from '../model/SuperpositionConfigurationType.js';
import PresetCustomSwitch from './PresetCustomSwitch.js';
import SuperpositionCustomComboBox from './SuperpositionCustomComboBox.js';
import SuperpositionCustomizationButton from './SuperpositionCustomizationButton.js';
import SuperpositionCustomizationDialog from './SuperpositionCustomizationDialog.js';
import SuperpositionDetailsButton from './SuperpositionDetailsButton.js';
import SuperpositionDetailsDialog from './SuperpositionDetailsDialog.js';
import SuperpositionPresetComboBox from './SuperpositionPresetComboBox.js';

// Space between the combo box and the button.
const BUTTON_SPACING = 8;

export class SuperpositionControlPanel extends Panel {

  public constructor( listboxParent: Node,
                      potentialProperty: Property<Potential>,
                      superpositionConfigurationTypeProperty: Property<SuperpositionConfigurationType>,
                      superpositionPresetProperty: NumberProperty,
                      tandem: Tandem ) {

    const titleText = new Text( QuantumBoundStatesFluent.energyDiagramStringProperty, {
      font: QBSConstants.TITLE_FONT,
      maxWidth: 200,
      tandem: tandem.createTandem( 'titleText' ),
      phetioVisiblePropertyInstrumented: true,
      visiblePropertyOptions: { phetioFeatured: true }
    } );

    const subtitleText = new Text( QuantumBoundStatesFluent.superpositionLabelStringProperty, {
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

    const detailsButton = new SuperpositionDetailsButton( {
      listener: () => new SuperpositionDetailsDialog().show(),
      tandem: tandem.createTandem( 'detailsButton' )
    } );

    const presetHBox = new HBox( {
      spacing: BUTTON_SPACING,
      children: [ presetComboBox, buttonAlignGroup.createBox( detailsButton ) ],
      visibleProperty: new DerivedProperty( [ superpositionConfigurationTypeProperty ], type => type === 'preset' )
    } );

    const customComboBox = new SuperpositionCustomComboBox( superpositionPresetProperty, listboxParent,
      comboBoxItemAlignGroup, tandem.createTandem( 'customComboBox' ) );

    const customizationButton = new SuperpositionCustomizationButton( {
      listener: () => new SuperpositionCustomizationDialog().show(),
      tandem: tandem.createTandem( 'customizationButton' )
    } );

    const customHBox = new HBox( {
      spacing: BUTTON_SPACING,
      children: [ customComboBox, buttonAlignGroup.createBox( customizationButton ) ],
      visibleProperty: new DerivedProperty( [ superpositionConfigurationTypeProperty ], type => type === 'custom' )
    } );

    const content = new VBox( combineOptions<VBoxOptions>( {}, QBSConstants.VBOX_OPTIONS, {
      children: [
        titleText,
        new PotentialComboBox( potentialProperty, listboxParent, tandem.createTandem( 'potentialComboBox' ) ),
        subtitleText,
        new PresetCustomSwitch( superpositionConfigurationTypeProperty, tandem.createTandem( 'presetCustomSwitch' ) ),
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
