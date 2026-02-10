// Copyright 2026, University of Colorado Boulder

/**
 * WaveFunctionGraphNode is the view for the 'Wave Function' graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import EyeToggleButton from '../../../../scenery-phet/js/buttons/EyeToggleButton.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSColors from '../QBSColors.js';
import QBSConstants from '../QBSConstants.js';
import QBSGraphNode, { QBSGraphNodeOptions } from './QBSGraphNode.js';
import WaveFunctionButton from './WaveFunctionButton.js';
import WaveFunctionDialog from './WaveFunctionDialog.js';

const BUTTON_X_MARGIN = 8;
const BUTTON_Y_MARGIN = 8;

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
      hasYTickLabels: false,
      accessibleHeading: QuantumBoundStatesFluent.a11y.waveFunctionGraph.accessibleHeadingStringProperty,
      accessibleParagraph: QuantumBoundStatesFluent.a11y.waveFunctionGraph.accessibleParagraphStringProperty
    }, providedOptions );

    super( options );

    //TODO Which Property should be passed in here?
    const somethingVisibleProperty = new Property( true );

    //TODO Rename to reflect what this button does.
    const eyeToggleButton = new EyeToggleButton( somethingVisibleProperty, {
      scale: 0.5,
      baseColor: new DerivedProperty(
        [ somethingVisibleProperty, QBSColors.graphShownProperty, QBSColors.graphHiddenColorProperty ],
        ( visible, shownColor, hiddenColor ) => visible ? shownColor : hiddenColor ),
      accessibleNameOn: QuantumBoundStatesFluent.a11y.waveFunctionToggleButton.accessibleNameOnStringProperty,
      accessibleNameOff: QuantumBoundStatesFluent.a11y.waveFunctionToggleButton.accessibleNameOffStringProperty,
      accessibleHelpText: new DerivedProperty( [
        somethingVisibleProperty,
        QuantumBoundStatesFluent.a11y.waveFunctionToggleButton.accessibleHelpTextOnStringProperty,
        QuantumBoundStatesFluent.a11y.waveFunctionToggleButton.accessibleHelpTextOffStringProperty
      ], ( visible, onString, offString ) => visible ? onString : offString ),
      accessibleContextResponseOn: QuantumBoundStatesFluent.a11y.waveFunctionToggleButton.accessibleContextResponseOnStringProperty,
      accessibleContextResponseOff: QuantumBoundStatesFluent.a11y.waveFunctionToggleButton.accessibleContextResponseOffStringProperty,
      tandem: options.tandem.createTandem( 'eyeToggleButton' )
    } );
    this.addChild( eyeToggleButton );
    eyeToggleButton.left = this.chartRectangle.x + BUTTON_X_MARGIN;
    eyeToggleButton.top = this.chartRectangle.top + BUTTON_Y_MARGIN;

    const waveFunctionDialog = new WaveFunctionDialog( options.tandem.createTandem( 'waveFunctionDialog' ) );

    const waveFunctionButton = new WaveFunctionButton( {
      listener: () => waveFunctionDialog.show(),
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