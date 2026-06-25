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
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import MultiColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/MultiColumnKeyboardHelpContent.js';
import ReferenceLineKeyboardHelpSection from './ReferenceLineKeyboardHelpSection.js';

export default class QBSKeyboardHelpContent extends MultiColumnKeyboardHelpContent {

  public constructor() {

    const column1 = [

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
    ];

    const column2 = [

      // Time Controls
      new TimeControlsKeyboardHelpSection(),

      // Combo Boxes
      new ComboBoxKeyboardHelpSection( {
        headingString: QuantumBoundStatesFluent.keyboardHelp.comboBox.headingStringProperty
      } ),

      // Slider Controls
      new SliderControlsKeyboardHelpSection()
    ];

    const column3 = [

      // Spinner Controls
      new SpinnerControlsKeyboardHelpSection(),

      // Basic Actions
      new BasicActionsKeyboardHelpSection( {
        withCheckboxContent: true
      } )
    ];

    super( [ column1, column2, column3 ], {
      isDisposable: false
    } );
  }
}
