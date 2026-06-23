// Copyright 2026, University of Colorado Boulder

/**
 * NumberOfWellsControl sets the number of wells in a potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import { NumberControlMajorTick } from '../../../../scenery-phet/js/NumberControl.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSTime from '../../common/model/QBSTime.js';
import QBSConstants from '../../common/QBSConstants.js';
import QBSNumberControl, { QBSNumberControlOptions } from '../../common/view/QBSNumberControl.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';

// These values are all related. Designers tend to request specific values and frequent changes.
// So use constant values rather than attempting to compute these.
const DELTA = 1;
const KEYBOARD_STEP = 1;
const SHIFT_KEYBOARD_STEP = 1;
const PAGE_KEYBOARD_STEP = 1;

export default class NumberOfWellsControl extends QBSNumberControl {

  public constructor( numberOfWellsProperty: NumberProperty, time: QBSTime, tandem: Tandem ) {

    const options = combineOptions<QBSNumberControlOptions>( {}, QBSConstants.NUMBER_CONTROL_OPTIONS, {
      isDisposable: false,
      delta: DELTA,
      sliderOptions: {
        majorTicks: createMajorTicks( numberOfWellsProperty.range ),
        minorTickSpacing: 1,
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

    super( titleText, numberOfWellsProperty, time, options );
  }
}

/**
 * Creates major ticks for this control.
 */
function createMajorTicks( range: Range ): NumberControlMajorTick[] {
  const majorTickValues = [ range.min, range.max ];
  return majorTickValues.map( value => {
    return {
      value: value,
      label: new Text( value, QBSConstants.TICK_TEXT_OPTIONS )
    };
  } );
}
