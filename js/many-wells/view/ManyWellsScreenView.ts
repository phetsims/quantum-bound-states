// Copyright 2025-2026, University of Colorado Boulder

/**
 * ManyWellsScreenView is the top-level view for the 'Many Wells' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import QBSScreenView from '../../common/view/QBSScreenView.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import ManyWellsModel from '../model/ManyWellsModel.js';
import { ManyWellsControlPanel } from './ManyWellsControlPanel.js';
import ManyWellsScreenSummaryContent from './ManyWellsScreenSummaryContent.js';
import ManyWellsZoomButtonGroup from './ManyWellsZoomButtonGroup.js';

export default class ManyWellsScreenView extends QBSScreenView {

  public constructor( model: ManyWellsModel, tandem: Tandem ) {

    const energyDiagramControlPanel = new ManyWellsControlPanel(
      model.energyLevelProperty,
      model.numberOfWellsProperty,
      model.electricFieldProperty,
      tandem.createTandem( 'energyDiagramControlPanel' ) );

    super( model, energyDiagramControlPanel, {
      screenSummaryContent: new ManyWellsScreenSummaryContent(),
      createYAxisZoomButtonGroup: tandem => new ManyWellsZoomButtonGroup( model.yAxisZoomLevelProperty, tandem ),
      tandem: tandem
    } );
  }
}

quantumBoundStates.register( 'ManyWellsScreenView', ManyWellsScreenView );