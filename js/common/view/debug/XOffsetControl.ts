// Copyright 2026, University of Colorado Boulder

/**
 * XOffsetControl is a control for setting the x-offset.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import { combineOptions } from '../../../../../phet-core/js/optionize.js';
import { nanometersUnit } from '../../../../../scenery-phet/js/units/nanometersUnit.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import QBSTime from '../../model/QBSTime.js';
import QBSConstants from '../../QBSConstants.js';
import QBSNumberControl, { QBSNumberControlOptions } from '../QBSNumberControl.js';
import WellWidthControl from './WellWidthControl.js';

const DECIMALS = QBSConstants.X_OFFSET_DECIMAL_PLACES;

export default class XOffsetControl extends QBSNumberControl {

  public constructor( xOffsetProperty: NumberProperty, time: QBSTime ) {

    super( 'xOffsetProperty', xOffsetProperty, time,
      combineOptions<QBSNumberControlOptions>( {}, QBSConstants.NUMBER_CONTROL_OPTIONS, {
        delta: Math.pow( 10, -DECIMALS ),
        numberDisplayOptions: {
          numberFormatter: value => nanometersUnit.getVisualSymbolPatternString( value, {
            decimalPlaces: DECIMALS,
            showTrailingZeros: true
          } )
        },
        sliderOptions: {
          majorTicks: WellWidthControl.createMinMaxTicks( xOffsetProperty.range, DECIMALS )
        },
        tandem: Tandem.OPT_OUT
      } ) );
  }
}