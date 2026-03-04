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
import QBSModel from '../model/QBSModel.js';
import QBSConstants from '../QBSConstants.js';
import QuantumStateGraphNode, { QBSGraphNodeOptions } from './QuantumStateGraphNode.js';
import WaveFunctionDetailsButton from './WaveFunctionDetailsButton.js';
import WaveFunctionDetailsDialog from './WaveFunctionDetailsDialog.js';
import { WaveFunctionToggleButton } from './WaveFunctionToggleButton.js';

const BUTTON_X_MARGIN = 8;
const BUTTON_Y_MARGIN = 8;

type SelfOptions = EmptySelfOptions;

type WaveFunctionGraphNodeOptions = SelfOptions & PickRequired<QBSGraphNodeOptions, 'tandem' | 'visibleProperty'>;

export default class WaveFunctionGraphNode extends QuantumStateGraphNode {

  public constructor( model: QBSModel, providedOptions: WaveFunctionGraphNodeOptions ) {

    const options = optionize<WaveFunctionGraphNodeOptions, SelfOptions, QBSGraphNodeOptions>()( {
      yAxisLabelStringProperty: QuantumBoundStatesFluent.waveFunctionStringProperty,
      yRange: QBSConstants.WAVE_FUNCTION_GRAPH_Y_RANGE,
      yTickSpacing: 0.5,
      yTickLabelDecimals: 1,
      accessibleHeading: QuantumBoundStatesFluent.a11y.graphs.waveFunctionGraph.accessibleHeadingStringProperty,
      accessibleParagraph: QuantumBoundStatesFluent.a11y.graphs.waveFunctionGraph.accessibleParagraphStringProperty
    }, providedOptions );

    super( options );

    const curvesVisibleToggleButton = new WaveFunctionToggleButton( model.waveFunctionGraph.curvesVisibleProperty,
      options.tandem.createTandem( 'eyeToggleButton' ) );
    this.addChild( curvesVisibleToggleButton );
    curvesVisibleToggleButton.left = this.chartRectangle.x + BUTTON_X_MARGIN;
    curvesVisibleToggleButton.top = this.chartRectangle.top + BUTTON_Y_MARGIN;

    const detailsButton = new WaveFunctionDetailsButton( {
      listener: () => new WaveFunctionDetailsDialog( model.potentialProperty.value ).show(),
      tandem: options.tandem.createTandem( 'detailsButton' )
    } );
    this.addChild( detailsButton );

    // Dynamically position the button in the top-right corner of the chart rectangle.
    detailsButton.boundsProperty.link( () => {
      detailsButton.top = this.chartRectangle.y + 8;
      detailsButton.right = this.chartRectangle.right - 8;
    } );
  }
}

quantumBoundStates.register( 'WaveFunctionGraphNode', WaveFunctionGraphNode );