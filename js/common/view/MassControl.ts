// Copyright 2026, University of Colorado Boulder

/**
 * MassControl is the control for setting the mass.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import NumberControl, { NumberControlMajorTick, NumberControlOptions } from '../../../../scenery-phet/js/NumberControl.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import { electronMassesUnit } from '../model/electronMassesUnit.js';
import QBSConstants from '../QBSConstants.js';

export default class MassControl extends NumberControl {

  public constructor( electronMassesProperty: NumberProperty, tandem: Tandem ) {

    const options = combineOptions<NumberControlOptions>( {}, QBSConstants.NUMBER_CONTROL_OPTIONS, {
      isDisposable: false,
      delta: 0.01,
      numberDisplayOptions: {
        numberFormatter: value => electronMassesUnit.getVisualSymbolPatternString( value, {
          decimalPlaces: QBSConstants.ELECTRON_MASS_DECIMAL_PLACES,
          showTrailingZeros: true
        } ),
        textOptions: {
          maxWidth: 50
        },
        minBackgroundWidth: 50
      },
      sliderOptions: {
        majorTicks: createMajorTicks( electronMassesProperty.range ),
        createAriaValueText: value => electronMassesUnit.getAccessibleString( value, {
          decimalPlaces: QBSConstants.ELECTRON_MASS_DECIMAL_PLACES,
          showTrailingZeros: false
        } ),
        keyboardStep: 0.1,
        shiftKeyboardStep: 0.01,
        pageKeyboardStep: 0.1
      },
      accessibleHelpText: QuantumBoundStatesFluent.a11y.massControl.accessibleHelpTextStringProperty,
      tandem: tandem
    } );

    const titleText = new Text( QuantumBoundStatesFluent.massStringProperty, {
      font: QBSConstants.CONTROL_FONT,
      maxWidth: 100
    } );

    super( titleText, electronMassesProperty, electronMassesProperty.range, options );
  }
}

/**
 * Creates major tick marks for the slider.
 */
function createMajorTicks( range: Range ): NumberControlMajorTick[] {

  const minStringProperty = electronMassesUnit.getVisualSymbolPatternString( range.min, {
    decimalPlaces: QBSConstants.ELECTRON_MASS_DECIMAL_PLACES,
    showTrailingZeros: false
  } );

  const maxStringProperty = electronMassesUnit.getVisualSymbolPatternString( range.max, {
    decimalPlaces: QBSConstants.ELECTRON_MASS_DECIMAL_PLACES,
    showTrailingZeros: false
  } );

  const tickTextOptions = {
    font: new PhetFont( 10 ),
    maxWidth: 50
  };

  return [
    {
      value: range.min,
      label: new RichText( minStringProperty, tickTextOptions )
    },
    {
      value: range.max,
      label: new RichText( maxStringProperty, tickTextOptions )
    }
  ];
}

quantumBoundStates.register( 'MassControl', MassControl );