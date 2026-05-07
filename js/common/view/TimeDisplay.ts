// Copyright 2026, University of Colorado Boulder

/**
 * TimeDisplay displays the current time, with a toggle button to show/hide the value.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Range from '../../../../dot/js/Range.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Time from '../model/Time.js';
import { femtosecondsUnit } from '../model/units/femtosecondsUnit.js';
import QBSColors from '../QBSColors.js';
import QBSConstants from '../QBSConstants.js';

export default class TimeDisplay extends NumberDisplay {

  public constructor( time: Time, tandem: Tandem ) {

    super( time.currentTimeProperty, new Range( 0, 10000 ), {
        textOptions: {
          font: QBSConstants.TIME_FONT,
          // Hide the value by making it transparent.
          fill: new DerivedProperty( [ time.timeVisibleProperty ], timeVisible => timeVisible ? 'black' : 'transparent' )
        },
        backgroundFill: new DerivedProperty( [ time.timeVisibleProperty ],
          timeVisible => timeVisible ? QBSColors.timeDisplayEnabledProperty.value : QBSColors.timeDisplayDisabledProperty.value ),
        numberFormatter: value => femtosecondsUnit.getVisualSymbolPatternString( value, {
          decimalPlaces: time.getDecimalPlaces(),
          showTrailingZeros: true
        } ),
        tandem: tandem.createTandem( 'valueDisplay' )
      }
    );
  }
}
