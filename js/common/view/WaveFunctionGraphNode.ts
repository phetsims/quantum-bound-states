// Copyright 2026, University of Colorado Boulder

/**
 * WaveFunctionGraphNode is the view for the 'Wave Function' graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSModel from '../model/QBSModel.js';
import QBSConstants from '../QBSConstants.js';
import QBSGraphNode, { QBSGraphNodeOptions } from './QBSGraphNode.js';
import WaveFunctionButton from './WaveFunctionButton.js';
import WaveFunctionDialog from './WaveFunctionDialog.js';
import { WaveFunctionToggleButton } from './WaveFunctionToggleButton.js';

const BUTTON_X_MARGIN = 8;
const BUTTON_Y_MARGIN = 8;

type SelfOptions = EmptySelfOptions;

type WaveFunctionGraphNodeOptions = SelfOptions & PickRequired<QBSGraphNodeOptions, 'tandem' | 'visibleProperty'>;

export default class WaveFunctionGraphNode extends QBSGraphNode {

  public constructor( model: QBSModel, providedOptions: WaveFunctionGraphNodeOptions ) {

    const options = optionize<WaveFunctionGraphNodeOptions, SelfOptions, QBSGraphNodeOptions>()( {
      xAxisLabelStringProperty: QuantumBoundStatesFluent.position_nmStringProperty,
      yAxisLabelStringProperty: QuantumBoundStatesFluent.waveFunctionStringProperty,
      viewWidth: QBSConstants.ALL_GRAPHS_VIEW_WIDTH,
      viewHeight: QBSConstants.WAVE_FUNCTION_GRAPH_VIEW_HEIGHT,
      xRange: QBSConstants.ALL_GRAPHS_X_RANGE,
      yRange: QBSConstants.WAVE_FUNCTION_GRAPH_Y_RANGE,
      xTickSpacing: QBSConstants.ALL_GRAPHS_X_TICK_SPACING,
      yTickSpacing: 0.5,
      hasYTickLabels: false,
      accessibleHeading: QuantumBoundStatesFluent.a11y.waveFunctionGraph.accessibleHeadingStringProperty,
      accessibleParagraph: QuantumBoundStatesFluent.a11y.waveFunctionGraph.accessibleParagraphStringProperty
    }, providedOptions );

    super( options );

    //TODO Which Property should be passed in here?
    const somethingVisibleProperty = new Property( true );

    const waveFunctionToggleButton = new WaveFunctionToggleButton( somethingVisibleProperty,
      options.tandem.createTandem( 'eyeToggleButton' ) );
    this.addChild( waveFunctionToggleButton );
    waveFunctionToggleButton.left = this.chartRectangle.x + BUTTON_X_MARGIN;
    waveFunctionToggleButton.top = this.chartRectangle.top + BUTTON_Y_MARGIN;

    const waveFunctionButton = new WaveFunctionButton( {
      listener: () => new WaveFunctionDialog( model.potentialProperty.value ).show(),
      tandem: options.tandem.createTandem( 'waveFunctionButton' )
    } );
    this.addChild( waveFunctionButton );

    // Dynamically position the button in the top-right corner of the chart rectangle.
    waveFunctionButton.boundsProperty.link( () => {
      waveFunctionButton.top = this.chartRectangle.y + 8;
      waveFunctionButton.right = this.chartRectangle.right - 8;
    } );
  }
}

quantumBoundStates.register( 'WaveFunctionGraphNode', WaveFunctionGraphNode );