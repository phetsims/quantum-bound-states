// Copyright 2026, University of Colorado Boulder

/**
 * HomeEndKeyboardListener is a KeyboardListener that handles the home and end keys, which change the value
 * of a Property to its minimum or maximum value respectively.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TRangedProperty from '../../../../axon/js/TRangedProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import SceneryPhetFluent from '../../../../scenery-phet/js/SceneryPhetFluent.js';
import HotkeyData from '../../../../scenery/js/input/HotkeyData.js';
import type { OneKeyStroke } from '../../../../scenery/js/input/KeyDescriptor.js';
import KeyboardListener, { KeyboardListenerOptions } from '../../../../scenery/js/listeners/KeyboardListener.js';
import sharedSoundPlayers from '../../../../tambo/js/sharedSoundPlayers.js';
import SoundClipPlayer from '../../../../tambo/js/sound-generators/SoundClipPlayer.js';
import generalBoundaryBoop_mp3 from '../../../../tambo/sounds/generalBoundaryBoop_mp3.js';
import quantumBoundStates from '../../quantumBoundStates.js';

// Same as the min and max sound defaults for Slider.
const MAX_SOUND_PLAYER = sharedSoundPlayers.get( 'generalBoundaryBoop' );
const MIN_SOUND_PLAYER = new SoundClipPlayer( generalBoundaryBoop_mp3, {
  soundClipOptions: {
    initialOutputLevel: 0.2,
    initialPlaybackRate: 1 / Math.pow( 2, 1 / 6 ) // a major second lower
  },
  soundManagerOptions: { categoryName: 'user-interface' }
} );

type SelfOptions = {
  homeCallback?: () => void;
  endCallback?: () => void;
};

type ParentOptions = KeyboardListenerOptions<OneKeyStroke[]>;

type HomeEndKeyboardListenerOptions = SelfOptions & PickRequired<ParentOptions, 'tandem'>;

export class HomeEndKeyboardListener extends KeyboardListener<OneKeyStroke[]> {

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

  private readonly valueProperty: TRangedProperty;
  private readonly homeCallback: () => void;
  private readonly endCallback: () => void;

  public constructor( valueProperty: TRangedProperty, providedOptions: HomeEndKeyboardListenerOptions ) {

    const options = optionize<HomeEndKeyboardListenerOptions, SelfOptions, ParentOptions>()( {

      // SelfOptions
      homeCallback: _.noop,
      endCallback: _.noop,

      // KeyboardListenerOptions
      keyStringProperties: HotkeyData.combineKeyStringProperties( [
        HomeEndKeyboardListener.HOME_HOTKEY_DATA,
        HomeEndKeyboardListener.END_HOTKEY_DATA
      ] ),

      fire: ( event, keysPressed, listener ) => {
        if ( keysPressed === 'home' ) {
          this.home();
        }
        else if ( keysPressed === 'end' ) {
          this.end();
        }
      }
    }, providedOptions );

    super( options );

    this.valueProperty = valueProperty;
    this.homeCallback = options.homeCallback;
    this.endCallback = options.endCallback;
  }

  /**
   * Handles the home key by setting valueProperty to its minimum and playing a sound.
   */
  private home(): void {
    this.valueProperty.value = this.valueProperty.range.min;
    MIN_SOUND_PLAYER.play();
    this.homeCallback();
  }

  /**
   * Handles the end key by setting valueProperty to its maximum and playing a sound.
   */
  private end(): void {
    this.valueProperty.value = this.valueProperty.range.max;
    MAX_SOUND_PLAYER.play();
    this.endCallback();
  }
}
