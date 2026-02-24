// Copyright 2026, University of Colorado Boulder

/**
 * TimeDisplay displays the current time, with a toggle button to show/hide the value.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import { femtosecondsUnit } from '../model/femtosecondsUnit.js';
import QBSColors from '../QBSColors.js';
import QBSConstants from '../QBSConstants.js';
import TimeToggleButton from './TimeToggleButton.js';

export default class TimeDisplay extends HBox {

  public constructor( currentTimeProperty: TReadOnlyProperty<number>, tandem: Tandem ) {

    const timeVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'timeVisibleProperty' ),
      phetioReadOnly: true // because this is controlled by toggleButton
    } );

    const valueDisplay = new NumberDisplay( currentTimeProperty, new Range( 0, 10000 ), {
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
    } );

    const toggleButton = new TimeToggleButton( timeVisibleProperty, tandem.createTandem( 'toggleButton' ) );

    super( {
      children: [ toggleButton, valueDisplay ],
      spacing: 3,
      tandem: tandem,
      phetioVisiblePropertyInstrumented: true
    } );
  }
}

quantumBoundStates.register( 'TimeDisplay', TimeDisplay );