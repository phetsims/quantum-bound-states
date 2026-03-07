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
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { electronMassesUnit } from '../../common/model/units/electronMassesUnit.js';
import QBSConstants from '../../common/QBSConstants.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';

// These values are all related. Designers tend to request specific values and frequent changes.
// So use constant values rather than attempting to compute these.
const DELTA = 1;
const KEYBOARD_STEP = 1;
const SHIFT_KEYBOARD_STEP = 1;
const PAGE_KEYBOARD_STEP = 1;

export default class NumberOfWellsControl extends NumberControl {

  public constructor( numberOfWellsProperty: NumberProperty, tandem: Tandem ) {

    const options = combineOptions<NumberControlOptions>( {}, QBSConstants.NUMBER_CONTROL_OPTIONS, {
      isDisposable: false,
      delta: DELTA,
      sliderOptions: {
        majorTicks: createMajorTicks( numberOfWellsProperty.range ),
        minorTickSpacing: 1,
        createAriaValueText: value => electronMassesUnit.getAccessibleString( value, {
          decimalPlaces: QBSConstants.ELECTRON_MASS_DECIMAL_PLACES,
          showTrailingZeros: false
        } ),
        keyboardStep: KEYBOARD_STEP,
        shiftKeyboardStep: SHIFT_KEYBOARD_STEP,
        pageKeyboardStep: PAGE_KEYBOARD_STEP
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
 * Creates a major tick at min/max and specific intervals.
 */
function createMajorTicks( range: Range ): NumberControlMajorTick[] {

  const TICK_INTERVAL = 5;

  const majorTicks: NumberControlMajorTick[] = [];
  for ( let i = range.min; i <= range.max; i++ ) {
    if ( i === range.min || i === range.max || i % TICK_INTERVAL === 0 ) {
      majorTicks.push( {
        value: i,
        label: new Text( i, QBSConstants.TICK_TEXT_OPTIONS )
      } );
    }
  }

  return majorTicks;
}

quantumBoundStates.register( 'NumberOfWellsControl', NumberOfWellsControl );