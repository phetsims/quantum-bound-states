// Copyright 2026, University of Colorado Boulder

/**
 * QuantumStateGraphControlPanel contains controls related what is shown in the Quantum State graph - the graph below
 * the Energy diagram.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QuantumStateGraph from '../model/QuantumStateGraph.js';
import WavefunctionGraph from '../model/WavefunctionGraph.js';
import QBSConstants from '../QBSConstants.js';
import QuantumStateGraphRadioButtonGroup from './QuantumStateGraphRadioButtonGroup.js';
import WavefunctionPartsCheckboxGroup from './WavefunctionPartsCheckboxGroup.js';

export default class QuantumStateGraphControlPanel extends Panel {

  public static readonly FIXED_WIDTH = 235;

  public constructor( selectedGraphProperty: Property<QuantumStateGraph>,
                      wavefunctionGraph: WavefunctionGraph,
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

    const wavefunctionPartsCheckboxGroup = new WavefunctionPartsCheckboxGroup( wavefunctionGraph, {
      layoutOptions: {
        leftMargin: 25 // indent below quantumStateGraphRadioButtonGroup
      },
      enabledProperty: new DerivedProperty( [ selectedGraphProperty ], selectedGraph => selectedGraph === wavefunctionGraph ),
      tandem: tandem.createTandem( 'wavefunctionPartsCheckboxGroup' )
    } );

    const content = new VBox( {
      align: 'left',
      spacing: 10,
      children: [
        titleText,
        quantumStateGraphRadioButtonGroup,
        wavefunctionPartsCheckboxGroup
      ]
    } );

    const options = combineOptions<PanelOptions>( {}, QBSConstants.PANEL_OPTIONS, {
      isDisposable: false,
      minWidth: QuantumStateGraphControlPanel.FIXED_WIDTH,
      maxWidth: QuantumStateGraphControlPanel.FIXED_WIDTH,
      accessibleHeading: QuantumBoundStatesFluent.a11y.quantumStateGraphControls.accessibleHeadingStringProperty,
      tandem: tandem
    } );

    super( content, options );
  }
}
