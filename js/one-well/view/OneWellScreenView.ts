// Copyright 2025-2026, University of Colorado Boulder

/**
 * OneWellScreenView is the top-level view for the 'One Well' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSScreenView from '../../common/view/QBSScreenView.js';
import OneWellModel from '../model/OneWellModel.js';
import EnergyOffsetHandleNode from '../../common/view/EnergyOffsetHandleNode.js';
import { OneWellControlPanel } from './OneWellControlPanel.js';
import OneWellScreenSummaryContent from './OneWellScreenSummaryContent.js';

export default class OneWellScreenView extends QBSScreenView {

  public constructor( model: OneWellModel, tandem: Tandem ) {

    const listboxParent = new Node();

    const energyDiagramControlPanel = new OneWellControlPanel( listboxParent, model.energyLevelProperty,
      model.electronMassesProperty, model.potentialProperty,
      tandem.createTandem( 'energyDiagramControlPanel' ) );

    super( model, listboxParent, energyDiagramControlPanel, {

      // Creates the drag handle for the y-axis in the Energy Diagram.
      createEnergyOffsetHandleNode: ( chartRectangleBounds: Bounds2, chartTransform: ChartTransform, tandem: Tandem ) =>
        new EnergyOffsetHandleNode(
          model.energyDiagram,
          model.potentialProperty,
          chartRectangleBounds,
          chartTransform,
          tandem ),
      screenSummaryContent: new OneWellScreenSummaryContent(),
      tandem: tandem
    } );
  }
}
