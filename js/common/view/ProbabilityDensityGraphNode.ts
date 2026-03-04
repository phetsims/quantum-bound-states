// Copyright 2026, University of Colorado Boulder

/**
 * ProbabilityDensityGraphNode is the view for the 'Probability Density' graph.
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
import { ProbabilityDensityDetailsButton } from './ProbabilityDensityDetailsButton.js';
import ProbabilityDensityDetailsDialog from './ProbabilityDensityDetailsDialog.js';
import QuantumStateGraphNode, { QBSGraphNodeOptions } from './QuantumStateGraphNode.js';

const BUTTON_X_MARGIN = 8;
const BUTTON_Y_MARGIN = 8;

type SelfOptions = EmptySelfOptions;

type ProbabilityDensityGraphNodeOptions = SelfOptions & PickRequired<QBSGraphNodeOptions, 'tandem' | 'visibleProperty'>;

export default class ProbabilityDensityGraphNode extends QuantumStateGraphNode {

  public constructor( model: QBSModel, providedOptions: ProbabilityDensityGraphNodeOptions ) {

    const options = optionize<ProbabilityDensityGraphNodeOptions, SelfOptions, QBSGraphNodeOptions>()( {
      yAxisLabelStringProperty: QuantumBoundStatesFluent.probabilityDensityStringProperty,
      yRange: QBSConstants.PROBABILITY_DENSITY_GRAPH_Y_RANGE,
      yTickSpacing: 0.5,
      yTickLabelDecimals: 1,
      accessibleHeading: QuantumBoundStatesFluent.a11y.graphs.probabilityDensityGraph.accessibleHeadingStringProperty,
      accessibleParagraph: QuantumBoundStatesFluent.a11y.graphs.probabilityDensityGraph.accessibleParagraphStringProperty,
      curvesVisibleToggleButtonOptions: {
        accessibleNameOn: QuantumBoundStatesFluent.a11y.probabilityDensityToggleButton.accessibleNameOnStringProperty,
        accessibleNameOff: QuantumBoundStatesFluent.a11y.probabilityDensityToggleButton.accessibleNameOffStringProperty,
        accessibleHelpText: new DerivedProperty( [
          model.probabilityDensityGraph.curvesVisibleProperty,
          QuantumBoundStatesFluent.a11y.probabilityDensityToggleButton.accessibleHelpTextOnStringProperty,
          QuantumBoundStatesFluent.a11y.probabilityDensityToggleButton.accessibleHelpTextOffStringProperty
        ], ( curvesVisible, onString, offString ) => curvesVisible ? onString : offString ),
        accessibleContextResponseOn: QuantumBoundStatesFluent.a11y.probabilityDensityToggleButton.accessibleContextResponseOnStringProperty,
        accessibleContextResponseOff: QuantumBoundStatesFluent.a11y.probabilityDensityToggleButton.accessibleContextResponseOffStringProperty
      }
    }, providedOptions );

    super( model.probabilityDensityGraph.curvesVisibleProperty, options );

    const detailsButton = new ProbabilityDensityDetailsButton( {
      listener: () => new ProbabilityDensityDetailsDialog( model.potentialProperty.value ).show(),
      tandem: options.tandem.createTandem( 'detailsButton' )
    } );
    this.addChild( detailsButton );

    // Dynamically position the button in the top-right corner of the chart rectangle.
    detailsButton.boundsProperty.link( () => {
      detailsButton.right = this.chartRectangle.right - BUTTON_X_MARGIN;
      detailsButton.top = this.chartRectangle.y + BUTTON_Y_MARGIN;
    } );
  }
}

quantumBoundStates.register( 'ProbabilityDensityGraphNode', ProbabilityDensityGraphNode );