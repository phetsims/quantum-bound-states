// Copyright 2026, University of Colorado Boulder

/**
 * WaveFunctionGraphNode is the view for the wave function graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QuantumStateGraph from '../model/QuantumStateGraph.js';
import WaveFunctionGraph from '../model/WaveFunctionGraph.js';
import QBSColors from '../QBSColors.js';
import QBSConstants from '../QBSConstants.js';
import EquationTermNode from './EquationTermNode.js';
import PhasePlot from './PhasePlot.js';
import QuantumStateGraphNode, { QuantumStateGraphNodeOptions } from './QuantumStateGraphNode.js';
import YLinePlot from './YLinePlot.js';

type SelfOptions = EmptySelfOptions;

type WaveFunctionGraphNodeOptions = SelfOptions & Pick<QuantumStateGraphNodeOptions, 'createEquationDetailsButton' | 'tandem'>;

export default class WaveFunctionGraphNode extends QuantumStateGraphNode {

  public constructor( waveFunctionGraph: WaveFunctionGraph,
                      quantumStateGraphProperty: TReadOnlyProperty<QuantumStateGraph>,
                      selectedEnergyLevelProperty: TReadOnlyProperty<number>,
                      curvesVisibleProperty: TReadOnlyProperty<boolean>,
                      providedOptions: WaveFunctionGraphNodeOptions ) {

    const options = optionize<WaveFunctionGraphNodeOptions, SelfOptions, QuantumStateGraphNodeOptions>()( {

      // Options related to the y-axis.
      yAxisLabelStringProperty: QuantumBoundStatesFluent.waveFunctionStringProperty,
      yRange: QBSConstants.WAVEFUNCTION_GRAPH_Y_RANGE,
      yTickSpacing: 0.5,
      yTickLabelDecimals: 1,

      // Visible when this graph is selected.
      visibleProperty: new DerivedProperty( [ quantumStateGraphProperty ], graph => graph === waveFunctionGraph ),

      // Core-description options for this graph.
      accessibleHeading: QuantumBoundStatesFluent.a11y.waveFunctionGraph.accessibleHeadingStringProperty,
      accessibleParagraph: QuantumBoundStatesFluent.a11y.waveFunctionGraph.accessibleParagraphStringProperty
    }, providedOptions );

    // If we do not have a button for showing equation details, then show a mathematical term in the top-right corner
    // of the chartRectangle. The term corresponds to the selected energy level.
    if ( !options.createEquationDetailsButton ) {
      options.createEquationTermNode = tandem => EquationTermNode.waveFunctionTerm( selectedEnergyLevelProperty, tandem );
    }

    super( curvesVisibleProperty, options );

    const initialYValues = new Array( waveFunctionGraph.xGrid.xCoordinates.length ).fill( 0 );
    const xCoordinates = waveFunctionGraph.xGrid.xCoordinates;

    // Real Part
    const realPartPlot = new YLinePlot( this.chartTransform, xCoordinates, initialYValues, {
      stroke: QBSColors.realPartStrokeProperty,
      lineWidth: 2,
      visibleProperty: waveFunctionGraph.realPartVisibleProperty
    } );
    waveFunctionGraph.realPartValuesProperty.link( values => realPartPlot.setYCoordinates( values ) );

    // Imaginary Part
    const imaginaryPartPlot = new YLinePlot( this.chartTransform, xCoordinates, initialYValues, {
      stroke: QBSColors.imaginaryPartStrokeProperty,
      lineWidth: 2,
      visibleProperty: waveFunctionGraph.imaginaryPartVisibleProperty
    } );
    waveFunctionGraph.imaginaryPartValuesProperty.link( values => imaginaryPartPlot.setYCoordinates( values ) );

    // Magnitude
    const magnitudePlot = new YLinePlot( this.chartTransform, xCoordinates, initialYValues, {
      stroke: QBSColors.magnitudeStrokeProperty,
      lineWidth: 2,
      visibleProperty: waveFunctionGraph.magnitudeVisibleProperty
    } );
    waveFunctionGraph.magnitudeValuesProperty.link( values => magnitudePlot.setYCoordinates( values ) );

    // Phase
    const phasePlot = new PhasePlot( this.chartTransform, xCoordinates, initialYValues, initialYValues, {
      visibleProperty: waveFunctionGraph.phaseVisibleProperty
    } );
    //TODO This assumes that waveFunctionGraph.magnitudeValuesProperty has been updated, which is an order dependency.
    Multilink.multilink( [ waveFunctionGraph.phaseVisibleProperty, waveFunctionGraph.phaseValuesProperty ],
      ( phaseVisible, phaseValues ) => {
        if ( phaseVisible ) {
          phasePlot.setDataSet( waveFunctionGraph.magnitudeValuesProperty.value, phaseValues );
        }
      } );

    // Rendering order
    this.addPlot( phasePlot );
    this.addPlot( magnitudePlot );
    this.addPlot( imaginaryPartPlot );
    this.addPlot( realPartPlot );

    waveFunctionGraph.yAxisRangeProperty.link( yAxisRange => {
      this.setYRange( yAxisRange.dilated( QBSConstants.QUANTUM_STATE_GRAPHS_Y_RANGE_DILATION ) );
      this.setYTickSpacing( yAxisRange.max );
    } );
  }
}
