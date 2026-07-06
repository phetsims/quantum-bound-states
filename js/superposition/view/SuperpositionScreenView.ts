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
import ProbabilityDensityDetailsButton from './ProbabilityDensityDetailsButton.js';
import { SuperpositionEnergyDiagramPanel } from './SuperpositionEnergyDiagramPanel.js';
import SuperpositionScreenSummaryContent from './SuperpositionScreenSummaryContent.js';
import WaveFunctionDetailsButton from './WaveFunctionDetailsButton.js';

export default class SuperpositionScreenView extends QBSScreenView {

  public constructor( model: SuperpositionModel, tandem: Tandem ) {

    const listboxParent = new Node();

    const energyDiagramPanel = new SuperpositionEnergyDiagramPanel(
      listboxParent,
      model.potentialProperty,
      model.boundStateResultProperty,
      model.superpositionStateTypeProperty,
      model.presetSuperpositionStateProperty,
      model.customSuperpositionStateProperty,
      tandem.createTandem( 'energyDiagramPanel' ) );

    super( model, listboxParent, energyDiagramPanel, {
      createProbabilityDensityDetailsButton: tandem => new ProbabilityDensityDetailsButton( tandem ),
      createWaveFunctionDetailsButton: tandem => new WaveFunctionDetailsButton( tandem ),
      hasEnergyLevelSelection: false,
      screenSummaryContent: new SuperpositionScreenSummaryContent( model ),
      tandem: tandem
    } );
  }
}
