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

export default class TimeDisplay extends NumberDisplay {

  public constructor( time: QBSTime, tandem: Tandem ) {

    const backgroundFillProperty = time.timeVisibleProperty.derived(
      timeVisible => timeVisible ? QBSColors.timeDisplayEnabledFillProperty.value : QBSColors.timeDisplayDisabledFillProperty.value );

    // Hide the value by making it transparent.
    const textFillProperty = time.timeVisibleProperty.derived( timeVisible => timeVisible ? 'black' : 'transparent' );

    // For selecting the correct accessible paragraph via Fluent select_.
    const timeStateProperty = new DerivedStringProperty( [ time.timeVisibleProperty, time.isPlayingProperty ],
      ( timeVisible, isPlaying ) => !timeVisible ? 'isHidden' : isPlaying ? 'isPlaying' : 'isPaused' );

    const accessibleParagraphProperty = QuantumBoundStatesFluent.a11y.timeControls.numberDisplay.accessibleParagraph.createProperty( {
      timeState: timeStateProperty,
      time: time.currentTimeProperty.derived( currentTime => toFixed( currentTime, time.getDecimalPlaces() ) )
    } );

    // time.currentTimeProperty has no range. Use a large range to size the NumberDisplay.
    const timeRange = new Range( 0, 10000 );

    super( time.currentTimeProperty, timeRange, {
      isDisposable: false,
      textOptions: {
        font: QBSConstants.TIME_FONT,
        fill: textFillProperty
      },
      backgroundFill: backgroundFillProperty,
      numberFormatter: value => femtosecondsUnit.getVisualSymbolPatternString( value, {
        decimalPlaces: time.getDecimalPlaces(),
        showTrailingZeros: true
      } ),
      accessibleParagraph: accessibleParagraphProperty,
      tandem: tandem.createTandem( 'valueDisplay' )
    } );
  }
}
