// Copyright 2026, University of Colorado Boulder

/**
 * EnergyRangeShiftSpinner shifts the range of the energy axis (y-axis) for the Energy Diagram.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import { roundToInterval } from '../../../../dot/js/util/roundToInterval.js';
import NumberSpinner from '../../../../sun/js/NumberSpinner.js';
import nullSoundPlayer from '../../../../tambo/js/nullSoundPlayer.js';
import ValueChangeSoundPlayer from '../../../../tambo/js/sound-generators/ValueChangeSoundPlayer.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSTime from '../../common/model/QBSTime.js';
import QBSConstants from '../../common/QBSConstants.js';
import { addPauseListeners } from '../../common/view/addPauseListeners.js';

const DELTA_VALUE = QBSConstants.Y_OFFSET_INTERVAL;
const FIRE_ON_HOLD_INTERVAL = 25; // ms

export default class EnergyRangeShiftSpinner extends NumberSpinner {

  public constructor( energyRangeShiftProperty: NumberProperty, time: QBSTime, tandem: Tandem ) {

    // NumberSpinner unfortunately plays a sound every time the value is changed, which is too often with our
    // relatively short value for FIRE_ON_HOLD_INTERVAL. Use a ValueChangeSoundPlayer so that we have control
    // over how often sound is played.
    const soundPlayer = new ValueChangeSoundPlayer( energyRangeShiftProperty.rangeProperty, {
      minimumInterMiddleSoundTime: 0.1 // seconds
    } );

    super( energyRangeShiftProperty, energyRangeShiftProperty.rangeProperty, {
      arrowsScale: 1.5,
      deltaValue: DELTA_VALUE, // eV
      constrainValue: value => roundToInterval( value, DELTA_VALUE ),
      numberDisplayOptions: {
        // Hide the value
        visible: false,
        // Prevent the value from being formatted, which would cause the NumberDisplay size to change.
        numberFormatter: value => '',
        tandem: Tandem.OPT_OUT
      },
      pdomTimerInterval: FIRE_ON_HOLD_INTERVAL, // for keyboard input
      arrowButtonOptions: {
        fireOnHoldInterval: FIRE_ON_HOLD_INTERVAL,
        phetioVisiblePropertyInstrumented: false
      },

      // ValueChangeSoundPlayer is unfortunately not actually a sound player; it does not implement TSoundPlayer.
      // So use nullSoundPlayer to suppress the default sound. Also unfortunately, this means that we must take
      // control of incrementFunction and decrementFunction, which is our only hook to playing sound.
      arrowsSoundPlayer: nullSoundPlayer,
      incrementFunction: oldValue => {
        const newValue = oldValue + DELTA_VALUE;
        soundPlayer.playSoundForValueChange( newValue, oldValue );
        return newValue;
      },
      decrementFunction: oldValue => {
        const newValue = oldValue - DELTA_VALUE;
        soundPlayer.playSoundForValueChange( newValue, oldValue );
        return newValue;
      },

      accessibleName: QuantumBoundStatesFluent.a11y.energyRangeShiftSpinner.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.energyRangeShiftSpinner.accessibleHelpTextStringProperty,
      tandem: tandem
    } );

    addPauseListeners( this, time, {
      //TODO keys relies on internal knowledge of NumberSpinner
      keys: [
        'arrowLeft', 'arrowRight', 'arrowUp', 'arrowDown',
        'shift+arrowLeft', 'shift+arrowRight', 'shift+arrowUp', 'shift+arrowDown',
        'home', 'end'
      ]
    } );
  }
}