// Copyright 2025-2026, University of Colorado Boulder

/**
 * TwoWellsScreenView is the top-level view for the 'Two Wells' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSScreenView from '../../common/view/QBSScreenView.js';
import TwoWellsModel from '../model/TwoWellsModel.js';
import { TwoWellsControlPanel } from './TwoWellsControlPanel.js';
import TwoWellsScreenSummaryContent from './TwoWellsScreenSummaryContent.js';

export default class TwoWellsScreenView extends QBSScreenView {

  public constructor( model: TwoWellsModel, tandem: Tandem ) {

    const listboxParent = new Node();

    const energyDiagramControlPanel = new TwoWellsControlPanel( listboxParent, model.energyLevelProperty,
      model.potentialProperty, tandem.createTandem( 'energyDiagramControlPanel' ) );

    super( model, listboxParent, energyDiagramControlPanel, {
      screenSummaryContent: new TwoWellsScreenSummaryContent(),
      tandem: tandem
    } );
  }
}
