// Copyright 2026, University of Colorado Boulder

/**
 * SpacingControl is a control for setting the spacing between the centers of adjacent wells.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import { combineOptions } from '../../../../../phet-core/js/optionize.js';
import NumberControl, { NumberControlOptions } from '../../../../../scenery-phet/js/NumberControl.js';
import { nanometersUnit } from '../../../../../scenery-phet/js/units/nanometersUnit.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import QBSConstants from '../../QBSConstants.js';
import WellWidthControl from './WellWidthControl.js';

const DECIMALS = QBSConstants.SPACING_DECIMAL_PLACES;

export default class SpacingControl extends NumberControl {

  public constructor( spacingProperty: NumberProperty ) {

    super( 'Spacing', spacingProperty, spacingProperty.range,
      combineOptions<NumberControlOptions>( {}, QBSConstants.NUMBER_CONTROL_OPTIONS, {
        delta: Math.pow( 10, -DECIMALS ),
        numberDisplayOptions: {
          numberFormatter: value => nanometersUnit.getVisualSymbolPatternString( value, {
            decimalPlaces: DECIMALS,
            showTrailingZeros: true
          } )
        },
        sliderOptions: {
          majorTicks: WellWidthControl.createMinMaxTicks( spacingProperty.range, DECIMALS )
        },
        tandem: Tandem.OPT_OUT
      } ) );
  }
}