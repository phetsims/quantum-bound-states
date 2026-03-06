// Copyright 2026, University of Colorado Boulder

/**
 * ReferenceLineKeyboardHelpSection is the keyboard-help section that describes how to interact with the Reference Line.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import KeyboardHelpSectionRow from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import SceneryPhetFluent from '../../../../scenery-phet/js/SceneryPhetFluent.js';
import HotkeyData from '../../../../scenery/js/input/HotkeyData.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import { ReferenceLineKeyboardListener } from './ReferenceLineKeyboardListener.js';

// Specify HotkeyData for each KeyboardHelpSectionRow, so that we can use KeyboardHelpSectionRow.fromHotkeyData
// which creates both the visual interface and core description.

// Because the Reference Line is implemented using scenery DragListener, A and D keys also behave like arrowLeft and
// arrowRight, respectively. But it was a conscious design decision to NOT specify them here because the keyboard help
// would be very odd and potentially confusing -- WASD is a well-known convention, but AD is not.
const MOVE_HOTKEY_DATA = new HotkeyData( {
  keys: [ 'arrowLeft', 'arrowRight' ],
  repoName: quantumBoundStates.name,
  keyboardHelpDialogLabelStringProperty: SceneryPhetFluent.keyboardHelpDialog.moveStringProperty
} );

const MOVE_SLOWER_HOTKEY_DATA = new HotkeyData( {
  keys: [ 'shift+arrowLeft', 'shift+arrowRight' ],
  repoName: quantumBoundStates.name,
  keyboardHelpDialogLabelStringProperty: SceneryPhetFluent.keyboardHelpDialog.moveSlowerStringProperty
} );

export default class ReferenceLineKeyboardHelpSection extends KeyboardHelpSection {

  public constructor() {

    const rows = [

      // Move
      KeyboardHelpSectionRow.fromHotkeyData( MOVE_HOTKEY_DATA ),

      // Move slower
      KeyboardHelpSectionRow.fromHotkeyData( MOVE_SLOWER_HOTKEY_DATA ),

      // Jump to minimum
      KeyboardHelpSectionRow.fromHotkeyData( ReferenceLineKeyboardListener.HOME_HOTKEY_DATA ),

      // Jump to maximum
      KeyboardHelpSectionRow.fromHotkeyData( ReferenceLineKeyboardListener.END_HOTKEY_DATA ),

      // Check values
      KeyboardHelpSectionRow.fromHotkeyData( ReferenceLineKeyboardListener.CHECK_VALUES_HOTKEY_DATA )
    ];

    super( QuantumBoundStatesFluent.keyboardHelp.referenceLine.headingStringProperty, rows, {
      isDisposable: false,
      textMaxWidth: 300
    } );
  }
}

quantumBoundStates.register( 'ReferenceLineKeyboardHelpSection', ReferenceLineKeyboardHelpSection );