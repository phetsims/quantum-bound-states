// Copyright 2025-2026, University of Colorado Boulder

/**
 * ManyWellsScreenView is the top-level view for the 'Many Wells' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSScreenView from '../../common/view/QBSScreenView.js';
import ManyWellsModel from '../model/ManyWellsModel.js';
import { ManyWellsControlPanel } from './ManyWellsControlPanel.js';
import ManyWellsScreenSummaryContent from './ManyWellsScreenSummaryContent.js';
import ManyWellsZoomButtonGroup from './ManyWellsZoomButtonGroup.js';

export default class ManyWellsScreenView extends QBSScreenView {

  public constructor( model: ManyWellsModel, tandem: Tandem ) {

    const listboxParent = new Node();

    const energyDiagramControlPanel = new ManyWellsControlPanel(
      listboxParent,
      model.energyLevelProperty,
      model.numberOfWellsProperty,
      model.electricFieldProperty,
      model.potentialProperty,
      tandem.createTandem( 'energyDiagramControlPanel' ) );

    super( model, listboxParent, energyDiagramControlPanel, {
      screenSummaryContent: new ManyWellsScreenSummaryContent(),
      tandem: tandem
    } );

    // Create a zoom button group for the Energy Diagram's y-axis. Make it look like a child of the Energy Diagram
    // for PhET-iO. Put it in immediately after the Energy Diagram in the pdomOrder.
    const yAxisZoomButtonGroup = new ManyWellsZoomButtonGroup( model.yAxisZoomLevelProperty,
      this.energyDiagramNode.tandem.createTandem( 'yAxisZoomButtonGroup' ) );
    this.screenViewRootNode.addChild( yAxisZoomButtonGroup );
    if ( yAxisZoomButtonGroup ) {
      yAxisZoomButtonGroup.right = this.energyDiagramRectangleBounds.left - 20;
      yAxisZoomButtonGroup.bottom = this.energyDiagramRectangleBounds.bottom;
    }
    const playAreaPDOMOrder = this.pdomPlayAreaNode.getPDOMOrder();
    affirm( playAreaPDOMOrder !== null, 'playAreaPDOMOrder should be non-null' );
    playAreaPDOMOrder.splice( playAreaPDOMOrder.indexOf( this.energyDiagramNode ), 0, yAxisZoomButtonGroup );
    this.pdomPlayAreaNode.pdomOrder = playAreaPDOMOrder;
  }
}
