// Copyright 2025-2026, University of Colorado Boulder

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
import { HomeEndKeyboardListener } from './HomeEndKeyboardListener.js';
import ReferenceLineReadValuesListener from './ReferenceLineReadValuesListener.js';

// Because tools are implemented using scenery DragListener, A and D keys also behave like arrowLeft and arrowRight,
// respectively. But it was a conscious design decision to NOT specify them here because the keyboard help would be
// very odd and potentially confusing -- WASD is a well-known convention, but AD is not. And while it would be
// nice to support the full set of arrow and WASD keys, that proved to be complicated with the existing DragListener
// implementation, so we decided against it. We also considered reimplementing the tools as subclasses of AccessibleSlider
// so that all arrow keys and WASD keys would then be supported. But that would involve major changes to the PhET-iO API,
// and major migration problems, so again we decided against it.
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
      KeyboardHelpSectionRow.fromHotkeyData( MOVE_HOTKEY_DATA, {
        labelStringProperty: SceneryPhetFluent.keyboardHelpDialog.moveStringProperty
      } ),

      // Move slower
      KeyboardHelpSectionRow.fromHotkeyData( MOVE_SLOWER_HOTKEY_DATA, {
        labelStringProperty: SceneryPhetFluent.keyboardHelpDialog.moveSlowerStringProperty
      } ),

      // Read values
      KeyboardHelpSectionRow.fromHotkeyData( ReferenceLineReadValuesListener.HOTKEY_DATA ),

      // Jump to minimum
      KeyboardHelpSectionRow.fromHotkeyData( HomeEndKeyboardListener.HOME_HOTKEY_DATA ),

      // Jump to maximum
      KeyboardHelpSectionRow.fromHotkeyData( HomeEndKeyboardListener.END_HOTKEY_DATA )
    ];

    super( QuantumBoundStatesFluent.keyboardHelp.referenceLine.headingStringProperty, rows, {
      textMaxWidth: 300,
      isDisposable: false
    } );
  }
}
