// Copyright 2025-2026, University of Colorado Boulder

/**
 * SuperpositionScreenView is the top-level view for the 'Superposition' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import QBSScreenView from '../../common/view/QBSScreenView.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import SuperpositionModel from '../model/SuperpositionModel.js';
import { SuperpositionEnergyDiagramControlPanel } from './SuperpositionEnergyDiagramControlPanel.js';
import SuperpositionScreenSummaryContent from './SuperpositionScreenSummaryContent.js';

export default class SuperpositionScreenView extends QBSScreenView {

  public constructor( model: SuperpositionModel, tandem: Tandem ) {

    const energyDiagramControlPanel = new SuperpositionEnergyDiagramControlPanel( model.energyDiagram.valuesVisibleProperty,
      tandem.createTandem( 'energyDiagramControlPanel' ) );

    super( model, energyDiagramControlPanel, {
      screenSummaryContent: new SuperpositionScreenSummaryContent(),
      tandem: tandem
    } );
  }
}

quantumBoundStates.register( 'SuperpositionScreenView', SuperpositionScreenView );