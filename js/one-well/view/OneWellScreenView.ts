// Copyright 2025-2026, University of Colorado Boulder

/**
 * OneWellScreenView is the top-level view for the 'One Well' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
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
  }
}
