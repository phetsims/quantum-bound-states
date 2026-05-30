// Copyright 2026, University of Colorado Boulder

/**
 * NanometersControl is a control for some Property whose units are in nanometers.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import affirm from '../../../../../perennial-alias/js/browser-and-node/affirm.js';
import { combineOptions } from '../../../../../phet-core/js/optionize.js';
import { nanometersUnit } from '../../../../../scenery-phet/js/units/nanometersUnit.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import QBSTime from '../../model/QBSTime.js';
import QBSConstants from '../../QBSConstants.js';
import QBSNumberControl, { QBSNumberControlOptions } from '../QBSNumberControl.js';

export default class NanometersControl extends QBSNumberControl {

  public constructor( labelString: string, nanometersProperty: NumberProperty, decimalPlaces: number, time: QBSTime ) {

    affirm( nanometersProperty.units === nanometersUnit, 'nanometersProperty must have nanometersUnit' );

    super( labelString, nanometersProperty, time,
      combineOptions<QBSNumberControlOptions>( {}, QBSConstants.NUMBER_CONTROL_OPTIONS, {
        delta: Math.pow( 10, -decimalPlaces ),
        numberDisplayOptions: {
          numberFormatter: value => nanometersUnit.getVisualSymbolPatternString( value, {
            decimalPlaces: decimalPlaces,
            showTrailingZeros: true
          } )
        },
        sliderOptions: {
          majorTicks: QBSNumberControl.createMinMaxTicks( nanometersProperty.range, decimalPlaces )
        },
        tandem: Tandem.OPT_OUT
      } ) );
  }
}