// Copyright 2026, University of Colorado Boulder

/**
 * WellWidthControl is a control for setting the well depth. This is for debugging purposes, and not part of the
 * public UI. There is no support for localization, alt input, core description, or PhET-iO.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import NumberControl, { NumberControlOptions } from '../../../../scenery-phet/js/NumberControl.js';
import { nanometersUnit } from '../../../../scenery-phet/js/units/nanometersUnit.js';
import QBSConstants from '../QBSConstants.js';
import WellWidthControl from './WellWidthControl.js';

export default class WellDepthControl extends NumberControl {

  public constructor( wellDepthProperty: NumberProperty ) {

    super( 'Well Depth', wellDepthProperty, wellDepthProperty.range,
      combineOptions<NumberControlOptions>( {}, QBSConstants.NUMBER_CONTROL_OPTIONS, {
        delta: Math.pow( 10, -QBSConstants.WELL_DEPTH_DECIMALS ),
        numberDisplayOptions: {
          numberFormatter: value => nanometersUnit.getVisualSymbolPatternString( value, {
            decimalPlaces: QBSConstants.WELL_DEPTH_DECIMALS,
            showTrailingZeros: true
          } )
        },
        sliderOptions: {
          majorTicks: WellWidthControl.createMinMaxTicks( wellDepthProperty.range, QBSConstants.WELL_DEPTH_DECIMALS )
        }
      } ) );
  }
}