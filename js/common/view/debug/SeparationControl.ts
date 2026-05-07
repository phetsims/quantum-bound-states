// Copyright 2026, University of Colorado Boulder

/**
 * SeparationControl is a control for setting the separation between the centers of adjacent wells.
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

const DECIMALS = QBSConstants.SEPARATION_DECIMAL_PLACES;

export default class SeparationControl extends QBSNumberControl {

  public constructor( separationProperty: NumberProperty, time: QBSTime ) {

    super( 'separationProperty', separationProperty, time,
      combineOptions<QBSNumberControlOptions>( {}, QBSConstants.NUMBER_CONTROL_OPTIONS, {
        delta: Math.pow( 10, -DECIMALS ),
        numberDisplayOptions: {
          numberFormatter: value => nanometersUnit.getVisualSymbolPatternString( value, {
            decimalPlaces: DECIMALS,
            showTrailingZeros: true
          } )
        },
        sliderOptions: {
          majorTicks: WellWidthControl.createMinMaxTicks( separationProperty.range, DECIMALS )
        },
        tandem: Tandem.OPT_OUT
      } ) );
  }
}