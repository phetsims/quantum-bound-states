// Copyright 2025-2026, University of Colorado Boulder

/**
 * TwoWellsScreenView is the top-level view for the 'Two Wells' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import QBSScreenView from '../../common/view/QBSScreenView.js';
import TwoWellsModel from '../model/TwoWellsModel.js';
import { TwoWellsControlPanel } from './TwoWellsControlPanel.js';
import TwoWellsScreenSummaryContent from './TwoWellsScreenSummaryContent.js';

export default class TwoWellsScreenView extends QBSScreenView {

  public constructor( model: TwoWellsModel, tandem: Tandem ) {

    const energyDiagramControlPanel = new TwoWellsControlPanel( model.energyLevelProperty,
      tandem.createTandem( 'energyDiagramControlPanel' ) );

    super( model, energyDiagramControlPanel, {
      screenSummaryContent: new TwoWellsScreenSummaryContent(),
      tandem: tandem
    } );
  }
}
