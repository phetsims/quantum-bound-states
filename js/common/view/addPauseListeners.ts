// Copyright 2026, University of Colorado Boulder

/**
 * addPauseListeners adds pointer and keyboard listeners to pause the sim while interacting with a UI component.
 * There is also an option to restart the time when interaction begins.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import { OneKeyStroke } from '../../../../scenery/js/input/KeyDescriptor.js';
import KeyboardListener from '../../../../scenery/js/listeners/KeyboardListener.js';
import PressListener from '../../../../scenery/js/listeners/PressListener.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import QBSTime from '../model/QBSTime.js';

type SelfOptions = {
  keys: OneKeyStroke[]; // The keys used to interacting with the UI component.
  restartTime?: boolean; // Whether to restart time when interaction begins.
};

type AddPauseListenersOptions = SelfOptions;

export function addPauseListeners( node: Node, time: QBSTime, providedOptions: AddPauseListenersOptions ): void {

  const options = optionize<AddPauseListenersOptions, SelfOptions>()( {

    // SelfOptions
    restartTime: true
  }, providedOptions );

  let wasPlaying = time.isPlayingProperty.value;

  const press = () => {
    wasPlaying = time.isPlayingProperty.value;
    time.isPlayingProperty.value = false;
    if ( options.restartTime ) {
      time.restart();
    }
  };

  const release = () => {
    time.isPlayingProperty.value = wasPlaying;
  };

  node.addInputListener( new PressListener( {
    attach: false,
    press: press,
    release: release
  } ) );

  node.addInputListener( new KeyboardListener( {
    keys: options.keys,
    press: press,
    release: release
  } ) );
}