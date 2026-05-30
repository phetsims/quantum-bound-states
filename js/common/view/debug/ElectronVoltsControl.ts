// Copyright 2026, University of Colorado Boulder

/**
 * WellDepthControl is a control for setting the well depth.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import affirm from '../../../../../perennial-alias/js/browser-and-node/affirm.js';
import { combineOptions } from '../../../../../phet-core/js/optionize.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import QBSTime from '../../model/QBSTime.js';
import { electronVoltsUnit } from '../../model/units/electronVoltsUnit.js';
import QBSConstants from '../../QBSConstants.js';
import QBSNumberControl, { QBSNumberControlOptions } from '../QBSNumberControl.js';

export default class ElectronVoltsControl extends QBSNumberControl {

  public constructor( labelString: string, electronVoltsProperty: NumberProperty, decimalPlaces: number, time: QBSTime ) {

    affirm( electronVoltsProperty.units === electronVoltsUnit, 'electronVoltsProperty must have electronVoltsUnit' );

    super( labelString, electronVoltsProperty, time,
      combineOptions<QBSNumberControlOptions>( {}, QBSConstants.NUMBER_CONTROL_OPTIONS, {
        delta: Math.pow( 10, -decimalPlaces ),
        numberDisplayOptions: {
          numberFormatter: value => electronVoltsUnit.getVisualSymbolPatternString( value, {
            decimalPlaces: decimalPlaces,
            showTrailingZeros: true
          } )
        },
        sliderOptions: {
          majorTicks: QBSNumberControl.createMinMaxTicks( electronVoltsProperty.range, decimalPlaces )
        },
        tandem: Tandem.OPT_OUT
      } ) );
  }
}