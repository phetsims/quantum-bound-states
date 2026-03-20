// Copyright 2026, University of Colorado Boulder

/**
 * TimeSpeedSlider changes the speed of the sim, making the sim run faster or slower.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import HSlider, { HSliderOptions } from '../../../../sun/js/HSlider.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSColors from '../QBSColors.js';

export default class TimeSpeedSlider extends HSlider {

  public constructor( timeScaleProperty: NumberProperty, tandem: Tandem ) {

    affirm( timeScaleProperty.validValues, 'timeScaleProperty must have validValues.' );
    const validValues = _.sortBy( timeScaleProperty.validValues );

    const range = new Range( validValues[ 0 ], validValues[ validValues.length - 1 ] );

    const options: HSliderOptions = {
      trackSize: new Dimension2( 75, 2 ),
      thumbSize: new Dimension2( 15, 25 ),
      thumbFill: QBSColors.timeSpeedSliderThumbFillProperty,
      thumbFillHighlighted: QBSColors.timeSpeedSliderThumbFillHighlightedProperty,
      majorTickLength: 15,
      constrainValue: value => findClosestValue( value, validValues ),
      tandem: tandem
    };

    super( timeScaleProperty, range, options );

    const tickTextOptions = {
      font: new PhetFont( 12 ),
      maxWidth: 50
    };

    // Add tick marks at each valid value, with the min and max ticks labeled.
    validValues.forEach( ( value, index ) => {
      if ( index === 0 ) {
        this.addMajorTick( value, new Text( QuantumBoundStatesFluent.slowStringProperty, tickTextOptions ) );
      }
      else if ( index === validValues.length - 1 ) {
        this.addMajorTick( value, new Text( QuantumBoundStatesFluent.fastStringProperty, tickTextOptions ) );
      }
      else {
        this.addMajorTick( value );
      }
    } );
  }
}

function findClosestValue( targetValue: number, validValues: number[] ): number {
  let closestValue = validValues[ 0 ];
  for ( let i = 1; i < validValues.length; i++ ) {
    const currentValue = validValues[ i ];
    if ( Math.abs( currentValue - targetValue ) <= Math.abs( closestValue - targetValue ) ) {
      closestValue = currentValue;
    }
  }
  return closestValue;
}
