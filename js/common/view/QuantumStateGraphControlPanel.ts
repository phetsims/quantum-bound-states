// Copyright 2026, University of Colorado Boulder

/**
 * QuantumStateGraphControlPanel contains controls related what is shown in the Quantum State graph - the graph below
 * the Energy diagram.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import ProbabilityDensityGraph from '../model/ProbabilityDensityGraph.js';
import QuantumStateGraph from '../model/QuantumStateGraph.js';
import WaveFunctionGraph from '../model/WaveFunctionGraph.js';
import QBSConstants from '../QBSConstants.js';
import QuantumStateGraphRadioButtonGroup from './QuantumStateGraphRadioButtonGroup.js';
import WaveFunctionPartsCheckboxGroup from './WaveFunctionPartsCheckboxGroup.js';

export default class QuantumStateGraphControlPanel extends Panel {

  public static readonly FIXED_WIDTH = 235;

  public constructor( selectedGraphProperty: Property<QuantumStateGraph>,
                      probabilityDensityGraph: ProbabilityDensityGraph,
                      waveFunctionGraph: WaveFunctionGraph,
                      tandem: Tandem ) {

    const quantumStateGraphText = new Text( QuantumBoundStatesFluent.quantumStateGraphStringProperty, {
      font: QBSConstants.TITLE_FONT,
      maxWidth: 200,
      tandem: tandem.createTandem( 'quantumStateGraphText' ),
      phetioVisiblePropertyInstrumented: true,
      visiblePropertyOptions: { phetioFeatured: true }
    } );

    const quantumStateGraphRadioButtonGroup = new QuantumStateGraphRadioButtonGroup( selectedGraphProperty,
      probabilityDensityGraph, waveFunctionGraph, tandem.createTandem( 'quantumStateGraphRadioButtonGroup' ) );

    const waveFunctionPartsCheckboxGroup = new WaveFunctionPartsCheckboxGroup( waveFunctionGraph, {
      layoutOptions: {
        leftMargin: 25 // indent below quantumStateGraphRadioButtonGroup
      },
      checkboxesEnabledProperty: selectedGraphProperty.derived( selectedGraph => selectedGraph === waveFunctionGraph ),
      tandem: tandem.createTandem( 'waveFunctionPartsCheckboxGroup' )
    } );

    const content = new VBox( {
      align: 'left',
      spacing: 10,
      children: [
        quantumStateGraphText,
        quantumStateGraphRadioButtonGroup,
        waveFunctionPartsCheckboxGroup
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
