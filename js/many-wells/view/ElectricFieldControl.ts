// Copyright 2026, University of Colorado Boulder

/**
 * ElectricFieldControl controls the electric field.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import { toFixedNumber } from '../../../../dot/js/util/toFixedNumber.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import NumberControl, { NumberControlMajorTick, NumberControlOptions } from '../../../../scenery-phet/js/NumberControl.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { voltsPerNanometer } from '../../common/model/units/voltsPerNanometer.js';
import QBSConstants from '../../common/QBSConstants.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';

// These values are all related. Designers tend to request specific values and frequent changes.
// So use constant values rather than attempting to compute these.
const DELTA = 0.1;
const KEYBOARD_STEP = 0.1;
const SHIFT_KEYBOARD_STEP = 0.1;
const PAGE_KEYBOARD_STEP = 0.5;

export default class ElectricFieldControl extends NumberControl {

  public constructor( electricFieldProperty: NumberProperty, tandem: Tandem ) {

    const options = combineOptions<NumberControlOptions>( {}, QBSConstants.NUMBER_CONTROL_OPTIONS, {
      isDisposable: false,
      delta: DELTA,
      numberDisplayOptions: {

        // Add units to the displayed value.
        numberFormatter: value => voltsPerNanometer.getVisualSymbolPatternString( value, {
          decimalPlaces: QBSConstants.ELECTRIC_FIELD_DECIMALS,
          showTrailingZeros: true
        } ),

        // Increase the size of the display to accommodate localized units.
        textOptions: {
          maxWidth: 70
        },
        minBackgroundWidth: 85
      },
      sliderOptions: {
        majorTicks: createMajorTicks( electricFieldProperty.range ),
        minorTickSpacing: 0.5,
        createAriaValueText: value => voltsPerNanometer.getAccessibleString( value, {
          decimalPlaces: QBSConstants.ELECTRIC_FIELD_DECIMALS,
          showTrailingZeros: false
        } ),
        keyboardStep: KEYBOARD_STEP,
        shiftKeyboardStep: SHIFT_KEYBOARD_STEP,
        pageKeyboardStep: PAGE_KEYBOARD_STEP
      },
      accessibleHelpText: QuantumBoundStatesFluent.a11y.electricFieldControl.accessibleHelpTextStringProperty,
      tandem: tandem
    } );

    const titleText = new Text( QuantumBoundStatesFluent.electricFieldStringProperty, {
      font: QBSConstants.CONTROL_FONT,
      maxWidth: 100
    } );

    super( titleText, electricFieldProperty, electricFieldProperty.range, options );
  }
}

/**
 * Creates major tick marks at specific intervals.
 */
function createMajorTicks( range: Range ): NumberControlMajorTick[] {

  const TICK_SPACING = 1;

  const majorTicks: NumberControlMajorTick[] = [];
  let value = range.min;
  while ( value <= range.max ) {
    majorTicks.push( {
      value: toFixedNumber( value, QBSConstants.ELECTRIC_FIELD_DECIMALS ),
      label: new Text( value, QBSConstants.TICK_TEXT_OPTIONS )
    } );
    value += TICK_SPACING;
  }

  return majorTicks;
}
