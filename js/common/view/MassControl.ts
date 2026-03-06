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
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import { electronMassesUnit } from '../model/electronMassesUnit.js';
import QBSConstants from '../QBSConstants.js';

// These values are all related. Designers tend to request specific values and frequent changes.
// So use constant values rather than attempting to compute these.
const DELTA = 0.01;
const KEYBOARD_STEP = 0.1;
const SHIFT_KEYBOARD_STEP = 0.01;
const PAGE_KEYBOARD_STEP = 0.1;

export default class MassControl extends NumberControl {

  public constructor( electronMassesProperty: NumberProperty, tandem: Tandem ) {

    const options = combineOptions<NumberControlOptions>( {}, QBSConstants.NUMBER_CONTROL_OPTIONS, {
      isDisposable: false,
      delta: DELTA,
      numberDisplayOptions: {
        numberFormatter: value => electronMassesUnit.getVisualSymbolPatternString( value, {
          decimalPlaces: QBSConstants.ELECTRON_MASS_DECIMAL_PLACES,
          showTrailingZeros: true
        } ),

        // To accommodate subscript in the units.
        useRichText: true,

        // Increase the size of the display to accommodate localized units.
        textOptions: {
          maxWidth: 50
        },
        minBackgroundWidth: 65
      },
      sliderOptions: {
        majorTicks: createMajorTicks( electronMassesProperty.range ),
        minorTickSpacing: 0.1,
        createAriaValueText: value => electronMassesUnit.getAccessibleString( value, {
          decimalPlaces: QBSConstants.ELECTRON_MASS_DECIMAL_PLACES,
          showTrailingZeros: false
        } ),
        keyboardStep: KEYBOARD_STEP,
        shiftKeyboardStep: SHIFT_KEYBOARD_STEP,
        pageKeyboardStep: PAGE_KEYBOARD_STEP
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
 * Creates major tick marks at min and max.
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

  return [
    {
      value: range.min,
      label: new RichText( minStringProperty, QBSConstants.TICK_TEXT_OPTIONS )
    },
    {
      value: range.max,
      label: new RichText( maxStringProperty, QBSConstants.TICK_TEXT_OPTIONS )
    }
  ];
}

quantumBoundStates.register( 'MassControl', MassControl );