// Copyright 2026, University of Colorado Boulder

/**
 * ProbabilityDensityGraphNode is the view for the 'Probability Density' graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSConstants from '../QBSConstants.js';
import QBSGraphNode, { QBSGraphNodeOptions } from './QBSGraphNode.js';

export default class ProbabilityDensityGraphNode extends QBSGraphNode {

  public constructor( tandem: Tandem ) {

    const options: QBSGraphNodeOptions = {
      xAxisLabelStringProperty: QuantumBoundStatesFluent.position_nmStringProperty,
      yAxisLabelStringProperty: QuantumBoundStatesFluent.probabilityDensityStringProperty,
      viewWidth: QBSConstants.ALL_GRAPHS_VIEW_WIDTH,
      viewHeight: QBSConstants.PROBABILITY_DENSITY_GRAPH_VIEW_HEIGHT,
      xRange: QBSConstants.ALL_GRAPHS_X_RANGE,
      yRange: QBSConstants.PROBABILITY_DENSITY_GRAPH_Y_RANGE,
      hasYTicks: false, //TODO Java version has unlabeled tick marks. Are they needed?
      xTickSpacing: 1,
      yTickSpacing: 0.5,
      yTickLabelDecimals: 1,
      tandem: tandem
    };

    super( options );
  }
}

quantumBoundStates.register( 'ProbabilityDensityGraphNode', ProbabilityDensityGraphNode );