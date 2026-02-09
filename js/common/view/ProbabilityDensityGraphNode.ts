// Copyright 2026, University of Colorado Boulder

/**
 * ProbabilityDensityGraphNode is the view for the 'Probability Density' graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSConstants from '../QBSConstants.js';
import ProbabilityDensityEquationButton from './ProbabilityDensityEquationButton.js';
import QBSGraphNode, { QBSGraphNodeOptions } from './QBSGraphNode.js';

type SelfOptions = EmptySelfOptions;

type ProbabilityDensityGraphNodeOptions = SelfOptions & PickRequired<QBSGraphNodeOptions, 'tandem' | 'visibleProperty'>;

export default class ProbabilityDensityGraphNode extends QBSGraphNode {

  public constructor( providedOptions: ProbabilityDensityGraphNodeOptions ) {

    const options = optionize<ProbabilityDensityGraphNodeOptions, SelfOptions, QBSGraphNodeOptions>()( {
      xAxisLabelStringProperty: QuantumBoundStatesFluent.position_nmStringProperty,
      yAxisLabelStringProperty: QuantumBoundStatesFluent.probabilityDensityStringProperty,
      viewWidth: QBSConstants.ALL_GRAPHS_VIEW_WIDTH,
      viewHeight: QBSConstants.PROBABILITY_DENSITY_GRAPH_VIEW_HEIGHT,
      xRange: QBSConstants.ALL_GRAPHS_X_RANGE,
      yRange: QBSConstants.PROBABILITY_DENSITY_GRAPH_Y_RANGE,
      xTickSpacing: QBSConstants.ALL_GRAPHS_X_TICK_SPACING,
      yTickSpacing: 0.5,
      hasYTickLabels: false
    }, providedOptions );

    super( options );

    const equationButton = new ProbabilityDensityEquationButton( options.tandem.createTandem( 'equationButton' ) );
    this.addChild( equationButton );
    equationButton.boundsProperty.link( () => {
      equationButton.top = this.chartRectangle.y + 8;
      equationButton.right = this.chartRectangle.right - 8;
    } );
  }
}

quantumBoundStates.register( 'ProbabilityDensityGraphNode', ProbabilityDensityGraphNode );