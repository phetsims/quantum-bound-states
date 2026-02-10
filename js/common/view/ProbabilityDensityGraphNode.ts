// Copyright 2026, University of Colorado Boulder

/**
 * ProbabilityDensityGraphNode is the view for the 'Probability Density' graph.
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
import QBSModel from '../model/QBSModel.js';
import QBSColors from '../QBSColors.js';
import QBSConstants from '../QBSConstants.js';
import { ProbabilityDensityFunctionButton } from './ProbabilityDensityFunctionButton.js';
import ProbabilityDensityFunctionDialog from './ProbabilityDensityFunctionDialog.js';
import QBSGraphNode, { QBSGraphNodeOptions } from './QBSGraphNode.js';

const BUTTON_X_MARGIN = 8;
const BUTTON_Y_MARGIN = 8;

type SelfOptions = EmptySelfOptions;

type ProbabilityDensityGraphNodeOptions = SelfOptions & PickRequired<QBSGraphNodeOptions, 'tandem' | 'visibleProperty'>;

export class ProbabilityDensityGraphNode extends QBSGraphNode {

  public constructor( model: QBSModel, providedOptions: ProbabilityDensityGraphNodeOptions ) {

    const options = optionize<ProbabilityDensityGraphNodeOptions, SelfOptions, QBSGraphNodeOptions>()( {
      xAxisLabelStringProperty: QuantumBoundStatesFluent.position_nmStringProperty,
      yAxisLabelStringProperty: QuantumBoundStatesFluent.probabilityDensityStringProperty,
      viewWidth: QBSConstants.ALL_GRAPHS_VIEW_WIDTH,
      viewHeight: QBSConstants.PROBABILITY_DENSITY_GRAPH_VIEW_HEIGHT,
      xRange: QBSConstants.ALL_GRAPHS_X_RANGE,
      yRange: QBSConstants.PROBABILITY_DENSITY_GRAPH_Y_RANGE,
      xTickSpacing: QBSConstants.ALL_GRAPHS_X_TICK_SPACING,
      yTickSpacing: 0.5,
      hasYTickLabels: false,
      accessibleHeading: QuantumBoundStatesFluent.a11y.probabilityDensityGraph.accessibleHeadingStringProperty,
      accessibleParagraph: QuantumBoundStatesFluent.a11y.probabilityDensityGraph.accessibleParagraphStringProperty
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
      accessibleNameOn: QuantumBoundStatesFluent.a11y.probabilityDensityToggleButton.accessibleNameOnStringProperty,
      accessibleNameOff: QuantumBoundStatesFluent.a11y.probabilityDensityToggleButton.accessibleNameOffStringProperty,
      accessibleHelpText: new DerivedProperty( [
        somethingVisibleProperty,
        QuantumBoundStatesFluent.a11y.probabilityDensityToggleButton.accessibleHelpTextOnStringProperty,
        QuantumBoundStatesFluent.a11y.probabilityDensityToggleButton.accessibleHelpTextOffStringProperty
      ], ( visible, onString, offString ) => visible ? onString : offString ),
      accessibleContextResponseOn: QuantumBoundStatesFluent.a11y.probabilityDensityToggleButton.accessibleContextResponseOnStringProperty,
      accessibleContextResponseOff: QuantumBoundStatesFluent.a11y.probabilityDensityToggleButton.accessibleContextResponseOffStringProperty,
      tandem: options.tandem.createTandem( 'eyeToggleButton' )
    } );
    this.addChild( eyeToggleButton );
    eyeToggleButton.left = this.chartRectangle.x + BUTTON_X_MARGIN;
    eyeToggleButton.top = this.chartRectangle.top + BUTTON_Y_MARGIN;

    const probabilityDensityFunctionButton = new ProbabilityDensityFunctionButton( {
      listener: () => new ProbabilityDensityFunctionDialog( model.potentialProperty.value ).show(),
      tandem: options.tandem.createTandem( 'probabilityDensityFunctionButton' )
    } );
    this.addChild( probabilityDensityFunctionButton );

    // Dynamically position the button in the top-right corner of the chart rectangle.
    probabilityDensityFunctionButton.boundsProperty.link( () => {
      probabilityDensityFunctionButton.right = this.chartRectangle.right - BUTTON_X_MARGIN;
      probabilityDensityFunctionButton.top = this.chartRectangle.y + BUTTON_Y_MARGIN;
    } );
  }
}

quantumBoundStates.register( 'ProbabilityDensityGraphNode', ProbabilityDensityGraphNode );