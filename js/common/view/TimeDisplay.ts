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
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import EyeToggleButton from '../../../../scenery-phet/js/buttons/EyeToggleButton.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSColors from '../QBSColors.js';
import QBSConstants from '../QBSConstants.js';

export default class TimeDisplay extends HBox {

  public constructor( currentTimeProperty: TReadOnlyProperty<number>, tandem: Tandem ) {

    const timeDisplayTandem = tandem.createTandem( 'timeDisplay' );

    const visibleProperty = new BooleanProperty( true, {
      tandem: timeDisplayTandem.createTandem( 'visibleProperty' ),
      phetioReadOnly: true // because this is controlled by toggleButton
    } );

    const valueDisplay = new NumberDisplay( currentTimeProperty, new Range( 0, 1000 ), {
      textOptions: {
        font: QBSConstants.TIME_FONT,
        // Hide the value by making it transparent.
        fill: new DerivedProperty( [ visibleProperty ], visible => visible ? 'black' : 'transparent' )
      },
      numberFormatter: value => StringUtils.fillIn( QuantumBoundStatesFluent.units.femtoSeconds.symbolPatternStringProperty, {
        // Use toFixed so that trailing zeros are preserved.
        value: toFixed( value, QBSConstants.TIME_DECIMAL_PLACES )
      } ),
      tandem: timeDisplayTandem
    } );

    const toggleButton = new EyeToggleButton( visibleProperty, {
      scale: 0.4,
      baseColor: new DerivedProperty(
        [ visibleProperty, QBSColors.timeShownColorProperty, QBSColors.timeHiddenColorProperty ],
        ( visible, timeShownColor, timeHiddenColor ) => visible ? timeShownColor : timeHiddenColor ),
      accessibleNameOn: QuantumBoundStatesFluent.a11y.timeDisplayToggleButton.accessibleNameOnStringProperty,
      accessibleNameOff: QuantumBoundStatesFluent.a11y.timeDisplayToggleButton.accessibleNameOffStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.timeDisplayToggleButton.accessibleHelpTextStringProperty,
      accessibleContextResponseOn: QuantumBoundStatesFluent.a11y.timeDisplayToggleButton.accessibleContextResponseOnStringProperty,
      accessibleContextResponseOff: QuantumBoundStatesFluent.a11y.timeDisplayToggleButton.accessibleContextResponseOffStringProperty,
      tandem: tandem.createTandem( 'toggleButton' )
    } );

    super( {
      children: [ toggleButton, valueDisplay ],
      spacing: 3,
      tandem: tandem,
      phetioVisiblePropertyInstrumented: true
    } );
  }
}

quantumBoundStates.register( 'TimeDisplay', TimeDisplay );