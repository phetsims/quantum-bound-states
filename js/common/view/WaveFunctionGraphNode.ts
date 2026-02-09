// Copyright 2026, University of Colorado Boulder

/**
 * WaveFunctionGraphNode is the view for the 'Wave Function' graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSConstants from '../QBSConstants.js';
import QBSGraphNode, { QBSGraphNodeOptions } from './QBSGraphNode.js';
import WaveFunctionEquationButton from './WaveFunctionEquationButton.js';

type SelfOptions = EmptySelfOptions;

type WaveFunctionGraphNodeOptions = SelfOptions & PickRequired<QBSGraphNodeOptions, 'tandem' | 'visibleProperty'>;

export default class WaveFunctionGraphNode extends QBSGraphNode {

  public constructor( providedOptions: WaveFunctionGraphNodeOptions ) {

    const options = optionize<WaveFunctionGraphNodeOptions, SelfOptions, QBSGraphNodeOptions>()( {
      xAxisLabelStringProperty: QuantumBoundStatesFluent.position_nmStringProperty,
      yAxisLabelStringProperty: QuantumBoundStatesFluent.waveFunctionStringProperty,
      viewWidth: QBSConstants.ALL_GRAPHS_VIEW_WIDTH,
      viewHeight: QBSConstants.WAVE_FUNCTION_GRAPH_VIEW_HEIGHT,
      xRange: QBSConstants.ALL_GRAPHS_X_RANGE,
      yRange: QBSConstants.WAVE_FUNCTION_GRAPH_Y_RANGE,
      xTickSpacing: QBSConstants.ALL_GRAPHS_X_TICK_SPACING,
      yTickSpacing: 0.5,
      hasYTickLabels: false
    }, providedOptions );

    super( options );

    const equationButton = new WaveFunctionEquationButton( options.tandem.createTandem( 'equationButton' ) );
    this.addChild( equationButton );
    equationButton.boundsProperty.link( () => {
      equationButton.top = this.chartRectangle.y + 8;
      equationButton.right = this.chartRectangle.right - 8;
    } );
  }
}

quantumBoundStates.register( 'WaveFunctionGraphNode', WaveFunctionGraphNode );