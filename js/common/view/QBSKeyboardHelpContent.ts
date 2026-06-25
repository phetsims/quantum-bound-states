// Copyright 2026, University of Colorado Boulder

/**
 * QBSKeyboardHelpContent is the content for the keyboard-help dialog in all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import ComboBoxKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/ComboBoxKeyboardHelpSection.js';
import MoveDraggableItemsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/MoveDraggableItemsKeyboardHelpSection.js';
import SliderControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SliderControlsKeyboardHelpSection.js';
import SpinnerControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SpinnerControlsKeyboardHelpSection.js';
import TimeControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/TimeControlsKeyboardHelpSection.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import ReferenceLineKeyboardHelpSection from './ReferenceLineKeyboardHelpSection.js';

const ROW_SPACING = 40;
const COLUMN_SPACING = 40;

export default class QBSKeyboardHelpContent extends HBox {

  public constructor() {

    const column1 = new VBox( {
      align: 'left',
      spacing: ROW_SPACING,
      children: [

        // Potential Handles
        new MoveDraggableItemsKeyboardHelpSection( {
          headingStringProperty: QuantumBoundStatesFluent.keyboardHelp.potentialHandles.headingStringProperty
        } ),

        // Magnifier
        new MoveDraggableItemsKeyboardHelpSection( {
          headingStringProperty: QuantumBoundStatesFluent.keyboardHelp.magnifier.headingStringProperty
        } ),

        // Reference Line
        new ReferenceLineKeyboardHelpSection()
      ]
    } );

    const column2 = new VBox( {
      align: 'left',
      spacing: ROW_SPACING,
      children: [

        // Time Controls
        new TimeControlsKeyboardHelpSection(),

        // Combo Boxes
        new ComboBoxKeyboardHelpSection( {
          headingString: QuantumBoundStatesFluent.keyboardHelp.comboBox.headingStringProperty
        } ),

        // Slider Controls
        new SliderControlsKeyboardHelpSection()
      ]
    } );

    const column3 = new VBox( {
      align: 'left',
      spacing: ROW_SPACING,
      children: [

        // Spinner Controls
        new SpinnerControlsKeyboardHelpSection(),

        // Basic Actions
        new BasicActionsKeyboardHelpSection( {
          withCheckboxContent: true
        } )
      ]
    } );

    super( {
      isDisposable: false,
      spacing: COLUMN_SPACING,
      align: 'top',
      children: [ column1, column2, column3 ]
    } );
  }
}
