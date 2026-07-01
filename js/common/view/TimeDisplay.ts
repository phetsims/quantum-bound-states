// Copyright 2026, University of Colorado Boulder

/**
 * TimeDisplay displays the current time, with a toggle button to show/hide the value.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import Range from '../../../../dot/js/Range.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import { femtosecondsUnit } from '../../../../scenery-phet/js/units/femtosecondsUnit.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSTime from '../model/QBSTime.js';
import QBSColors from '../QBSColors.js';
import QBSConstants from '../QBSConstants.js';

// This range typically determines the width of the display. If you make this larger, you may need to adjust
// options.minBackgroundWidth. To test: pause the sim, step through all time speeds, and see if the time display resizes.
const TIME_RANGE = new Range( 0, 100000 );

export default class TimeDisplay extends NumberDisplay {

  public constructor( time: QBSTime, tandem: Tandem ) {

    const backgroundFillProperty = time.timeVisibleProperty.derived(
      timeVisible => timeVisible ? QBSColors.timeDisplayEnabledFillProperty.value : QBSColors.timeDisplayDisabledFillProperty.value );

    // For selecting the correct accessible paragraph via Fluent select_.
    const timeStateProperty = new DerivedStringProperty( [ time.timeVisibleProperty, time.isPlayingProperty ],
      ( timeVisible, isPlaying ) => !timeVisible ? 'isHidden' : isPlaying ? 'isPlaying' : 'isPaused' );

    const accessibleParagraphProperty = QuantumBoundStatesFluent.a11y.timeControls.numberDisplay.accessibleParagraph.createProperty( {
      timeState: timeStateProperty,
      time: time.currentTimeProperty.derived( currentTime => toFixed( currentTime, time.getDecimalPlaces() ) )
    } );

    super( time.currentTimeProperty, TIME_RANGE, {
      isDisposable: false,
      textOptions: {
        visibleProperty: time.timeVisibleProperty, // Hide the time value.
        font: QBSConstants.TIME_FONT
      },
      backgroundFill: backgroundFillProperty,
      numberFormatter: value => femtosecondsUnit.getVisualSymbolPatternString( value, {
        decimalPlaces: time.getDecimalPlaces(),
        showTrailingZeros: true
      } ),

      // Display correct number of decimal places for timeSpeedProperty.
      numberFormatterDependencies: [ time.timeSpeedProperty ],

      // Caution! minBackgroundWidth must be large enough to prevent resizing when timeSpeedProperty changes.
      minBackgroundWidth: 130,
      accessibleParagraph: accessibleParagraphProperty,
      tandem: tandem.createTandem( 'valueDisplay' )
    } );
  }
}
