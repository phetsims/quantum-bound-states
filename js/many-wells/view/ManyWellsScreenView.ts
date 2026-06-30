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

export default class ManyWellsScreenView extends QBSScreenView {

  public constructor( model: ManyWellsModel, tandem: Tandem ) {

    const listboxParent = new Node();

    const energyDiagramControlPanel = new ManyWellsControlPanel(
      listboxParent,
      model.potentialProperty,
      model.numberOfWellsProperty,
      model.electricFieldProperty,
      model.selectedEnergyLevelIndexProperty,
      model.time,
      tandem.createTandem( 'energyDiagramControlPanel' ) );

    super( model, listboxParent, energyDiagramControlPanel, {
      screenSummaryContent: new ManyWellsScreenSummaryContent( model ),
      tandem: tandem
    } );
  }
}
