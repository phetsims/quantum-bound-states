// Copyright 2026, University of Colorado Boulder

/**
 * EnergyOffsetControl is the spinner for changing the energy offset of the selected potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import FineCoarseSpinner from '../../../../scenery-phet/js/FineCoarseSpinner.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSTime from '../../common/model/QBSTime.js';
import QBSConstants from '../../common/QBSConstants.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';

export default class EnergyOffsetControl extends VBox {

  public constructor( energyOffsetProperty: NumberProperty, time: QBSTime, tandem: Tandem ) {

    const energyOffsetText = new Text( QuantumBoundStatesFluent.energyOffsetStringProperty, {
      font: QBSConstants.CONTROL_FONT,
      maxWidth: 150
    } );

    const energyOffsetSpinner = new EnergyOffsetSpinner( energyOffsetProperty, time, tandem.createTandem( 'energyOffsetSpinner' ) );

    super( {
      isDisposable: false,
      children: [ energyOffsetText, energyOffsetSpinner ],
      align: 'left',
      spacing: 8,
      tandem: tandem
    } );
  }
}

class EnergyOffsetSpinner extends FineCoarseSpinner {

  public constructor( energyOffsetProperty: NumberProperty,
                      time: QBSTime,
                      tandem: Tandem ) {

    //TODO Restart and pause time

    super( energyOffsetProperty, {
      isDisposable: false,
      deltaFine: 0.1, // eV
      deltaCoarse: 1, // eV
      arrowButtonOptions: {
        phetioVisiblePropertyInstrumented: false
      },
      numberDisplayOptions: {
        decimalPlaces: QBSConstants.Y_OFFSET_DECIMAL_PLACES,
        minBackgroundWidth: 45, // to handle large values
        align: 'center',
        cornerRadius: 0,
        backgroundStroke: 'rgb( 200, 200, 200 )',
        textOptions: {
          font: QBSConstants.CONTROL_FONT,
          maxWidth: 120 // to handle large values
        }
      },
      accessibleName: QuantumBoundStatesFluent.a11y.energyOffsetSpinner.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.energyOffsetSpinner.accessibleHelpTextStringProperty,
      tandem: tandem,
      phetioVisiblePropertyInstrumented: false
    } );
  }
}