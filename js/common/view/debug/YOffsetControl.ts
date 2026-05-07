// Copyright 2026, University of Colorado Boulder

/**
 * YOffsetControl is a control for setting the y-offset.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import { combineOptions } from '../../../../../phet-core/js/optionize.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import QBSTime from '../../model/QBSTime.js';
import { electronVoltsUnit } from '../../model/units/electronVoltsUnit.js';
import QBSConstants from '../../QBSConstants.js';
import QBSNumberControl, { QBSNumberControlOptions } from '../QBSNumberControl.js';
import WellWidthControl from './WellWidthControl.js';

const DECIMALS = QBSConstants.Y_OFFSET_DECIMAL_PLACES;

export default class YOffsetControl extends QBSNumberControl {

  public constructor( yOffsetProperty: NumberProperty, time: QBSTime ) {

    super( 'yOffsetProperty', yOffsetProperty, time,
      combineOptions<QBSNumberControlOptions>( {}, QBSConstants.NUMBER_CONTROL_OPTIONS, {
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