// Copyright 2026, University of Colorado Boulder

/**
 * AverageProbabilityDensityOfBandGraphNode is the view for the 'Average Probability Density of Band' graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSModel from '../model/QBSModel.js';
import QBSConstants from '../QBSConstants.js';
import AverageProbabilityDensityOfBandDetailsDialog from './AverageProbabilityDensityOfBandDetailsDialog.js';
import QuantumStateGraphNode, { QuantumStateGraphNodeOptions } from './QuantumStateGraphNode.js';

export default class AverageProbabilityDensityOfBandGraphNode extends QuantumStateGraphNode {

  public constructor( model: QBSModel, tandem: Tandem ) {

    affirm( model.averageProbabilityDensityOfBandGraph, 'averageProbabilityDensityOfBandGraph is required' );

    const options: QuantumStateGraphNodeOptions = {

      // Options related to the y-axis.
      yAxisLabelStringProperty: QuantumBoundStatesFluent.probabilityDensityStringProperty, // Yes, this is correct.
      yRange: QBSConstants.PROBABILITY_DENSITY_GRAPH_Y_RANGE,
      yTickSpacing: 0.5,
      yTickLabelDecimals: 1,

      // Visible when this graph is selected.
      visibleProperty: new DerivedProperty( [ model.selectedGraphProperty ], selectedGraph => selectedGraph === model.averageProbabilityDensityOfBandGraph ),

      // Core-description options for this graph.
      accessibleHeading: QuantumBoundStatesFluent.a11y.graphs.averageProbabilityDensityOfBandGraph.accessibleHeadingStringProperty,
      accessibleParagraph: QuantumBoundStatesFluent.a11y.graphs.averageProbabilityDensityOfBandGraph.accessibleParagraphStringProperty,

      // Options for the toggle button that shows/hides curves.
      curvesVisibleToggleButtonOptions: {
        accessibleNameOn: QuantumBoundStatesFluent.a11y.curvesVisibleToggleButton.averageProbabilityDensityOfBand.accessibleNameOnStringProperty,
        accessibleNameOff: QuantumBoundStatesFluent.a11y.curvesVisibleToggleButton.averageProbabilityDensityOfBand.accessibleNameOffStringProperty,
        accessibleHelpText: new DerivedProperty( [
          model.curvesVisibleProperty,
          QuantumBoundStatesFluent.a11y.curvesVisibleToggleButton.averageProbabilityDensityOfBand.accessibleHelpTextOnStringProperty,
          QuantumBoundStatesFluent.a11y.curvesVisibleToggleButton.averageProbabilityDensityOfBand.accessibleHelpTextOffStringProperty
        ], ( curvesVisible, onString, offString ) => curvesVisible ? onString : offString ),
        accessibleContextResponseOn: QuantumBoundStatesFluent.a11y.curvesVisibleToggleButton.averageProbabilityDensityOfBand.accessibleContextResponseOnStringProperty,
        accessibleContextResponseOff: QuantumBoundStatesFluent.a11y.curvesVisibleToggleButton.averageProbabilityDensityOfBand.accessibleContextResponseOffStringProperty
      },

      // Options for the button that opens a dialog that shows the expanded equation.
      detailsButtonOptions: {
        listener: () => new AverageProbabilityDensityOfBandDetailsDialog().show(),
        labelStringProperty: QuantumBoundStatesFluent.averageProbabilityDensityOfBandDetailsButtonLabelStringProperty,
        accessibleName: QuantumBoundStatesFluent.a11y.averageProbabilityDensityOfBandDetailsButton.accessibleNameStringProperty,
        accessibleHelpText: QuantumBoundStatesFluent.a11y.averageProbabilityDensityOfBandDetailsButton.accessibleHelpTextStringProperty,
        accessibleContextResponse: QuantumBoundStatesFluent.a11y.averageProbabilityDensityOfBandDetailsButton.accessibleContextResponseStringProperty
      },
      tandem: tandem
    };

    super( model.curvesVisibleProperty, options );
  }
}

quantumBoundStates.register( 'AverageProbabilityDensityOfBandGraphNode', AverageProbabilityDensityOfBandGraphNode );