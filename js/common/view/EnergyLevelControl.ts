// Copyright 2026, University of Colorado Boulder

/**
 * EnergyLevelControl is the spinner for selecting the energy level.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import NumberSpinner from '../../../../sun/js/NumberSpinner.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSTime from '../model/QBSTime.js';
import QBSConstants from '../QBSConstants.js';
import { addPauseListeners } from './addPauseListeners.js';

export default class EnergyLevelControl extends HBox {

  public constructor( energyLevelIndexProperty: NumberProperty, time: QBSTime, tandem: Tandem ) {

    const energyLevelText = new Text( QuantumBoundStatesFluent.energyLevelStringProperty, {
      font: QBSConstants.CONTROL_FONT,
      maxWidth: 150
    } );

    const energyLevelSpinner = new EnergyLevelSpinner( energyLevelIndexProperty, time, tandem.createTandem( 'energyLevelSpinner' ) );

    super( {
      isDisposable: false,
      children: [ energyLevelText, energyLevelSpinner ],
      spacing: 8,
      tandem: tandem
    } );
  }
}

class EnergyLevelSpinner extends NumberSpinner {

  public constructor( energyLevelIndexProperty: NumberProperty,
                      time: QBSTime,
                      tandem: Tandem ) {

    super( energyLevelIndexProperty, energyLevelIndexProperty.rangeProperty, {
      isDisposable: false,
      arrowsPosition: 'leftRight',
      arrowsScale: 1,
      arrowButtonOptions: {
        phetioVisiblePropertyInstrumented: false
      },
      numberDisplayOptions: {
        minBackgroundWidth: 45, // to handle large E subscripts, e.g. 'E<sub>100</sub>'
        align: 'center',
        cornerRadius: 0,
        backgroundStroke: 'rgb( 200, 200, 200 )',
        textOptions: {
          font: QBSConstants.CONTROL_FONT,
          maxWidth: 120 // to handle large E subscripts, e.g. 'E<sub>100</sub>'
        },
        useRichText: true,
        numberFormatter: value => StringUtils.fillIn( QuantumBoundStatesFluent.energyLevelPatternStringProperty, {
          index: value
        } )
      },
      accessibleName: QuantumBoundStatesFluent.a11y.energyLevelSpinner.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.energyLevelSpinner.accessibleHelpTextStringProperty,
      tandem: tandem,
      phetioVisiblePropertyInstrumented: false
    } );

    // Restart time and pause while the user is interacting with this spinner.
    addPauseListeners( this, time, {
      //TODO keys relies on internal knowledge of NumberSpinner
      keys: [
        'arrowLeft', 'arrowRight', 'arrowUp', 'arrowDown',
        'home', 'end'
      ]
    } );
  }
}
