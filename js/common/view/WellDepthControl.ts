// Copyright 2026, University of Colorado Boulder

/**
 * WellWidthControl is a control for setting the well depth.
 * This is for debugging purposes, and not part of the public UI.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import { toFixedNumber } from '../../../../dot/js/util/toFixedNumber.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import NumberControl, { NumberControlMajorTick, NumberControlOptions } from '../../../../scenery-phet/js/NumberControl.js';
import { nanometersUnit } from '../../../../scenery-phet/js/units/nanometersUnit.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import QBSConstants from '../QBSConstants.js';

// These values are all related. Designers tend to request specific values and frequent changes.
// So use constant values rather than attempting to compute these.
const DELTA = 0.1;
const KEYBOARD_STEP = 0.1;
const SHIFT_KEYBOARD_STEP = 0.1;
const PAGE_KEYBOARD_STEP = 0.5;

export default class WellDepthControl extends NumberControl {

  public constructor( wellDepthProperty: NumberProperty ) {

    super( 'Well Depth', wellDepthProperty, wellDepthProperty.range,
      combineOptions<NumberControlOptions>( {}, QBSConstants.NUMBER_CONTROL_OPTIONS, {
        delta: DELTA,
        numberDisplayOptions: {
          numberFormatter: value => nanometersUnit.getVisualSymbolPatternString( value, {
            decimalPlaces: QBSConstants.WELL_DEPTH_DECIMALS,
            showTrailingZeros: true
          } )
        },
        sliderOptions: {
          majorTicks: createMinMaxTicks( wellDepthProperty.range, QBSConstants.WELL_DEPTH_DECIMALS ),
          keyboardStep: KEYBOARD_STEP,
          shiftKeyboardStep: SHIFT_KEYBOARD_STEP,
          pageKeyboardStep: PAGE_KEYBOARD_STEP
        }
      } ) );
  }
}

/**
 * Creates major tick marks for min and max values.
 */
function createMinMaxTicks( range: Range, decimals: number ): NumberControlMajorTick[] {
  return [
    {
      value: toFixedNumber( range.min, decimals ),
      label: new Text( range.min, QBSConstants.TICK_TEXT_OPTIONS )
    },
    {
      value: toFixedNumber( range.max, decimals ),
      label: new Text( range.max, QBSConstants.TICK_TEXT_OPTIONS )
    }
  ];
}