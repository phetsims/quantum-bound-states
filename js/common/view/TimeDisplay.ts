// Copyright 2026, University of Colorado Boulder

/**
 * TimeDisplay displays the current time, with a toggle button to show/hide the value.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import { femtosecondsUnit } from '../model/femtosecondsUnit.js';
import QBSColors from '../QBSColors.js';
import QBSConstants from '../QBSConstants.js';

export default class TimeDisplay extends NumberDisplay {

  public constructor( currentTimeProperty: TReadOnlyProperty<number>,
                      timeVisibleProperty: TReadOnlyProperty<boolean>,
                      tandem: Tandem ) {

    super( currentTimeProperty, new Range( 0, 10000 ), {
        textOptions: {
          font: QBSConstants.TIME_FONT,
          // Hide the value by making it transparent.
          fill: new DerivedProperty( [ timeVisibleProperty ], timeVisible => timeVisible ? 'black' : 'transparent' )
        },
        backgroundFill: new DerivedProperty( [ timeVisibleProperty ],
          timeVisible => timeVisible ? QBSColors.timeDisplayEnabledProperty.value : QBSColors.timeDisplayDisabledProperty.value ),
        numberFormatter: value => femtosecondsUnit.getVisualSymbolPatternString( value, {
          decimalPlaces: QBSConstants.TIME_DECIMAL_PLACES,
          showTrailingZeros: true
        } ),
        tandem: tandem.createTandem( 'valueDisplay' )
      }
    );
  }
}

quantumBoundStates.register( 'TimeDisplay', TimeDisplay );