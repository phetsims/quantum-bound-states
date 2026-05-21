// Copyright 2026, University of Colorado Boulder

/**
 * WaveFunctionGraphNode is the view for the wave function graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QuantumStateGraph from '../model/QuantumStateGraph.js';
import WaveFunctionGraph from '../model/WaveFunctionGraph.js';
import QBSConstants from '../QBSConstants.js';
import WaveFunctionGraphDescriber from './description/WaveFunctionGraphDescriber.js';
import EquationTermNode from './EquationTermNode.js';
import ImaginaryPartPlot from './ImaginaryPartPlot.js';
import MagnitudePlot from './MagnitudePlot.js';
import PhasePlot from './PhasePlot.js';
import QuantumStateGraphNode, { QuantumStateGraphNodeOptions } from './QuantumStateGraphNode.js';
import RealPartPlot from './RealPartPlot.js';

type SelfOptions = EmptySelfOptions;

type WaveFunctionGraphNodeOptions = SelfOptions & Pick<QuantumStateGraphNodeOptions, 'createEquationDetailsButton' | 'tandem'>;

export default class WaveFunctionGraphNode extends QuantumStateGraphNode {

  public constructor( waveFunctionGraph: WaveFunctionGraph,
                      describer: WaveFunctionGraphDescriber,
                      quantumStateGraphProperty: TReadOnlyProperty<QuantumStateGraph>,
                      selectedEnergyLevelProperty: TReadOnlyProperty<number>,
                      curvesVisibleProperty: TReadOnlyProperty<boolean>,
                      providedOptions: WaveFunctionGraphNodeOptions ) {

    const yRange = waveFunctionGraph.yAxisRangeProperty.value.dilated( QBSConstants.QUANTUM_STATE_GRAPHS_Y_RANGE_DILATION );

    const options = optionize<WaveFunctionGraphNodeOptions, SelfOptions, QuantumStateGraphNodeOptions>()( {

      // Options related to the y-axis.
      yAxisLabelStringProperty: QuantumBoundStatesFluent.waveFunctionStringProperty,
      yRange: yRange,
      yTickSpacing: yRange.max,
      yTickLabelDecimals: 1,

      // Visible when this graph is selected.
      visibleProperty: new DerivedProperty( [ quantumStateGraphProperty ], graph => graph === waveFunctionGraph ),

      // Core-description options for this graph.
      accessibleHeading: QuantumBoundStatesFluent.a11y.waveFunctionGraph.accessibleHeadingStringProperty
    }, providedOptions );

    // If we do not have a button for showing equation details, then show a mathematical term in the top-right corner
    // of the chartRectangle. The term corresponds to the selected energy level.
    if ( !options.createEquationDetailsButton ) {
      options.createEquationTermNode = tandem => EquationTermNode.waveFunctionTerm( selectedEnergyLevelProperty, tandem );
    }

    super( curvesVisibleProperty, options );

    // Plots
    this.addPlot( new PhasePlot( waveFunctionGraph, this.chartTransform ) );
    this.addPlot( new MagnitudePlot( waveFunctionGraph, this.chartTransform ) );
    this.addPlot( new ImaginaryPartPlot( waveFunctionGraph, this.chartTransform ) );
    this.addPlot( new RealPartPlot( waveFunctionGraph, this.chartTransform ) );

    //TODO This should be lazyLink, but then the graph does not initially have correct y-range dilation.
    waveFunctionGraph.yAxisRangeProperty.link( yAxisRange => {
      this.setYRange( yAxisRange.dilated( QBSConstants.QUANTUM_STATE_GRAPHS_Y_RANGE_DILATION ) );
      this.setYTickSpacing( yAxisRange.max );
    } );

    this.setAccessibleTemplate( describer.getAccessibleTemplate() );
  }
}
