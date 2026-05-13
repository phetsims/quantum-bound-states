// Copyright 2025-2026, University of Colorado Boulder

/**
 * OneWellScreenView is the top-level view for the 'One Well' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSColors from '../../common/QBSColors.js';
import QBSScreenView from '../../common/view/QBSScreenView.js';
import OneWellModel from '../model/OneWellModel.js';
import EnergyOffsetHandleNode from './EnergyOffsetHandleNode.js';
import { OneWellControlPanel } from './OneWellControlPanel.js';
import OneWellScreenSummaryContent from './OneWellScreenSummaryContent.js';

export default class OneWellScreenView extends QBSScreenView {

  public constructor( model: OneWellModel, tandem: Tandem ) {

    const listboxParent = new Node();

    const energyDiagramControlPanel = new OneWellControlPanel( listboxParent, model.potentialProperty,
      model.electronMassesProperty, model.selectedEnergyLevelProperty, model.energyOffsetDragHandleVisibleProperty,
      model.time, tandem.createTandem( 'energyDiagramControlPanel' ) );

    super( model, listboxParent, energyDiagramControlPanel, {
      screenSummaryContent: new OneWellScreenSummaryContent(),
      tandem: tandem
    } );

    // Layer for drag handles used to configure potentials.
    //TODO https://github.com/phetsims/quantum-bound-states/issues/39 Make this a child of EnergyDiagramNode and resolve coordinate-transform problems.
    const handlesLayer = new Node( {
      tandem: tandem.createTandem( 'handlesLayer' ),
      phetioVisiblePropertyInstrumented: true,
      visiblePropertyOptions: { phetioFeatured: true }
    } );
    this.screenViewRootNode.addChild( handlesLayer );
    this.pdomOrderInsertAfter( this.pdomPlayAreaNode, this.energyDiagramNode, handlesLayer );

    const potentials = model.potentialProperty.validValues;
    affirm( potentials && potentials.length > 0, 'At least one potential is required.' );
    potentials.forEach( potential => {
      handlesLayer.addChild( new EnergyOffsetHandleNode( potential, model.potentialProperty, model.energyDiagram,
        this.energyDiagramRectangleBounds, this.energyDiagramNode.chartTransform, model.energyOffsetDragHandleVisibleProperty, model.time,
        handlesLayer.tandem.createTandem( `${potential.tandemPrefix}EnergyOffsetHandleNode` ) ) );
    } );

    //TODO https://github.com/phetsims/quantum-bound-states/issues/39 Does energyAxisBackgroundRectangle belong somewhere else?
    //TODO https://github.com/phetsims/quantum-bound-states/issues/39 Compute width of energyAxisBackgroundRectangle.
    const energyAxisBackgroundRectangle = new Rectangle( 0, 0, 22, this.energyDiagramNode.chartTransform.viewHeight, {
      fill: QBSColors.energyAxisBackgroundFillProperty,
      stroke: QBSColors.energyAxisBackgroundStrokeProperty,
      visibleProperty: model.energyOffsetDragHandleVisibleProperty,
      top: this.energyDiagramRectangleBounds.top,
      right: this.energyDiagramRectangleBounds.left
    } );
    this.screenViewRootNode.addChild( energyAxisBackgroundRectangle );
    energyAxisBackgroundRectangle.moveToBack();
  }
}
