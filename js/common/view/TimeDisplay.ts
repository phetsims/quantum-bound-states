// Copyright 2026, University of Colorado Boulder

/**
 * TimeDisplay displays the current time.
 *
 * Note that this implementation does not use NumberDisplay because we could not find a suitable workaround for a
 * problem that is specific to this sim. When timeSpeedProperty changes, that changes the number of decimal places
 * in the time value, which results in the NumberDisplay resizing.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import { femtosecondsUnit } from '../../../../scenery-phet/js/units/femtosecondsUnit.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSTime from '../model/QBSTime.js';
import QBSColors from '../QBSColors.js';
import QBSConstants from '../QBSConstants.js';

const X_MARGIN = 8;
const Y_MARGIN = 2;
const TEXT_MAX_WIDTH = 80;
const DISPLAY_WIDTH = TEXT_MAX_WIDTH + 2 * X_MARGIN;
const DISPLAY_HEIGHT = new Text( 'X', { font: QBSConstants.TIME_FONT } ).height + 2 * Y_MARGIN;

export default class TimeDisplay extends Node {

  public constructor( time: QBSTime, tandem: Tandem ) {

    // Change the background fill based on whether the time value is visible.
    const backgroundFillProperty = time.timeVisibleProperty.derived(
      timeVisible => timeVisible ? QBSColors.timeDisplayEnabledFillProperty.value : QBSColors.timeDisplayDisabledFillProperty.value );

    const backgroundNode = new Rectangle( 0, 0, DISPLAY_WIDTH, DISPLAY_HEIGHT, {
      fill: backgroundFillProperty,
      stroke: 'lightGray'
    } );

    // Format the time value with the number of decimal places that matches the time speed.
    const timeStringProperty = new DerivedStringProperty( [ time.currentTimeProperty, time.timeSpeedProperty ],
      ( currentTime, timeSpeed ) => femtosecondsUnit.getVisualSymbolPatternString( currentTime, {
        decimalPlaces: time.getDecimalPlaces(),
        showTrailingZeros: true
      } ) );

    const text = new Text( timeStringProperty, {
      font: QBSConstants.TIME_FONT,
      maxWidth: TEXT_MAX_WIDTH,
      visibleProperty: time.timeVisibleProperty // Show/hide the time value.
    } );

    // Right-justify the time value.
    text.localBoundsProperty.link( () => {
      text.right = backgroundNode.right - X_MARGIN;
      text.bottom = backgroundNode.bottom - Y_MARGIN;
    } );

    const accessibleParagraphProperty = QuantumBoundStatesFluent.a11y.timeControls.numberDisplay.accessibleParagraph.createProperty( {
      // See select_timeState
      timeState: new DerivedStringProperty( [ time.timeVisibleProperty, time.isPlayingProperty ],
        ( timeVisible, isPlaying ) => !timeVisible ? 'isHidden' : isPlaying ? 'isPlaying' : 'isPaused' ),
      time: time.currentTimeProperty.derived( currentTime => toFixed( currentTime, time.getDecimalPlaces() ) )
    } );

    super( {
      children: [ backgroundNode, text ],
      accessibleParagraph: accessibleParagraphProperty,
      tandem: tandem.createTandem( 'valueDisplay' )
    } );
  }
}
