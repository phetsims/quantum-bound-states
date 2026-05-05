// Copyright 2026, University of Colorado Boulder

/**
 * EnergyOffsetSpinner changes the energy offset (y-offset) of the selected potential and (as a side effect)
 * changes the range of the y-axis for the Energy Diagram.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import { roundToInterval } from '../../../../dot/js/util/roundToInterval.js';
import NumberSpinner from '../../../../sun/js/NumberSpinner.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSConstants from '../QBSConstants.js';

export default class EnergyOffsetSpinner extends NumberSpinner {

  public constructor( energyOffsetProperty: NumberProperty, tandem: Tandem ) {

    super( energyOffsetProperty, energyOffsetProperty.rangeProperty, {
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
      accessibleName: QuantumBoundStatesFluent.a11y.energyOffsetSpinner.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.energyOffsetSpinner.accessibleHelpTextStringProperty,
      tandem: tandem
    } );
  }
}