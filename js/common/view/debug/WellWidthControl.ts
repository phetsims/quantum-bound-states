// Copyright 2026, University of Colorado Boulder

/**
 * WellWidthControl is a control for setting the well width.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import Range from '../../../../../dot/js/Range.js';
import { toFixedNumber } from '../../../../../dot/js/util/toFixedNumber.js';
import { combineOptions } from '../../../../../phet-core/js/optionize.js';
import NumberControl, { NumberControlMajorTick, NumberControlOptions } from '../../../../../scenery-phet/js/NumberControl.js';
import { nanometersUnit } from '../../../../../scenery-phet/js/units/nanometersUnit.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import QBSConstants from '../../QBSConstants.js';

export default class WellWidthControl extends NumberControl {

  public constructor( wellWidthProperty: NumberProperty ) {

    super( 'Well Width', wellWidthProperty, wellWidthProperty.range,
      combineOptions<NumberControlOptions>( {}, QBSConstants.NUMBER_CONTROL_OPTIONS, {
        delta: Math.pow( 10, -QBSConstants.WELL_WIDTH_DECIMALS ),
        numberDisplayOptions: {
          numberFormatter: value => nanometersUnit.getVisualSymbolPatternString( value, {
            decimalPlaces: QBSConstants.WELL_WIDTH_DECIMALS,
            showTrailingZeros: true
          } )
        },
        sliderOptions: {
          majorTicks: WellWidthControl.createMinMaxTicks( wellWidthProperty.range, QBSConstants.WELL_WIDTH_DECIMALS )
        }
      } ) );
  }

  //TODO createMinMaxTicks belongs in a base class, because it is currently used in sibling classes.
  /**
   * Creates major tick marks for min and max values.
   */
  public static createMinMaxTicks( range: Range, decimals: number ): NumberControlMajorTick[] {
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
}