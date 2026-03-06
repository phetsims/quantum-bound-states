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
import { ManyWellsEnergyDiagramControlPanel } from './ManyWellsEnergyDiagramControlPanel.js';
import ManyWellsScreenSummaryContent from './ManyWellsScreenSummaryContent.js';

export default class ManyWellsScreenView extends QBSScreenView {

  public constructor( model: ManyWellsModel, tandem: Tandem ) {

    const energyDiagramControlPanel = new ManyWellsEnergyDiagramControlPanel(
      model.energyLevelProperty,
      model.numberOfWellsProperty,
      model.energyDiagram.valuesVisibleProperty,
      tandem.createTandem( 'energyDiagramControlPanel' ) );

    super( model, energyDiagramControlPanel, {
      screenSummaryContent: new ManyWellsScreenSummaryContent(),
      tandem: tandem
    } );
  }
}

quantumBoundStates.register( 'ManyWellsScreenView', ManyWellsScreenView );