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
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSColors from '../../common/QBSColors.js';
import QBSConstants from '../../common/QBSConstants.js';
import EnergyLevelControl from '../../common/view/EnergyLevelControl.js';
import GraphTypeRadioButtonGroup from '../../common/view/GraphTypeRadioButtonGroup.js';
import MassControl from '../../common/view/MassControl.js';
import WaveFunctionComponentsCheckboxGroup from '../../common/view/WaveFunctionComponentsCheckboxGroup.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import OneWellModel from '../model/OneWellModel.js';

export default class OneWellControlPanel extends Panel {

  public constructor( model: OneWellModel, tandem: Tandem ) {

    const options = combineOptions<PanelOptions>( {
      isDisposable: false,
      tandem: tandem
    }, QBSConstants.PANEL_OPTIONS );

    const propertiesText = new Text( QuantumBoundStatesFluent.propertiesStringProperty, {
      font: QBSConstants.TITLE_FONT,
      maxWidth: 200
    } );

    const energyLevelControl = new EnergyLevelControl( model.energyLevelProperty, model.energyLevelRangeProperty,
      tandem.createTandem( 'energyLevelControl' ) );

    const massControl = new MassControl( model.massProperty, tandem.createTandem( 'massControl' ) );

    const displayText = new Text( QuantumBoundStatesFluent.displayStringProperty, {
      font: QBSConstants.TITLE_FONT,
      maxWidth: 200
    } );

    const showValuesCheckbox = new Checkbox( model.valuesVisibleProperty,
      new Text( QuantumBoundStatesFluent.showValuesStringProperty, {
        font: QBSConstants.CONTROL_FONT,
        maxWidth: 150
      } ), combineOptions<CheckboxOptions>( {
        tandem: tandem.createTandem( 'showValuesCheckbox' )
      }, QBSConstants.CHECKBOX_OPTIONS ) );

    const graphTypeRadioButtonGroup = new GraphTypeRadioButtonGroup( model.graphTypeProperty, tandem.createTandem( 'graphTypeRadioButtonGroup' ) );

    const checkboxGroup = new WaveFunctionComponentsCheckboxGroup(
      model.realPartVisibleProperty,
      model.imaginaryPartVisibleProperty,
      model.magnitudeVisibleProperty,
      model.phaseVisibleProperty,
      {
        layoutOptions: {
          leftMargin: 25 // indent below graphTypeRadioButtonGroup
        },
        enabledProperty: new DerivedProperty( [ model.graphTypeProperty ], graphType => graphType === 'waveFunction' ),
        tandem: tandem.createTandem( 'checkboxGroup' )
      } );

    const content = new VBox( {
      align: 'left',
      spacing: 10,
      children: [
        propertiesText,
        energyLevelControl,
        massControl,
        new HSeparator( {
          stroke: QBSColors.separatorStrokeProperty
        } ),
        showValuesCheckbox,
        new HSeparator( {
          stroke: QBSColors.separatorStrokeProperty
        } ),
        displayText,
        graphTypeRadioButtonGroup,
        checkboxGroup
      ]
    } );

    super( content, options );
  }
}

quantumBoundStates.register( 'OneWellControlPanel', OneWellControlPanel );