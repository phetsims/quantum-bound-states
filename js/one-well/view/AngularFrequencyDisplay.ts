// Copyright 2026, University of Colorado Boulder

/**
 * AngularFrequencyDisplay is used to display the angular frequency of a Harmonic Oscillator potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import NumberDisplay, { NumberDisplayOptions } from '../../../../scenery-phet/js/NumberDisplay.js';
import { inverseFemtosecondsUnit } from '../../common/model/units/inverseFemtosecondsUnit.js';
import QBSConstants from '../../common/QBSConstants.js';

type SelfOptions = EmptySelfOptions;

type AngularFrequencyDisplayOptions = SelfOptions & PickRequired<NumberDisplayOptions, 'visibleProperty' | 'tandem'>;

export class AngularFrequencyDisplay extends NumberDisplay {

  public constructor( angularFrequencyProperty: TReadOnlyProperty<number>, providedOptions: AngularFrequencyDisplayOptions ) {

    const options = optionize<AngularFrequencyDisplayOptions, SelfOptions, NumberDisplayOptions>()( {
      textOptions: {
        font: QBSConstants.POTENTIAL_VALUE_FONT
      },
      useRichText: true,
      numberFormatter: angularFrequency => {
        //TODO Localize string pattern?
        return StringUtils.fillIn( 'ω = {{value}} {{units}}', ( {
          value: toFixed( angularFrequency, QBSConstants.ANGULAR_FREQUENCY ),
          units: inverseFemtosecondsUnit.visualSymbolStringProperty!.value
        } ) );
      },
      numberFormatterDependencies: [
        inverseFemtosecondsUnit.visualSymbolStringProperty!
      ]
      //TODO core description?
    }, providedOptions );

    super( angularFrequencyProperty, new Range( 0, 90 ), options );
  }
}