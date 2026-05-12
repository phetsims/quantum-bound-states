// Copyright 2025-2026, University of Colorado Boulder

/**
 * OneWellScreenView is the top-level view for the 'One Well' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSQueryParameters from '../../common/QBSQueryParameters.js';
import { PhaseColormapNode, phaseToRainbow, phaseToTwilight } from '../../common/view/PhaseColormapNode.js';
import QBSScreenView from '../../common/view/QBSScreenView.js';
import OneWellModel from '../model/OneWellModel.js';
import EnergyRangeShiftSpinner from './EnergyRangeShiftSpinner.js';
import { OneWellControlPanel } from './OneWellControlPanel.js';
import OneWellScreenSummaryContent from './OneWellScreenSummaryContent.js';

export default class OneWellScreenView extends QBSScreenView {

  public constructor( model: OneWellModel, tandem: Tandem ) {

    const listboxParent = new Node();

    const energyDiagramControlPanel = new OneWellControlPanel( listboxParent, model.potentialProperty,
      model.electronMassesProperty, model.selectedEnergyLevelProperty, model.time,
      tandem.createTandem( 'energyDiagramControlPanel' ) );

    super( model, listboxParent, energyDiagramControlPanel, {
      screenSummaryContent: new OneWellScreenSummaryContent(),
      tandem: tandem
    } );

    // Add a spinner to shift the y-axis range of the Energy Diagram for the selected potential.
    const energyRangeShiftSpinner = new EnergyRangeShiftSpinner( model.energyRangeShiftProperty,
      model.time, this.energyDiagramNode.tandem.createTandem( 'energyRangeShiftSpinner' ) );
    this.screenViewRootNode.addChild( energyRangeShiftSpinner );
    energyRangeShiftSpinner.right = this.energyDiagramRectangleBounds.left - 26;
    energyRangeShiftSpinner.bottom = this.energyDiagramRectangleBounds.bottom - 7;
    this.pdomOrderInsertAfter( this.pdomPlayAreaNode, this.energyDiagramNode, energyRangeShiftSpinner );

    //TODO Delete when a phase mapping has been chosen.
    if ( QBSQueryParameters.showPhaseSpectra ) {
      this.addChild( new VBox( {
        children: [
          new PhaseColormapNode( {
            phaseToColor: phaseToRainbow
          } ),
          new PhaseColormapNode( {
            phaseToColor: phaseToTwilight
          } )
        ],
        spacing: 20,
        align: 'center',
        centerX: this.layoutBounds.centerX,
        top: this.layoutBounds.top + 50
      } ) );
    }
  }
}
