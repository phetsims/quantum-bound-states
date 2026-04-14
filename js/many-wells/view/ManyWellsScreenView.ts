// Copyright 2025-2026, University of Colorado Boulder

/**
 * ManyWellsScreenView is the top-level view for the 'Many Wells' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

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
      createYAxisZoomButtonGroup: tandem => new ManyWellsZoomButtonGroup( model.yAxisZoomLevelProperty, tandem ),
      tandem: tandem
    } );
  }
}
