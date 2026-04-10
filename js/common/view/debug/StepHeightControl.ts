// Copyright 2026, University of Colorado Boulder

/**
 * StepHeightControl is a control for setting the step height of an Infinite Step potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import { combineOptions } from '../../../../../phet-core/js/optionize.js';
import NumberControl, { NumberControlOptions } from '../../../../../scenery-phet/js/NumberControl.js';
import { electronVoltsUnit } from '../../model/units/electronVoltsUnit.js';
import QBSConstants from '../../QBSConstants.js';
import WellWidthControl from './WellWidthControl.js';

const DECIMALS = QBSConstants.STEP_HEIGHT_DECIMALS;

export default class StepHeightControl extends NumberControl {

  public constructor( stepHeightProperty: NumberProperty ) {

    super( 'Step Height', stepHeightProperty, stepHeightProperty.range,
      combineOptions<NumberControlOptions>( {}, QBSConstants.NUMBER_CONTROL_OPTIONS, {
        delta: Math.pow( 10, -DECIMALS ),
        numberDisplayOptions: {
          numberFormatter: value => electronVoltsUnit.getVisualSymbolPatternString( value, {
            decimalPlaces: DECIMALS,
            showTrailingZeros: true
          } )
        },
        sliderOptions: {
          majorTicks: WellWidthControl.createMinMaxTicks( stepHeightProperty.range, DECIMALS )
        }
      } ) );
  }
}