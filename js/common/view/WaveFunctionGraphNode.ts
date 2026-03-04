// Copyright 2026, University of Colorado Boulder

/**
 * WaveFunctionGraphNode is the view for the 'Wave Function' graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSModel from '../model/QBSModel.js';
import QBSConstants from '../QBSConstants.js';
import QuantumStateGraphNode, { QBSGraphNodeOptions } from './QuantumStateGraphNode.js';
import WaveFunctionDetailsDialog from './WaveFunctionDetailsDialog.js';

type SelfOptions = EmptySelfOptions;

type WaveFunctionGraphNodeOptions = SelfOptions & PickRequired<QBSGraphNodeOptions, 'tandem' | 'visibleProperty'>;

export default class WaveFunctionGraphNode extends QuantumStateGraphNode {

  public constructor( model: QBSModel, providedOptions: WaveFunctionGraphNodeOptions ) {

    const options = optionize<WaveFunctionGraphNodeOptions, SelfOptions, QBSGraphNodeOptions>()( {
      yAxisLabelStringProperty: QuantumBoundStatesFluent.waveFunctionStringProperty,
      yRange: QBSConstants.WAVE_FUNCTION_GRAPH_Y_RANGE,
      yTickSpacing: 0.5,
      yTickLabelDecimals: 1,

      // Core-description options for this graph.
      accessibleHeading: QuantumBoundStatesFluent.a11y.graphs.waveFunctionGraph.accessibleHeadingStringProperty,
      accessibleParagraph: QuantumBoundStatesFluent.a11y.graphs.waveFunctionGraph.accessibleParagraphStringProperty,

      // Options for the toggle button that shows/hides curves.
      curvesVisibleToggleButtonOptions: {
        accessibleNameOn: QuantumBoundStatesFluent.a11y.waveFunctionToggleButton.accessibleNameOnStringProperty,
        accessibleNameOff: QuantumBoundStatesFluent.a11y.waveFunctionToggleButton.accessibleNameOffStringProperty,
        accessibleHelpText: new DerivedProperty( [
          model.curvesVisibleProperty,
          QuantumBoundStatesFluent.a11y.waveFunctionToggleButton.accessibleHelpTextOnStringProperty,
          QuantumBoundStatesFluent.a11y.waveFunctionToggleButton.accessibleHelpTextOffStringProperty
        ], ( curvesVisible, onString, offString ) => curvesVisible ? onString : offString ),
        accessibleContextResponseOn: QuantumBoundStatesFluent.a11y.waveFunctionToggleButton.accessibleContextResponseOnStringProperty,
        accessibleContextResponseOff: QuantumBoundStatesFluent.a11y.waveFunctionToggleButton.accessibleContextResponseOffStringProperty
      },

      // Options for the button that opens a dialog that shows the expanded equation.
      functionDetailsButtonOptions: {
        listener: () => new WaveFunctionDetailsDialog( model.potentialProperty.value ).show(),
        labelStringProperty: QuantumBoundStatesFluent.waveFunctionDetailsButtonLabelStringProperty,
        accessibleName: QuantumBoundStatesFluent.a11y.waveFunctionDetailsButton.accessibleNameStringProperty,
        accessibleHelpText: QuantumBoundStatesFluent.a11y.waveFunctionDetailsButton.accessibleHelpTextStringProperty,
        accessibleContextResponse: QuantumBoundStatesFluent.a11y.waveFunctionDetailsButton.accessibleContextResponseStringProperty
      }
    }, providedOptions );

    super( model.curvesVisibleProperty, options );
  }
}

quantumBoundStates.register( 'WaveFunctionGraphNode', WaveFunctionGraphNode );