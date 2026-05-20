// Copyright 2026, University of Colorado Boulder

/**
 * QBSKeyboardHelpContent is the content for the keyboard-help dialog in all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import ComboBoxKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/ComboBoxKeyboardHelpSection.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import MoveDraggableItemsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/MoveDraggableItemsKeyboardHelpSection.js';
import SliderControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SliderControlsKeyboardHelpSection.js';
import SpinnerControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SpinnerControlsKeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';

export default class QBSKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  public constructor() {

    // Sections in the left column.
    const leftSections: KeyboardHelpSection[] = [

      // Move Draggable Items
      new MoveDraggableItemsKeyboardHelpSection( {
        headingStringProperty: QuantumBoundStatesFluent.keyboardHelp.potentialHandles.headingStringProperty
      } ),

      // Slider Controls
      new SliderControlsKeyboardHelpSection()
    ];

    // Sections in the right column.
    const rightSections: KeyboardHelpSection[] = [


      // Spinner Controls
      new SpinnerControlsKeyboardHelpSection(),

      // ComboBox
      new ComboBoxKeyboardHelpSection( {
        headingString: QuantumBoundStatesFluent.keyboardHelp.comboBox.headingStringProperty
      } ),

      // Basic Actions
      new BasicActionsKeyboardHelpSection( {
        withCheckboxContent: true
      } )
    ];

    super( leftSections, rightSections, {
      isDisposable: false
    } );
  }
}
