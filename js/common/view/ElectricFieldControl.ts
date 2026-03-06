// Copyright 2026, University of Colorado Boulder

/**
 * ElectricFieldControl controls the electric field.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import { toFixedNumber } from '../../../../dot/js/util/toFixedNumber.js';
import NumberControl, { NumberControlMajorTick } from '../../../../scenery-phet/js/NumberControl.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import { voltsPerNanometer } from '../model/voltsPerNanometer.js';
import QBSConstants from '../QBSConstants.js';

export default class ElectricFieldControl extends NumberControl {

  public constructor( electricFieldProperty: NumberProperty, tandem: Tandem ) {

    const titleText = new Text( QuantumBoundStatesFluent.electricFieldStringProperty, {
      font: QBSConstants.CONTROL_FONT,
      maxWidth: 100
    } );

    super( titleText, electricFieldProperty, electricFieldProperty.range, {
      isDisposable: false,
      delta: Math.pow( 10, -QBSConstants.ELECTRIC_FIELD_DECIMALS ),
      layoutFunction: NumberControl.createLayoutFunction1( {
        align: 'left',
        arrowButtonsXSpacing: 5
      } ),
      numberDisplayOptions: {
        numberFormatter: value => voltsPerNanometer.getVisualSymbolPatternString( value, {
          decimalPlaces: QBSConstants.ELECTRIC_FIELD_DECIMALS,
          showTrailingZeros: true
        } ),
        useRichText: true,
        textOptions: {
          maxWidth: 50
        },
        minBackgroundWidth: 55
      },
      sliderOptions: {
        trackSize: new Dimension2( 135, 3 ),
        thumbSize: new Dimension2( 15, 25 ),
        majorTicks: createMajorTicks( electricFieldProperty.range ),
        majorTickLength: 13,
        keyboardStep: 0.1,
        shiftKeyboardStep: 0.01,
        pageKeyboardStep: 0.2,
        createAriaValueText: value => voltsPerNanometer.getAccessibleString( value, {
          decimalPlaces: QBSConstants.ELECTRIC_FIELD_DECIMALS,
          showTrailingZeros: false
        } )
      },
      accessibleHelpText: QuantumBoundStatesFluent.a11y.electricFieldControl.accessibleHelpTextStringProperty,
      tandem: tandem
    } );
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