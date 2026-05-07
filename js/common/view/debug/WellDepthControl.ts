// Copyright 2026, University of Colorado Boulder

/**
 * WellDepthControl is a control for setting the well depth.
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

const DECIMALS = QBSConstants.WELL_DEPTH_DECIMAL_PLACES;

export default class WellDepthControl extends QBSNumberControl {

  public constructor( wellDepthProperty: NumberProperty, time: QBSTime ) {

    super( 'wellDepthProperty', wellDepthProperty, time,
      combineOptions<QBSNumberControlOptions>( {}, QBSConstants.NUMBER_CONTROL_OPTIONS, {
        delta: Math.pow( 10, -DECIMALS ),
        numberDisplayOptions: {
          numberFormatter: value => electronVoltsUnit.getVisualSymbolPatternString( value, {
            decimalPlaces: DECIMALS,
            showTrailingZeros: true
          } )
        },
        sliderOptions: {
          majorTicks: WellWidthControl.createMinMaxTicks( wellDepthProperty.range, DECIMALS )
        },
        tandem: Tandem.OPT_OUT
      } ) );
  }
}