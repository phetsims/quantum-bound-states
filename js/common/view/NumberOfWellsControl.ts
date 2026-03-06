// Copyright 2026, University of Colorado Boulder

/**
 * NumberOfWellsControl sets the number of wells in a potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import NumberControl, { NumberControlMajorTick } from '../../../../scenery-phet/js/NumberControl.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import { electronMassesUnit } from '../model/electronMassesUnit.js';
import QBSConstants from '../QBSConstants.js';

const TICK_SPACING = 5;

export default class NumberOfWellsControl extends NumberControl {

  public constructor( numberOfWellsProperty: NumberProperty, tandem: Tandem ) {

    const titleText = new Text( QuantumBoundStatesFluent.numberOfWellsStringProperty, {
      font: QBSConstants.CONTROL_FONT,
      maxWidth: 150
    } );

    super( titleText, numberOfWellsProperty, numberOfWellsProperty.range, {
      isDisposable: false,
      delta: 1,
      layoutFunction: NumberControl.createLayoutFunction1( {
        align: 'left',
        arrowButtonsXSpacing: 5
      } ),
      numberDisplayOptions: {
        textOptions: {
          maxWidth: 50
        },
        minBackgroundWidth: 30
      },
      sliderOptions: {
        trackSize: new Dimension2( 135, 3 ),
        thumbSize: new Dimension2( 15, 25 ),
        majorTicks: createMajorTicks( numberOfWellsProperty.range ),
        majorTickLength: 16,
        keyboardStep: 0.1,
        shiftKeyboardStep: 0.01,
        pageKeyboardStep: 0.2,
        createAriaValueText: value => electronMassesUnit.getAccessibleString( value, {
          decimalPlaces: QBSConstants.ELECTRON_MASS_DECIMAL_PLACES,
          showTrailingZeros: false
        } )
      },
      accessibleHelpText: QuantumBoundStatesFluent.a11y.numberOfWellsControl.accessibleHelpTextStringProperty,
      tandem: tandem
    } );
  }
}

/**
 * Creates slider tick marks at the extremes of the range.
 */
function createMajorTicks( range: Range ): NumberControlMajorTick[] {

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