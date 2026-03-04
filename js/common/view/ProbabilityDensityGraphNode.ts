// Copyright 2026, University of Colorado Boulder

/**
 * ProbabilityDensityGraphNode is the view for the 'Probability Density' graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSModel from '../model/QBSModel.js';
import QBSConstants from '../QBSConstants.js';
import ProbabilityDensityDetailsDialog from './ProbabilityDensityDetailsDialog.js';
import QuantumStateGraphNode, { QBSGraphNodeOptions } from './QuantumStateGraphNode.js';

type SelfOptions = EmptySelfOptions;

type ProbabilityDensityGraphNodeOptions = SelfOptions & PickRequired<QBSGraphNodeOptions, 'tandem' | 'visibleProperty'>;

export default class ProbabilityDensityGraphNode extends QuantumStateGraphNode {

  public constructor( model: QBSModel, providedOptions: ProbabilityDensityGraphNodeOptions ) {

    const options = optionize<ProbabilityDensityGraphNodeOptions, SelfOptions, QBSGraphNodeOptions>()( {
      yAxisLabelStringProperty: QuantumBoundStatesFluent.probabilityDensityStringProperty,
      yRange: QBSConstants.PROBABILITY_DENSITY_GRAPH_Y_RANGE,
      yTickSpacing: 0.5,
      yTickLabelDecimals: 1,

      // Core-description options for this graph.
      accessibleHeading: QuantumBoundStatesFluent.a11y.graphs.probabilityDensityGraph.accessibleHeadingStringProperty,
      accessibleParagraph: QuantumBoundStatesFluent.a11y.graphs.probabilityDensityGraph.accessibleParagraphStringProperty,

      // Options for the toggle button that shows/hides curves.
      curvesVisibleToggleButtonOptions: {
        accessibleNameOn: QuantumBoundStatesFluent.a11y.probabilityDensityToggleButton.accessibleNameOnStringProperty,
        accessibleNameOff: QuantumBoundStatesFluent.a11y.probabilityDensityToggleButton.accessibleNameOffStringProperty,
        accessibleHelpText: new DerivedProperty( [
          model.curvesVisibleProperty,
          QuantumBoundStatesFluent.a11y.probabilityDensityToggleButton.accessibleHelpTextOnStringProperty,
          QuantumBoundStatesFluent.a11y.probabilityDensityToggleButton.accessibleHelpTextOffStringProperty
        ], ( curvesVisible, onString, offString ) => curvesVisible ? onString : offString ),
        accessibleContextResponseOn: QuantumBoundStatesFluent.a11y.probabilityDensityToggleButton.accessibleContextResponseOnStringProperty,
        accessibleContextResponseOff: QuantumBoundStatesFluent.a11y.probabilityDensityToggleButton.accessibleContextResponseOffStringProperty
      },

      // Options for the button that opens a dialog that shows the expanded equation.
      functionDetailsButtonOptions: {
        listener: () => new ProbabilityDensityDetailsDialog( model.potentialProperty.value ).show(),
        labelStringProperty: QuantumBoundStatesFluent.probabilityDensityDetailsButtonLabelStringProperty,
        accessibleName: QuantumBoundStatesFluent.a11y.probabilityDensityDetailsButton.accessibleNameStringProperty,
        accessibleHelpText: QuantumBoundStatesFluent.a11y.probabilityDensityDetailsButton.accessibleHelpTextStringProperty,
        accessibleContextResponse: QuantumBoundStatesFluent.a11y.probabilityDensityDetailsButton.accessibleContextResponseStringProperty
      }
    }, providedOptions );

    super( model.curvesVisibleProperty, options );
  }
}

quantumBoundStates.register( 'ProbabilityDensityGraphNode', ProbabilityDensityGraphNode );