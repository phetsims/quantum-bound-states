// Copyright 2025, University of Colorado Boulder

/**
 * QBSKeyboardHelpContent is the content for the keyboard-help dialog in all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import quantumBoundStates from '../../quantumBoundStates.js';

export default class QBSKeyboardHelpContent extends TwoColumnKeyboardHelpContent {

  public constructor() {

    // Sections in the left column.
    const leftSections: KeyboardHelpSection[] = [
      //TODO
    ];

    // Sections in the right column.
    const rightSections: KeyboardHelpSection[] = [

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

quantumBoundStates.register( 'QBSKeyboardHelpContent', QBSKeyboardHelpContent );