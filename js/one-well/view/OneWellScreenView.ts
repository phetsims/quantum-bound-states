// Copyright 2025-2026, University of Colorado Boulder

/**
 * OneWellScreenView is the top-level view for the 'One Well' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import EnergyRangeShiftSpinner from '../../common/view/EnergyRangeShiftSpinner.js';
import QBSScreenView from '../../common/view/QBSScreenView.js';
import OneWellModel from '../model/OneWellModel.js';
import { OneWellControlPanel } from './OneWellControlPanel.js';
import OneWellScreenSummaryContent from './OneWellScreenSummaryContent.js';

export default class OneWellScreenView extends QBSScreenView {

  public constructor( model: OneWellModel, tandem: Tandem ) {

    const listboxParent = new Node();

    const energyDiagramControlPanel = new OneWellControlPanel( listboxParent, model.energyLevelProperty,
      model.electronMassesProperty, model.potentialProperty,
      tandem.createTandem( 'energyDiagramControlPanel' ) );

    super( model, listboxParent, energyDiagramControlPanel, {
      screenSummaryContent: new OneWellScreenSummaryContent(),
      tandem: tandem
    } );

    // Add a spinner to shift the y-axis range of the Energy Diagram for the selected potential.
    const energyRangeShiftSpinner = new EnergyRangeShiftSpinner( model.energyRangeShiftProperty,
      this.energyDiagramNode.tandem.createTandem( 'energyRangeShiftSpinner' ) );
    this.screenViewRootNode.addChild( energyRangeShiftSpinner );
    energyRangeShiftSpinner.right = this.energyDiagramRectangleBounds.left - 26;
    energyRangeShiftSpinner.bottom = this.energyDiagramRectangleBounds.bottom;
    this.pdomAddAfter( this.pdomPlayAreaNode, this.energyDiagramNode, energyRangeShiftSpinner );
  }
}
