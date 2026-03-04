// Copyright 2026, University of Colorado Boulder

/**
 * OneWellControlPanel is the main control panel for the 'One Well' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { combineOptions } from '../../../../phet-core/js/optionize.js';
import HSeparator from '../../../../scenery/js/layout/nodes/HSeparator.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSColors from '../../common/QBSColors.js';
import QBSConstants from '../../common/QBSConstants.js';
import QuantumStateGraphControls from '../../common/view/QuantumStateGraphControls.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import OneWellModel from '../model/OneWellModel.js';
import { OneWellEnergyDiagramControls } from './OneWellEnergyDiagramControls.js';

export default class OneWellControlPanel extends Panel {

  public constructor( model: OneWellModel, tandem: Tandem ) {

    const options = combineOptions<PanelOptions>( {
      isDisposable: false,
      accessibleHeading: QuantumBoundStatesFluent.a11y.controlPanel.accessibleHeadingStringProperty,
      tandem: tandem
    }, QBSConstants.PANEL_OPTIONS );

    // Controls related to the Energy diagram
    const energyDiagramControls = new OneWellEnergyDiagramControls( model.energyLevelProperty, model.electronMassesProperty,
      model.energyDiagram.valueLabelsVisibleProperty, tandem.createTandem( 'energyDiagramControls' ) );

    // Controls related to the Quantum State graph
    const quantumStateGraphControls = new QuantumStateGraphControls( model.selectedGraphProperty, model.waveFunctionGraph,
      tandem.createTandem( 'quantumStateGraphControls' ) );

    const content = new VBox( {
      align: 'left',
      spacing: 10,
      children: [
        energyDiagramControls,
        new HSeparator( { stroke: QBSColors.separatorStrokeProperty } ),
        quantumStateGraphControls
      ]
    } );

    super( content, options );
  }
}

quantumBoundStates.register( 'OneWellControlPanel', OneWellControlPanel );