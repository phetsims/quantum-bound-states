// Copyright 2026, University of Colorado Boulder

/**
 * WaveFunctionGraphNode is the view for the wave function graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QuantumStateGraph from '../model/QuantumStateGraph.js';
import WaveFunctionGraph from '../model/WaveFunctionGraph.js';
import QBSConstants from '../QBSConstants.js';
import EquationTermNode from './EquationTermNode.js';
import QuantumStateGraphNode, { QuantumStateGraphNodeOptions } from './QuantumStateGraphNode.js';
import WaveFunctionPlotsNode from './WaveFunctionPlotsNode.js';

type SelfOptions = EmptySelfOptions;

type WaveFunctionGraphNodeOptions = SelfOptions & Pick<QuantumStateGraphNodeOptions, 'createEquationDetailsButton' | 'tandem'>;

export default class WaveFunctionGraphNode extends QuantumStateGraphNode {

  public constructor( waveFunctionGraph: WaveFunctionGraph,
                      quantumStateGraphProperty: TReadOnlyProperty<QuantumStateGraph>,
                      selectedEnergyLevelIndexProperty: TReadOnlyProperty<number>,
                      curvesVisibleProperty: TReadOnlyProperty<boolean>,
                      providedOptions: WaveFunctionGraphNodeOptions ) {

    const yRange = waveFunctionGraph.yRangeProperty.value.dilated( QBSConstants.QUANTUM_STATE_GRAPHS_Y_RANGE_DILATION );

    const options = optionize<WaveFunctionGraphNodeOptions, SelfOptions, QuantumStateGraphNodeOptions>()( {

      // Options related to the y-axis.
      yAxisLabelStringProperty: QuantumBoundStatesFluent.waveFunctionStringProperty,
      yRange: yRange,
      yTickSpacing: yRange.max,
      yTickLabelDecimals: 1,

      // Visible when this graph is selected.
      visibleProperty: quantumStateGraphProperty.derived( graph => graph === waveFunctionGraph ),

      // Core-description options for this graph.
      accessibleHeading: QuantumBoundStatesFluent.a11y.waveFunctionGraph.accessibleHeadingStringProperty,
      accessibleParagraph: QuantumBoundStatesFluent.a11y.waveFunctionGraph.accessibleParagraph.createProperty( {
        energyLevelIndex: selectedEnergyLevelIndexProperty
      } )
    }, providedOptions );

    // If we do not have a button for showing equation details, then show a mathematical term in the top-right corner
    // of the chartRectangle. The term corresponds to the selected energy level.
    if ( !options.createEquationDetailsButton ) {
      options.createEquationTermNode = tandem => EquationTermNode.waveFunctionTerm( selectedEnergyLevelIndexProperty, tandem );
    }

    super( curvesVisibleProperty, options );

    // Canvas renderer for plots related to this graph.
    this.clippedLayer.addChild( new WaveFunctionPlotsNode( waveFunctionGraph, this.chartTransform ) );

    //TODO This should be lazyLink, but then the graph does not initially have correct y-range dilation.
    waveFunctionGraph.yRangeProperty.link( yRange => {
      this.setYRange( yRange.dilated( QBSConstants.QUANTUM_STATE_GRAPHS_Y_RANGE_DILATION ) );
      this.setYTickSpacing( yRange.max );
    } );
  }
}
