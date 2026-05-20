// Copyright 2025-2026, University of Colorado Boulder

/**
 * ReferenceLineKeyboardHelpSection is the keyboard-help section that describes how to interact with the Reference Line.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import KeyboardHelpSectionRow from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import SceneryPhetFluent from '../../../../scenery-phet/js/SceneryPhetFluent.js';
import KeyboardDragListener from '../../../../scenery/js/listeners/KeyboardDragListener.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import ReferenceLineReadValuesListener from './ReferenceLineReadValuesListener.js';

export default class ReferenceLineKeyboardHelpSection extends KeyboardHelpSection {

  public constructor() {

    const rows = [

      // Move
      KeyboardHelpSectionRow.fromHotkeyData( KeyboardDragListener.MOVE_HOTKEY_DATA, {
        labelStringProperty: SceneryPhetFluent.keyboardHelpDialog.moveStringProperty
      } ),

      // Move slower
      KeyboardHelpSectionRow.fromHotkeyData( KeyboardDragListener.MOVE_SLOWER_HOTKEY_DATA, {
        labelStringProperty: SceneryPhetFluent.keyboardHelpDialog.moveSlowerStringProperty
      } ),

      // Read values
      KeyboardHelpSectionRow.fromHotkeyData( ReferenceLineReadValuesListener.HOTKEY_DATA )
    ];

    // 'Vectors' title
    super( QuantumBoundStatesFluent.keyboardHelp.referenceLine.headingStringProperty, rows, {
      textMaxWidth: 300,
      isDisposable: false
    } );
  }
}
