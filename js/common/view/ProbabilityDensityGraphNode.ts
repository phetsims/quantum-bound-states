// Copyright 2026, University of Colorado Boulder

/**
 * ProbabilityDensityGraphNode is the view for the 'Probability Density' graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Range from '../../../../dot/js/Range.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSModel from '../model/QBSModel.js';
import QBSColors from '../QBSColors.js';
import QBSConstants from '../QBSConstants.js';
import QuantumStateGraphNode, { QuantumStateGraphNodeOptions } from './QuantumStateGraphNode.js';
import YLinePlot from './YLinePlot.js';

type SelfOptions = EmptySelfOptions;

type ProbabilityDensityGraphNodeOptions = SelfOptions & Pick<QuantumStateGraphNodeOptions, 'createEquationDetailsButton' | 'tandem'>;

export default class ProbabilityDensityGraphNode extends QuantumStateGraphNode {

  public constructor( model: QBSModel, providedOptions: ProbabilityDensityGraphNodeOptions ) {

    const options = optionize<ProbabilityDensityGraphNodeOptions, SelfOptions, QuantumStateGraphNodeOptions>()( {

      // Options related to the y-axis.
      yAxisLabelStringProperty: QuantumBoundStatesFluent.probabilityDensityStringProperty,
      yRange: QBSConstants.PROBABILITY_DENSITY_GRAPH_Y_RANGE,
      yTickSpacing: 0.5,
      yTickLabelDecimals: 1,

      // Visible when this graph is selected.
      visibleProperty: new DerivedProperty( [ model.quantumStateGraphProperty ], graph => graph === model.probabilityDensityGraph ),

      // Core-description options for this graph.
      accessibleHeading: QuantumBoundStatesFluent.a11y.graphs.probabilityDensityGraph.accessibleHeadingStringProperty,
      accessibleParagraph: QuantumBoundStatesFluent.a11y.graphs.probabilityDensityGraph.accessibleParagraphStringProperty
    }, providedOptions );

    super( model.curvesVisibleProperty, options );

    // Computes the y-coordinates for the probability density plot.
    const computeYCoordinates = (): number[] => {
      const groundStateIndex = model.potentialProperty.value.getGroundStateIndex();
      const waveFunctionsIndex = model.energyLevelProperty.value - groundStateIndex;
      const waveFunctions = model.boundStateResultProperty.value.waveFunctions;
      affirm( waveFunctionsIndex >= 0 && waveFunctions.length, `waveFunctionsIndex out of range: ${waveFunctionsIndex}` );
      return waveFunctions[ waveFunctionsIndex ].map( x => x * x );
    };

    const probabilityDensityPlot = new YLinePlot( this.chartTransform, model.energyDiagram.xGrid.xCoordinates, computeYCoordinates(), {
      stroke: QBSColors.probabilityDensityStrokeProperty,
      lineWidth: 2
    } );

    // Update the plot when the selected energy level or the bound-state result changes.
    const updateProbabilityDensityPlot = () => {
      const yCoordinates = computeYCoordinates();
      probabilityDensityPlot.setYCoordinates( yCoordinates );

      // Change y-axis range and tick marks to fit the entire curve.
      const maxY = Math.max( ...yCoordinates );
      this.setYRange( new Range( 0, maxY + QBSConstants.QUANTUM_STATE_GRAPHS_Y_RANGE_DILATION ) );
      this.setYTickSpacing( maxY );
    };
    model.energyLevelProperty.link( updateProbabilityDensityPlot );
    model.boundStateResultProperty.link( updateProbabilityDensityPlot );

    this.curveLayer.addChild( probabilityDensityPlot );
  }
}
