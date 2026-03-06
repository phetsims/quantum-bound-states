// Copyright 2026, University of Colorado Boulder

/**
 * ElectricFieldControl controls the electric field.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import { toFixedNumber } from '../../../../dot/js/util/toFixedNumber.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import NumberControl, { NumberControlMajorTick, NumberControlOptions } from '../../../../scenery-phet/js/NumberControl.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import { voltsPerNanometer } from '../model/voltsPerNanometer.js';
import QBSConstants from '../QBSConstants.js';

export default class ElectricFieldControl extends NumberControl {

  public constructor( electricFieldProperty: NumberProperty, tandem: Tandem ) {

    const options = combineOptions<NumberControlOptions>( {}, QBSConstants.NUMBER_CONTROL_OPTIONS, {
      isDisposable: false,
      delta: 0.1,
      numberDisplayOptions: {
        numberFormatter: value => voltsPerNanometer.getVisualSymbolPatternString( value, {
          decimalPlaces: QBSConstants.ELECTRIC_FIELD_DECIMALS,
          showTrailingZeros: true
        } ),

        // Increase the size of the display to accommodate localized units.
        textOptions: {
          maxWidth: 70
        },
        minBackgroundWidth: 85
      },
      sliderOptions: {
        majorTicks: createMajorTicks( electricFieldProperty.range ),
        createAriaValueText: value => voltsPerNanometer.getAccessibleString( value, {
          decimalPlaces: QBSConstants.ELECTRIC_FIELD_DECIMALS,
          showTrailingZeros: false
        } ),
        keyboardStep: 0.1,
        shiftKeyboardStep: 0.1,
        pageKeyboardStep: 0.5
      },
      accessibleHelpText: QuantumBoundStatesFluent.a11y.electricFieldControl.accessibleHelpTextStringProperty,
      tandem: tandem
    } );

    const titleText = new Text( QuantumBoundStatesFluent.electricFieldStringProperty, {
      font: QBSConstants.CONTROL_FONT,
      maxWidth: 100
    } );

    super( titleText, electricFieldProperty, electricFieldProperty.range, options );
  }
}

/**
 * Creates major tick marks for the slider.
 */
function createMajorTicks( range: Range ): NumberControlMajorTick[] {

  const TICK_SPACING = 0.5;

  const tickTextOptions = {
    font: new PhetFont( 10 ),
    maxWidth: 50
  };

  const majorTicks: NumberControlMajorTick[] = [];
  let value = range.min;
  while ( value <= range.max ) {
    majorTicks.push( {
      value: toFixedNumber( value, QBSConstants.ELECTRIC_FIELD_DECIMALS ),
      label: new Text( value, tickTextOptions )
    } );
    value += TICK_SPACING;
  }

  return majorTicks;
}

quantumBoundStates.register( 'ElectricFieldControl', ElectricFieldControl );