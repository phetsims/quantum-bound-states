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
import QBSModel from '../model/QBSModel.js';
import QBSConstants from '../QBSConstants.js';
import { ProbabilityDensityDetailsButton } from './ProbabilityDensityDetailsButton.js';
import ProbabilityDensityDetailsDialog from './ProbabilityDensityDetailsDialog.js';
import { ProbabilityDensityToggleButton } from './ProbabilityDensityToggleButton.js';
import QuantumStateGraphNode, { QBSGraphNodeOptions } from './QuantumStateGraphNode.js';

const BUTTON_X_MARGIN = 8;
const BUTTON_Y_MARGIN = 8;

type SelfOptions = EmptySelfOptions;

type ProbabilityDensityGraphNodeOptions = SelfOptions & PickRequired<QBSGraphNodeOptions, 'tandem' | 'visibleProperty'>;

export class ProbabilityDensityGraphNode extends QuantumStateGraphNode {

  public constructor( model: QBSModel, providedOptions: ProbabilityDensityGraphNodeOptions ) {

    const options = optionize<ProbabilityDensityGraphNodeOptions, SelfOptions, QBSGraphNodeOptions>()( {
      yAxisLabelStringProperty: QuantumBoundStatesFluent.probabilityDensityStringProperty,
      yRange: QBSConstants.PROBABILITY_DENSITY_GRAPH_Y_RANGE,
      yTickSpacing: 0.5,
      yTickLabelDecimals: 1,
      accessibleHeading: QuantumBoundStatesFluent.a11y.graphs.probabilityDensityGraph.accessibleHeadingStringProperty,
      accessibleParagraph: QuantumBoundStatesFluent.a11y.graphs.probabilityDensityGraph.accessibleParagraphStringProperty
    }, providedOptions );

    super( options );

    const probabilityDensityToggleButton = new ProbabilityDensityToggleButton( model.probabilityDensityGraph.curvesVisibleProperty,
      options.tandem.createTandem( 'probabilityDensityToggleButton' ) );
    this.addChild( probabilityDensityToggleButton );
    probabilityDensityToggleButton.left = this.chartRectangle.x + BUTTON_X_MARGIN;
    probabilityDensityToggleButton.top = this.chartRectangle.top + BUTTON_Y_MARGIN;

    const probabilityDensityDetailsButton = new ProbabilityDensityDetailsButton( {
      listener: () => new ProbabilityDensityDetailsDialog( model.potentialProperty.value ).show(),
      tandem: options.tandem.createTandem( 'probabilityDensityDetailsButton' )
    } );
    this.addChild( probabilityDensityDetailsButton );

    // Dynamically position the button in the top-right corner of the chart rectangle.
    probabilityDensityDetailsButton.boundsProperty.link( () => {
      probabilityDensityDetailsButton.right = this.chartRectangle.right - BUTTON_X_MARGIN;
      probabilityDensityDetailsButton.top = this.chartRectangle.y + BUTTON_Y_MARGIN;
    } );
  }
}

quantumBoundStates.register( 'ProbabilityDensityGraphNode', ProbabilityDensityGraphNode );