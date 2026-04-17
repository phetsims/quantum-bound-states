// Copyright 2026, University of Colorado Boulder

/**
 * WellWidthControl is a control for setting the y-offset.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import { combineOptions } from '../../../../../phet-core/js/optionize.js';
import NumberControl, { NumberControlOptions } from '../../../../../scenery-phet/js/NumberControl.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import { electronVoltsUnit } from '../../model/units/electronVoltsUnit.js';
import QBSConstants from '../../QBSConstants.js';
import WellWidthControl from './WellWidthControl.js';

const DECIMALS = QBSConstants.Y_OFFSET_DECIMAL_PLACES;

export default class YOffsetControl extends NumberControl {

  public constructor( yOffsetProperty: NumberProperty ) {

    super( 'yOffsetProperty', yOffsetProperty, yOffsetProperty.range,
      combineOptions<NumberControlOptions>( {}, QBSConstants.NUMBER_CONTROL_OPTIONS, {
        delta: Math.pow( 10, -DECIMALS ),
        numberDisplayOptions: {
          numberFormatter: value => electronVoltsUnit.getVisualSymbolPatternString( value, {
            decimalPlaces: DECIMALS,
            showTrailingZeros: true
          } )
        },
        sliderOptions: {
          majorTicks: WellWidthControl.createMinMaxTicks( yOffsetProperty.range, DECIMALS )
        },
        tandem: Tandem.OPT_OUT
      } ) );
  }
}