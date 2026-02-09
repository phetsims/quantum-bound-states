// Copyright 2026, University of Colorado Boulder

/**
 * MassControl is the control for setting the mass.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import { toFixedNumber } from '../../../../dot/js/util/toFixedNumber.js';
import NumberControl, { NumberControlMajorTick } from '../../../../scenery-phet/js/NumberControl.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import { electronMassesUnit } from '../model/electronMassesUnit.js';
import QBSConstants from '../QBSConstants.js';

export default class MassControl extends NumberControl {

  public constructor( massProperty: NumberProperty, tandem: Tandem ) {

    const titleText = new Text( QuantumBoundStatesFluent.massStringProperty, {
      font: QBSConstants.CONTROL_FONT,
      maxWidth: 100
    } );

    super( titleText, massProperty, massProperty.range, {
      isDisposable: false,
      delta: 0.01,
      layoutFunction: NumberControl.createLayoutFunction1( {
        align: 'left',
        arrowButtonsXSpacing: 5
      } ),
      numberDisplayOptions: {
        numberFormatter: value => electronMassesUnit.getVisualSymbolPatternString(
          //TODO Use toFixed so that trailing zeros are preserved.
          toFixedNumber( value, QBSConstants.ELECTRON_MASS_DECIMAL_PLACES ) ),
        useRichText: true,
        textOptions: {
          maxWidth: 50
        },
        minBackgroundWidth: 50
      },
      sliderOptions: {
        trackSize: new Dimension2( 135, 3 ),
        thumbSize: new Dimension2( 15, 25 ),
        majorTicks: createMajorTicks( massProperty.range ),
        majorTickLength: 16,
        keyboardStep: 0.1,
        shiftKeyboardStep: 0.01,
        pageKeyboardStep: 0.2,
        createAriaValueText: value => electronMassesUnit.getAccessibleString(
          // Use toFixedNumber so that trailing zeros are removed.
          toFixedNumber( value, QBSConstants.ELECTRON_MASS_DECIMAL_PLACES ) )
      },
      accessibleHelpText: QuantumBoundStatesFluent.a11y.massControl.accessibleHelpTextStringProperty,
      tandem: tandem
    } );
  }
}

/**
 * Creates slider tick marks at the extremes of the range.
 */
function createMajorTicks( range: Range ): NumberControlMajorTick[] {

  const minStringProperty = electronMassesUnit.getVisualSymbolPatternString(
    // Use toFixedNumber so that trailing zeros are removed.
    toFixedNumber( range.min, QBSConstants.ELECTRON_MASS_DECIMAL_PLACES ) );

  const maxStringProperty = electronMassesUnit.getVisualSymbolPatternString(
    // Use toFixedNumber so that trailing zeros are removed.
    toFixedNumber( range.max, QBSConstants.ELECTRON_MASS_DECIMAL_PLACES ) );

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