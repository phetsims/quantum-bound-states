// Copyright 2025-2026, University of Colorado Boulder

/**
 * SuperpositionScreenView is the top-level view for the 'Superposition' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Node from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FunctionDetailsButton from './FunctionDetailsButton.js';
import ProbabilityDensityDetailsDialog from '../../common/view/ProbabilityDensityDetailsDialog.js';
import QBSScreenView from '../../common/view/QBSScreenView.js';
import WaveFunctionDetailsDialog from '../../common/view/WaveFunctionDetailsDialog.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
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

      // Creates the button that opens a dialog that shows the expanded equation for Probability Density.
      createProbabilityDensityDetailsButton: tandem => new FunctionDetailsButton( {
        listener: () => new ProbabilityDensityDetailsDialog().show(),
        labelStringProperty: QuantumBoundStatesFluent.functionDetailsButton.probabilityDensityStringProperty,
        accessibleName: QuantumBoundStatesFluent.a11y.functionDetailsButton.probabilityDensity.accessibleNameStringProperty,
        accessibleHelpText: QuantumBoundStatesFluent.a11y.functionDetailsButton.probabilityDensity.accessibleHelpTextStringProperty,
        accessibleContextResponse: QuantumBoundStatesFluent.a11y.functionDetailsButton.probabilityDensity.accessibleContextResponseStringProperty,
        tandem: tandem
      } ),

      // Creates the button that opens a dialog that shows the expanded equation for Wave Function.
      createWaveFunctionDetailsButton: tandem => new FunctionDetailsButton( {
        listener: () => new WaveFunctionDetailsDialog().show(),
        labelStringProperty: QuantumBoundStatesFluent.functionDetailsButton.waveFunctionStringProperty,
        accessibleName: QuantumBoundStatesFluent.a11y.functionDetailsButton.waveFunction.accessibleNameStringProperty,
        accessibleHelpText: QuantumBoundStatesFluent.a11y.functionDetailsButton.waveFunction.accessibleHelpTextStringProperty,
        accessibleContextResponse: QuantumBoundStatesFluent.a11y.functionDetailsButton.waveFunction.accessibleContextResponseStringProperty,
        tandem: tandem
      } ),

      screenSummaryContent: new SuperpositionScreenSummaryContent(),
      tandem: tandem
    } );
  }
}
