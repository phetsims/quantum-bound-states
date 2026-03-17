// Copyright 2026, University of Colorado Boulder

/**
 * ProbabilityDensityGraphNode is the view for the 'Probability Density' graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSModel from '../model/QBSModel.js';
import QBSConstants from '../QBSConstants.js';
import ProbabilityDensityDetailsDialog from './ProbabilityDensityDetailsDialog.js';
import QuantumStateGraphNode, { QuantumStateGraphNodeOptions } from './QuantumStateGraphNode.js';

export default class ProbabilityDensityGraphNode extends QuantumStateGraphNode {

  public constructor( model: QBSModel, tandem: Tandem ) {

    const options: QuantumStateGraphNodeOptions = {

      // Options related to the y-axis.
      yAxisLabelStringProperty: QuantumBoundStatesFluent.probabilityDensityStringProperty,
      yRange: QBSConstants.PROBABILITY_DENSITY_GRAPH_Y_RANGE,
      yTickSpacing: 0.5,
      yTickLabelDecimals: 1,

      // Visible when this graph is selected.
      visibleProperty: new DerivedProperty( [ model.selectedGraphProperty ], selectedGraph => selectedGraph === model.probabilityDensityGraph ),

      // Core-description options for this graph.
      accessibleHeading: QuantumBoundStatesFluent.a11y.graphs.probabilityDensityGraph.accessibleHeadingStringProperty,
      accessibleParagraph: QuantumBoundStatesFluent.a11y.graphs.probabilityDensityGraph.accessibleParagraphStringProperty,

      // Options for the button that opens a dialog that shows the expanded equation.
      functionDetailsButtonOptions: {
        listener: () => new ProbabilityDensityDetailsDialog().show(),
        labelStringProperty: QuantumBoundStatesFluent.functionDetailsButton.probabilityDensityStringProperty,
        accessibleName: QuantumBoundStatesFluent.a11y.functionDetailsButton.probabilityDensity.accessibleNameStringProperty,
        accessibleHelpText: QuantumBoundStatesFluent.a11y.functionDetailsButton.probabilityDensity.accessibleHelpTextStringProperty,
        accessibleContextResponse: QuantumBoundStatesFluent.a11y.functionDetailsButton.probabilityDensity.accessibleContextResponseStringProperty
      },
      tandem: tandem
    };

    super( model.curvesVisibleProperty, options );
  }
}

quantumBoundStates.register( 'ProbabilityDensityGraphNode', ProbabilityDensityGraphNode );