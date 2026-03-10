// Copyright 2025-2026, University of Colorado Boulder

/**
 * OneWellScreenView is the top-level view for the 'One Well' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import QBSScreenView from '../../common/view/QBSScreenView.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import OneWellModel from '../model/OneWellModel.js';
import { OneWellControlPanel } from './OneWellControlPanel.js';
import OneWellScreenSummaryContent from './OneWellScreenSummaryContent.js';

export default class OneWellScreenView extends QBSScreenView {

  public constructor( model: OneWellModel, tandem: Tandem ) {

    const energyDiagramControlPanel = new OneWellControlPanel( model.energyLevelProperty, model.electronMassesProperty,
      tandem.createTandem( 'energyDiagramControlPanel' ) );

    super( model, energyDiagramControlPanel, {
      screenSummaryContent: new OneWellScreenSummaryContent(),
      tandem: tandem
    } );
  }
}

quantumBoundStates.register( 'OneWellScreenView', OneWellScreenView );