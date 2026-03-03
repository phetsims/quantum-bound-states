// Copyright 2026, University of Colorado Boulder

/**
 * EnergyDiagramNode is the view for the 'Energy' diagram.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSConstants from '../QBSConstants.js';
import QBSGraphNode, { QBSGraphNodeOptions } from './QBSGraphNode.js';

export default class EnergyDiagramNode extends QBSGraphNode {

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
      accessibleHeading: QuantumBoundStatesFluent.a11y.energyDiagram.accessibleHeadingStringProperty,
      accessibleParagraph: QuantumBoundStatesFluent.a11y.energyDiagram.accessibleParagraphStringProperty,
      tandem: tandem
    };

    super( options );
  }
}

quantumBoundStates.register( 'EnergyDiagramNode', EnergyDiagramNode );