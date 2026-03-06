// Copyright 2026, University of Colorado Boulder

/**
 * NumberOfWellsControl sets the number of wells in a potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import NumberControl, { NumberControlMajorTick, NumberControlOptions } from '../../../../scenery-phet/js/NumberControl.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import { electronMassesUnit } from '../model/electronMassesUnit.js';
import QBSConstants from '../QBSConstants.js';

export default class NumberOfWellsControl extends NumberControl {

  public constructor( numberOfWellsProperty: NumberProperty, tandem: Tandem ) {

    const options = combineOptions<NumberControlOptions>( {}, QBSConstants.NUMBER_CONTROL_OPTIONS, {
      isDisposable: false,
      delta: 1,
      numberDisplayOptions: {
        textOptions: {
          maxWidth: 50
        },
        minBackgroundWidth: 30
      },
      sliderOptions: {
        majorTicks: createMajorTicks( numberOfWellsProperty.range ),
        createAriaValueText: value => electronMassesUnit.getAccessibleString( value, {
          decimalPlaces: QBSConstants.ELECTRON_MASS_DECIMAL_PLACES,
          showTrailingZeros: false
        } ),
        keyboardStep: 1,
        shiftKeyboardStep: 1,
        pageKeyboardStep: 1
      },
      accessibleHelpText: QuantumBoundStatesFluent.a11y.numberOfWellsControl.accessibleHelpTextStringProperty,
      tandem: tandem
    } );

    const titleText = new Text( QuantumBoundStatesFluent.numberOfWellsStringProperty, {
      font: QBSConstants.CONTROL_FONT,
      maxWidth: 150
    } );

    super( titleText, numberOfWellsProperty, numberOfWellsProperty.range, options );
  }
}

/**
 * Creates major tick marks for the slider.
 */
function createMajorTicks( range: Range ): NumberControlMajorTick[] {

  const TICK_SPACING = 5;

  const tickTextOptions = {
    font: new PhetFont( 10 ),
    maxWidth: 50
  };

  const majorTicks: NumberControlMajorTick[] = [];
  for ( let i = range.min; i <= range.max; i++ ) {
    if ( i === range.min || i === range.max || i % TICK_SPACING === 0 ) {
      majorTicks.push( {
        value: i,
        label: new Text( i, tickTextOptions )
      } );
    }
    else {
      majorTicks.push( {
        value: i
      } );
    }
  }

  return majorTicks;
}

quantumBoundStates.register( 'NumberOfWellsControl', NumberOfWellsControl );