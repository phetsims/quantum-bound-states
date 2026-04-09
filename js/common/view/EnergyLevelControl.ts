// Copyright 2026, University of Colorado Boulder

/**
 * EnergyLevelControl is the spinner for selecting the energy level.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import NumberSpinner from '../../../../sun/js/NumberSpinner.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSConstants from '../QBSConstants.js';

export default class EnergyLevelControl extends HBox {

  public constructor( energyLevelProperty: NumberProperty, tandem: Tandem ) {

    const energyLevelText = new Text( QuantumBoundStatesFluent.energyLevelStringProperty, {
      font: QBSConstants.CONTROL_FONT,
      maxWidth: 100
    } );

    const energyLevelSpinner = new EnergyLevelSpinner( energyLevelProperty, energyLevelProperty.rangeProperty,
      tandem.createTandem( 'energyLevelSpinner' ) );

    super( {
      isDisposable: false,
      children: [ energyLevelText, energyLevelSpinner ],
      spacing: 8,
      tandem: tandem
    } );
  }
}

class EnergyLevelSpinner extends NumberSpinner {

  public constructor( energyLevelProperty: Property<number>,
                      rangeProperty: TReadOnlyProperty<Range>,
                      tandem: Tandem ) {

    super( energyLevelProperty, rangeProperty, {
      arrowsScale: 2,
      numberDisplayOptions: {
        minBackgroundWidth: 40, // Energy level index may be large, so provide extra space, determined empirically.
        align: 'center',
        cornerRadius: 0,
        backgroundStroke: 'rgb( 200, 200, 200 )',
        textOptions: {
          font: QBSConstants.CONTROL_FONT
        },
        useRichText: true,
        numberFormatter: value => StringUtils.fillIn( QuantumBoundStatesFluent.energyLevelPatternStringProperty, {
          index: value
        } )
      },
      accessibleName: QuantumBoundStatesFluent.a11y.energyLevelSpinner.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.energyLevelSpinner.accessibleHelpTextStringProperty,
      tandem: tandem
    } );
  }
}
