// Copyright 2026, University of Colorado Boulder

/**
 * EnergyGraphNode is the view for the 'Energy' graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSConstants from '../QBSConstants.js';
import QBSGraphNode, { QBSGraphNodeOptions } from './QBSGraphNode.js';

export default class EnergyGraphNode extends QBSGraphNode {

  public constructor( tandem: Tandem ) {

    const options: QBSGraphNodeOptions = {
      yAxisLabelStringProperty: QuantumBoundStatesFluent.energy_eVStringProperty,
      viewWidth: QBSConstants.ALL_GRAPHS_VIEW_WIDTH,
      viewHeight: QBSConstants.ENERGY_GRAPH_VIEW_HEIGHT,
      xRange: QBSConstants.ALL_GRAPHS_X_RANGE,
      yRange: QBSConstants.ENERGY_GRAPH_Y_RANGE,
      hasXTicks: false,
      xTickSpacing: QBSConstants.ALL_GRAPHS_X_TICK_SPACING,
      yTickSpacing: 5,
      tandem: tandem
    };

    super( options );
  }
}

quantumBoundStates.register( 'EnergyGraphNode', EnergyGraphNode );