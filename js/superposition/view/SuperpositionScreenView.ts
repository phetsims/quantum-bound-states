// Copyright 2025-2026, University of Colorado Boulder

/**
 * SuperpositionScreenView is the top-level view for the 'Superposition' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSScreenView from '../../common/view/QBSScreenView.js';
import SuperpositionModel from '../model/SuperpositionModel.js';
import { SuperpositionControlPanel } from './SuperpositionControlPanel.js';
import SuperpositionScreenSummaryContent from './SuperpositionScreenSummaryContent.js';

export default class SuperpositionScreenView extends QBSScreenView {

  public constructor( model: SuperpositionModel, tandem: Tandem ) {

    const listboxParent = new Node();

    const energyDiagramControlPanel = new SuperpositionControlPanel(
      listboxParent,
      model.potentialProperty,
      model.superpositionConfigurationTypeProperty,
      model.superpositionPresetProperty,
      tandem.createTandem( 'energyDiagramControlPanel' ) );

    super( model, listboxParent, energyDiagramControlPanel, {
      screenSummaryContent: new SuperpositionScreenSummaryContent(),
      tandem: tandem
    } );
  }
}
