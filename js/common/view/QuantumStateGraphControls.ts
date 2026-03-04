// Copyright 2026, University of Colorado Boulder

/**
 * QuantumStateGraphControls is a subpanel that contains controls related to the Quantum State graph - the graph
 * shown below the Energy diagram.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QuantumStateGraph from '../model/QuantumStateGraph.js';
import WaveFunctionGraph from '../model/WaveFunctionGraph.js';
import QBSConstants from '../QBSConstants.js';
import QuantumStateGraphRadioButtonGroup from './QuantumStateGraphRadioButtonGroup.js';
import WaveFunctionPartsCheckboxGroup from './WaveFunctionPartsCheckboxGroup.js';

export default class QuantumStateGraphControls extends VBox {

  public constructor( selectedGraphProperty: Property<QuantumStateGraph>,
                      waveFunctionGraph: WaveFunctionGraph,
                      tandem: Tandem ) {

    const titleText = new Text( QuantumBoundStatesFluent.quantumStateGraphStringProperty, {
      font: QBSConstants.TITLE_FONT,
      maxWidth: 200,
      tandem: tandem.createTandem( 'titleText' ),
      phetioVisiblePropertyInstrumented: true,
      visiblePropertyOptions: { phetioFeatured: true }
    } );

    const quantumStateGraphRadioButtonGroup = new QuantumStateGraphRadioButtonGroup( selectedGraphProperty,
      tandem.createTandem( 'quantumStateGraphRadioButtonGroup' ) );

    const waveFunctionPartsCheckboxGroup = new WaveFunctionPartsCheckboxGroup( waveFunctionGraph, {
      layoutOptions: {
        leftMargin: 25 // indent below graphTypeRadioButtonGroup
      },
      enabledProperty: new DerivedProperty( [ selectedGraphProperty ], selectedGraph => selectedGraph === waveFunctionGraph ),
      tandem: tandem.createTandem( 'waveFunctionPartsCheckboxGroup' )
    } );

    super( {
      align: 'left',
      spacing: 10,
      children: [
        titleText,
        quantumStateGraphRadioButtonGroup,
        waveFunctionPartsCheckboxGroup
      ]
    } );
  }
}

quantumBoundStates.register( 'QuantumStateGraphControls', QuantumStateGraphControls );