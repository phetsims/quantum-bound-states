// Copyright 2026, University of Colorado Boulder

/**
 * EnergyRangeShiftSpinner shifts the range of the energy axis (y-axis) for the Energy Diagram.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import { roundToInterval } from '../../../../dot/js/util/roundToInterval.js';
import NumberSpinner from '../../../../sun/js/NumberSpinner.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSConstants from '../QBSConstants.js';

const FIRE_ON_HOLD_INTERVAL = 25; // ms

export default class EnergyRangeShiftSpinner extends NumberSpinner {

  public constructor( energyRangeShiftProperty: NumberProperty, tandem: Tandem ) {

    super( energyRangeShiftProperty, energyRangeShiftProperty.rangeProperty, {
      arrowsScale: 1.5,
      deltaValue: QBSConstants.Y_OFFSET_INTERVAL, // eV
      constrainValue: value => roundToInterval( value, QBSConstants.Y_OFFSET_INTERVAL ),
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
      accessibleName: QuantumBoundStatesFluent.a11y.energyRangeShiftSpinner.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.energyRangeShiftSpinner.accessibleHelpTextStringProperty,
      tandem: tandem
    } );
  }
}