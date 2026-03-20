// Copyright 2026, University of Colorado Boulder

/**
 * ReferenceLineKeyboardListener is the KeyboardListener the Reference Line.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import TRangedProperty from '../../../../axon/js/TRangedProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import SceneryPhetFluent from '../../../../scenery-phet/js/SceneryPhetFluent.js';
import HotkeyData from '../../../../scenery/js/input/HotkeyData.js';
import type { OneKeyStroke } from '../../../../scenery/js/input/KeyDescriptor.js';
import KeyboardListener from '../../../../scenery/js/listeners/KeyboardListener.js';
import sharedSoundPlayers from '../../../../tambo/js/sharedSoundPlayers.js';
import SoundClipPlayer from '../../../../tambo/js/sound-generators/SoundClipPlayer.js';
import generalBoundaryBoop_mp3 from '../../../../tambo/sounds/generalBoundaryBoop_mp3.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import { ReferenceLineHandleNode } from './ReferenceLineNode.js';

// Same as Slider min and max defaults.
const MAX_SOUND_PLAYER = sharedSoundPlayers.get( 'generalBoundaryBoop' );
const MIN_SOUND_PLAYER = new SoundClipPlayer( generalBoundaryBoop_mp3, {
  soundClipOptions: {
    initialOutputLevel: 0.2,
    initialPlaybackRate: 1 / Math.pow( 2, 1 / 6 ) // a major second lower
  },
  soundManagerOptions: { categoryName: 'user-interface' }
} );

export class ReferenceLineKeyboardListener extends KeyboardListener<OneKeyStroke[]> {

  public static readonly HOME_HOTKEY_DATA = new HotkeyData( {
    keys: [ 'home' ],
    repoName: quantumBoundStates.name,
    keyboardHelpDialogLabelStringProperty: SceneryPhetFluent.keyboardHelpDialog.jumpToMinimumStringProperty
  } );

  public static readonly END_HOTKEY_DATA = new HotkeyData( {
    keys: [ 'end' ],
    repoName: quantumBoundStates.name,
    keyboardHelpDialogLabelStringProperty: SceneryPhetFluent.keyboardHelpDialog.jumpToMaximumStringProperty
  } );

  private readonly referenceLineHandleNode: ReferenceLineHandleNode;

  public constructor( referenceLineHandleNode: ReferenceLineHandleNode,
                      xProperty: TRangedProperty,
                      positionProperty: Property<Vector2>,
                      tandem: Tandem ) {
    super( {
      tandem: tandem,
      keyStringProperties: HotkeyData.combineKeyStringProperties( [
        ReferenceLineKeyboardListener.HOME_HOTKEY_DATA,
        ReferenceLineKeyboardListener.END_HOTKEY_DATA
      ] ),

      fire: ( event, keysPressed, listener ) => {
        if ( keysPressed === 'home' ) {
          this.home( xProperty, positionProperty );
        }
        else if ( keysPressed === 'end' ) {
          this.end( xProperty, positionProperty );
        }
      }
    } );

    this.referenceLineHandleNode = referenceLineHandleNode;
  }

  /**
   * Handles the home key, which moves the reference line to the minimum value.
   */
  private home( xProperty: TRangedProperty, positionProperty: Property<Vector2> ): void {

    // Set both xProperty and positionProperty so that drag listener stays in sync.
    xProperty.value = xProperty.range.min;
    positionProperty.value = new Vector2( xProperty.range.min, positionProperty.value.y );
    MIN_SOUND_PLAYER.play();
    this.referenceLineHandleNode.doAccessibleObjectResponse();
  }

  /**
   * Handles the end key, which moves the reference line to the maximum value.
   */
  private end( xProperty: TRangedProperty, positionProperty: Property<Vector2> ): void {

    // Set both xProperty and positionProperty so that drag listener stays in sync.
    xProperty.value = xProperty.range.max;
    positionProperty.value = new Vector2( xProperty.range.max, positionProperty.value.y );
    MAX_SOUND_PLAYER.play();
    this.referenceLineHandleNode.doAccessibleObjectResponse();
  }

  /**
   * Handles alt+c (or option+c on macOS) which provides a description of the current values,
   * the same as when the reference line gets focus.
   */
  private checkValues(): void {
    this.referenceLineHandleNode.doAccessibleObjectResponse();
  }
}
