// Copyright 2026, University of Colorado Boulder

/**
 * ProbabilityDensityGraphNode is the view for the 'Probability Density' graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import ProbabilityDensityGraph from '../model/ProbabilityDensityGraph.js';
import QuantumStateGraph from '../model/QuantumStateGraph.js';
import QBSConstants from '../QBSConstants.js';
import EquationTermNode from './EquationTermNode.js';
import ProbabilityDensityPlotsNode from './ProbabilityDensityPlotsNode.js';
import QuantumStateGraphNode, { QuantumStateGraphNodeOptions } from './QuantumStateGraphNode.js';

type SelfOptions = EmptySelfOptions;

type ProbabilityDensityGraphNodeOptions = SelfOptions & Pick<QuantumStateGraphNodeOptions, 'createEquationDetailsButton' | 'tandem'>;

export default class ProbabilityDensityGraphNode extends QuantumStateGraphNode {

  public constructor( probabilityDensityGraph: ProbabilityDensityGraph,
                      quantumStateGraphProperty: TReadOnlyProperty<QuantumStateGraph>,
                      selectedEnergyLevelIndexProperty: TReadOnlyProperty<number>,
                      curvesVisibleProperty: TReadOnlyProperty<boolean>,
                      providedOptions: ProbabilityDensityGraphNodeOptions ) {

    const yRange = new Range( probabilityDensityGraph.yRangeProperty.value.min,
      probabilityDensityGraph.yRangeProperty.value.max + QBSConstants.QUANTUM_STATE_GRAPHS_Y_RANGE_DILATION );

    const options = optionize<ProbabilityDensityGraphNodeOptions, SelfOptions, QuantumStateGraphNodeOptions>()( {

      // Options related to the y-axis.
      yAxisLabelStringProperty: QuantumBoundStatesFluent.probabilityDensityStringProperty,
      yRange: yRange,
      yTickSpacing: yRange.max,
      yTickLabelDecimals: 1,

      // Visible when this graph is selected.
      visibleProperty: quantumStateGraphProperty.derived( graph => graph === probabilityDensityGraph ),

      // Core-description options for this graph.
      accessibleParagraph: QuantumBoundStatesFluent.a11y.quantumStateGraph.accessibleParagraph.probabilityDensity.createProperty( {
        energyLevelIndex: selectedEnergyLevelIndexProperty,
        numberOfNodes: probabilityDensityGraph.numberOfNodesProperty
      } )
    }, providedOptions );

    // If we do not have a button for showing equation details, then show a mathematical term in the top-right corner
    // of the chartRectangle. The term corresponds to the selected energy level.
    if ( !options.createEquationDetailsButton ) {
      options.createEquationTermNode = tandem => EquationTermNode.probabilityDensityTerm( selectedEnergyLevelIndexProperty, tandem );
    }

    super( curvesVisibleProperty, options );

    // Canvas renderer for plots related to this graph.
    this.clippedLayer.addChild( new ProbabilityDensityPlotsNode( probabilityDensityGraph, this.chartTransform ) );

    //TODO This should be lazyLink, but then the graph does not initially have correct y-range dilation.
    probabilityDensityGraph.yRangeProperty.link( yRange => {
      this.setYRange( new Range( yRange.min, yRange.max + QBSConstants.QUANTUM_STATE_GRAPHS_Y_RANGE_DILATION ) );
      this.setYTickSpacing( yRange.max );
    } );
  }
}
