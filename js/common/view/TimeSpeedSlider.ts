// Copyright 2026, University of Colorado Boulder

/**
 * TimeSpeedSlider changes the speed of the sim, making the sim run faster or slower.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import { toFixedNumber } from '../../../../dot/js/util/toFixedNumber.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import HSlider, { HSliderOptions } from '../../../../sun/js/HSlider.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSColors from '../QBSColors.js';

const TICK_TEXT_OPTIONS = {
  font: new PhetFont( 12 ),
  maxWidth: 50
};

export default class TimeSpeedSlider extends HSlider {

  public constructor( timeSpeedProperty: NumberProperty, tandem: Tandem ) {

    const options: HSliderOptions = {
      isDisposable: false,
      trackSize: new Dimension2( 75, 2 ),
      thumbSize: new Dimension2( 15, 25 ),
      thumbFill: QBSColors.timeSpeedSliderThumbFillProperty,
      thumbFillHighlighted: QBSColors.timeSpeedSliderThumbHighlightFillProperty,
      majorTickLength: 15,
      constrainValue: value => toFixedNumber( value, 0 ),
      accessibleName: QuantumBoundStatesFluent.a11y.timeSpeedSlider.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.timeSpeedSlider.accessibleHelpTextStringProperty,
      tandem: tandem
    };

    const range = timeSpeedProperty.range;

    super( timeSpeedProperty, range, options );

    // Add tick marks at each valid value, with the min and max ticks labeled 'Slow' and 'Fast' respectively.
    const validValues = timeSpeedProperty.validValues;
    affirm( validValues, 'timeSpeedProperty must have validValues' );
    validValues.forEach( value => {
      if ( value === range.min ) {
        this.addMajorTick( value, new Text( QuantumBoundStatesFluent.slowestStringProperty, TICK_TEXT_OPTIONS ) );
      }
      else if ( value === range.max ) {
        this.addMajorTick( value, new Text( QuantumBoundStatesFluent.fastestStringProperty, TICK_TEXT_OPTIONS ) );
      }
      else {
        this.addMajorTick( value );
      }
    } );
  }
}