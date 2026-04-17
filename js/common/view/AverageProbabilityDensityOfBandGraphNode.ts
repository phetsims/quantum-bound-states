// Copyright 2026, University of Colorado Boulder

/**
 * AverageProbabilityDensityOfBandGraphNode is the view for the 'Average Probability Density of Band' graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSModel from '../model/QBSModel.js';
import QBSConstants from '../QBSConstants.js';
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
      visibleProperty: new DerivedProperty( [ model.quantumStateGraphProperty ], graph => graph === model.averageProbabilityDensityOfBandGraph ),

      // Core-description options for this graph.
      accessibleHeading: QuantumBoundStatesFluent.a11y.graphs.averageProbabilityDensityOfBandGraph.accessibleHeadingStringProperty,
      accessibleParagraph: QuantumBoundStatesFluent.a11y.graphs.averageProbabilityDensityOfBandGraph.accessibleParagraphStringProperty,

      tandem: tandem
    };

    // If we do not have a button for showing equation details, then show a mathematical term in the top-right corner
    // of the chartRectangle. The term corresponds to the selected energy level.
    if ( !options.createEquationDetailsButton ) {
      options.termStringProperty = new DerivedStringProperty( [ model.energyLevelProperty ],
          energyLevel => `|Ψ<sub>${energyLevel}</sub>(x,t)|<sup>2</sup>` );
    }

    super( model.curvesVisibleProperty, options );
  }
}
