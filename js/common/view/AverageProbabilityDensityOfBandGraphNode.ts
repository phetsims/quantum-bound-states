// Copyright 2026, University of Colorado Boulder

/**
 * AverageProbabilityDensityOfBandGraphNode is the view for the 'Average Probability Density of Band' graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSModel from '../model/QBSModel.js';
import QBSConstants from '../QBSConstants.js';
import { AverageProbabilityDensityOfBandDetailsButton } from './AverageProbabilityDensityOfBandDetailsButton.js';
import ProbabilityDensityDetailsDialog from './ProbabilityDensityDetailsDialog.js';
import QuantumStateGraphNode, { QBSGraphNodeOptions } from './QuantumStateGraphNode.js';

const BUTTON_X_MARGIN = 8;
const BUTTON_Y_MARGIN = 8;

type SelfOptions = EmptySelfOptions;

type AbsoluteProbabilityDensityOfBandGraphNodeOptions = SelfOptions & PickRequired<QBSGraphNodeOptions, 'tandem' | 'visibleProperty'>;

export default class AverageProbabilityDensityOfBandGraphNode extends QuantumStateGraphNode {

  public constructor( model: QBSModel, providedOptions: AbsoluteProbabilityDensityOfBandGraphNodeOptions ) {

    affirm( model.averageProbabilityDensityOfBandGraph, 'averageProbabilityDensityOfBandGraph is required' );

    const options = optionize<AbsoluteProbabilityDensityOfBandGraphNodeOptions, SelfOptions, QBSGraphNodeOptions>()( {
      yAxisLabelStringProperty: QuantumBoundStatesFluent.probabilityDensityStringProperty, // Yes, this is correct.
      yRange: QBSConstants.PROBABILITY_DENSITY_GRAPH_Y_RANGE,
      yTickSpacing: 0.5,
      yTickLabelDecimals: 1,
      accessibleHeading: QuantumBoundStatesFluent.a11y.graphs.averageProbabilityDensityGraph.accessibleHeadingStringProperty,
      accessibleParagraph: QuantumBoundStatesFluent.a11y.graphs.averageProbabilityDensityGraph.accessibleParagraphStringProperty,
      curvesVisibleToggleButtonOptions: {
        accessibleNameOn: QuantumBoundStatesFluent.a11y.averageProbabilityDensityOfBandToggleButton.accessibleNameOnStringProperty,
        accessibleNameOff: QuantumBoundStatesFluent.a11y.averageProbabilityDensityOfBandToggleButton.accessibleNameOffStringProperty,
        accessibleHelpText: new DerivedProperty( [
          model.curvesVisibleProperty,
          QuantumBoundStatesFluent.a11y.averageProbabilityDensityOfBandToggleButton.accessibleHelpTextOnStringProperty,
          QuantumBoundStatesFluent.a11y.averageProbabilityDensityOfBandToggleButton.accessibleHelpTextOffStringProperty
        ], ( curvesVisible, onString, offString ) => curvesVisible ? onString : offString ),
        accessibleContextResponseOn: QuantumBoundStatesFluent.a11y.averageProbabilityDensityOfBandToggleButton.accessibleContextResponseOnStringProperty,
        accessibleContextResponseOff: QuantumBoundStatesFluent.a11y.averageProbabilityDensityOfBandToggleButton.accessibleContextResponseOffStringProperty
      }
    }, providedOptions );

    super( model.curvesVisibleProperty, options );

    const detailsButton = new AverageProbabilityDensityOfBandDetailsButton( {
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

quantumBoundStates.register( 'AverageProbabilityDensityOfBandGraphNode', AverageProbabilityDensityOfBandGraphNode );