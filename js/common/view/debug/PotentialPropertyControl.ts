// Copyright 2026, University of Colorado Boulder

/**
 * PotentialPropertyControl is a NumberControl for configuring some Property of a quantum potential.
 * It is for development purposes only and does NOT support core PhET features (localization, dynamic layout,
 * alt input, core description, PhET-iO, etc.)
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import Range from '../../../../../dot/js/Range.js';
import { toFixedNumber } from '../../../../../dot/js/util/toFixedNumber.js';
import affirm from '../../../../../perennial-alias/js/browser-and-node/affirm.js';
import { combineOptions } from '../../../../../phet-core/js/optionize.js';
import { NumberControlMajorTick } from '../../../../../scenery-phet/js/NumberControl.js';
import PhetUnit from '../../../../../scenery-phet/js/PhetUnit.js';
import { nanometersUnit } from '../../../../../scenery-phet/js/units/nanometersUnit.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import QBSTime from '../../model/QBSTime.js';
import QBSConstants from '../../QBSConstants.js';
import QBSNumberControl, { QBSNumberControlOptions } from '../QBSNumberControl.js';

export default class PotentialPropertyControl extends QBSNumberControl {

  public constructor( labelString: string, potentialProperty: NumberProperty, decimalPlaces: number, time: QBSTime ) {

    const units = potentialProperty.units;
    affirm( units instanceof PhetUnit, 'nanometersProperty must have PhetUnit' );

    super( labelString, potentialProperty, time,
      combineOptions<QBSNumberControlOptions>( {}, QBSConstants.NUMBER_CONTROL_OPTIONS, {
        delta: Math.pow( 10, -decimalPlaces ),
        numberDisplayOptions: {
          numberFormatter: value => nanometersUnit.getVisualSymbolPatternString( value, {
            decimalPlaces: decimalPlaces,
            showTrailingZeros: true
          } )
        },
        sliderOptions: {
          majorTicks: createMinMaxTicks( potentialProperty.range, decimalPlaces )
        },
        tandem: Tandem.OPT_OUT
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