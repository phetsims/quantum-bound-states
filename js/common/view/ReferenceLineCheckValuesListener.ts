// Copyright 2025-2026, University of Colorado Boulder

/**
 * ReferenceLineCheckValuesListener implements a keyboard shortcut for the Reference Line that repeats the
 * focus description of the Reference Line. This is useful because the data that the Reference Line is reporting
 * evolves over time.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import HotkeyData from '../../../../scenery/js/input/HotkeyData.js';
import type { OneKeyStroke } from '../../../../scenery/js/input/KeyDescriptor.js';
import KeyboardListener from '../../../../scenery/js/listeners/KeyboardListener.js';
import sharedSoundPlayers from '../../../../tambo/js/sharedSoundPlayers.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import { ReferenceLineHandleNode } from './ReferenceLineNode.js';

export default class ReferenceLineCheckValuesListener extends KeyboardListener<OneKeyStroke[]> {

  public static readonly CHECK_VALUES_HOTKEY_DATA = new HotkeyData( {
    keys: [ 'alt+c' ],
    repoName: quantumBoundStates.name,
    keyboardHelpDialogLabelStringProperty: QuantumBoundStatesFluent.keyboardHelp.referenceLine.checkValuesStringProperty
  } );

  public constructor( referenceLineHandleNode: ReferenceLineHandleNode, tandem: Tandem ) {

    const soundPlayer = sharedSoundPlayers.get( 'generalOpen' );

    super( {
      isDisposable: false,
      keyStringProperties: HotkeyData.combineKeyStringProperties( [ ReferenceLineCheckValuesListener.CHECK_VALUES_HOTKEY_DATA ] ),
      fire: ( event, keysPressed ) => {
        referenceLineHandleNode.describeFocused();
        soundPlayer.play();
      },
      tandem: tandem
    } );
  }
}
