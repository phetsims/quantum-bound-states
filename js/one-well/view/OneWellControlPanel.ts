// Copyright 2026, University of Colorado Boulder

/**
 * OneWellControlPanel is the main control panel for the 'One Well' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import HSeparator from '../../../../scenery/js/layout/nodes/HSeparator.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSColors from '../../common/QBSColors.js';
import QBSConstants from '../../common/QBSConstants.js';
import EnergyLevelControl from '../../common/view/EnergyLevelControl.js';
import MassControl from '../../common/view/MassControl.js';
import QuantumStateGraphRadioButtonGroup from '../../common/view/QuantumStateGraphRadioButtonGroup.js';
import ValueLabelsCheckbox from '../../common/view/ValueLabelsCheckbox.js';
import WaveFunctionPartsCheckboxGroup from '../../common/view/WaveFunctionPartsCheckboxGroup.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import OneWellModel from '../model/OneWellModel.js';

export default class OneWellControlPanel extends Panel {

  public constructor( model: OneWellModel, tandem: Tandem ) {

    const options = combineOptions<PanelOptions>( {
      isDisposable: false,
      accessibleHeading: QuantumBoundStatesFluent.a11y.controlPanel.accessibleHeadingStringProperty,
      tandem: tandem
    }, QBSConstants.PANEL_OPTIONS );

    const propertiesText = new Text( QuantumBoundStatesFluent.propertiesStringProperty, {
      font: QBSConstants.TITLE_FONT,
      maxWidth: 200
    } );

    const energyLevelControl = new EnergyLevelControl( model.energyLevelProperty, tandem.createTandem( 'energyLevelControl' ) );

    const massControl = new MassControl( model.electronMassesProperty, tandem.createTandem( 'massControl' ) );

    const valueLabelsCheckbox = new ValueLabelsCheckbox( model.energyDiagram.valueLabelsVisibleProperty,
      tandem.createTandem( 'valueLabelsCheckbox' ) );

    const titleText = new Text( QuantumBoundStatesFluent.displayStringProperty, {
      font: QBSConstants.TITLE_FONT,
      maxWidth: 200,
      tandem: tandem.createTandem( 'titleText' ),
      phetioVisiblePropertyInstrumented: true,
      visiblePropertyOptions: { phetioFeatured: true }
    } );

    const quantumStateGraphRadioButtonGroup = new QuantumStateGraphRadioButtonGroup( model.selectedGraphProperty,
      tandem.createTandem( 'quantumStateGraphRadioButtonGroup' ) );

    const waveFunctionPartsCheckboxGroup = new WaveFunctionPartsCheckboxGroup( model.waveFunctionGraph, {
      layoutOptions: {
        leftMargin: 25 // indent below graphTypeRadioButtonGroup
      },
      enabledProperty: new DerivedProperty( [ model.selectedGraphProperty ], selectedGraph => selectedGraph === model.waveFunctionGraph ),
      tandem: tandem.createTandem( 'waveFunctionPartsCheckboxGroup' )
    } );

    const content = new VBox( {
      align: 'left',
      spacing: 10,
      children: [
        propertiesText,
        energyLevelControl,
        massControl,
        valueLabelsCheckbox,
        new HSeparator( {
          stroke: QBSColors.separatorStrokeProperty
        } ),
        titleText,
        quantumStateGraphRadioButtonGroup,
        waveFunctionPartsCheckboxGroup
      ]
    } );

    super( content, options );
  }
}

quantumBoundStates.register( 'OneWellControlPanel', OneWellControlPanel );