// Copyright 2026, University of Colorado Boulder

/**
 * WaveFunctionGraphNode is the view for the wave function graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSModel from '../model/QBSModel.js';
import QBSColors from '../QBSColors.js';
import QBSConstants from '../QBSConstants.js';
import EquationTermNode from './EquationTermNode.js';
import QuantumStateGraphNode, { QuantumStateGraphNodeOptions } from './QuantumStateGraphNode.js';
import YLinePlot from './YLinePlot.js';

type SelfOptions = EmptySelfOptions;

type WaveFunctionGraphNodeOptions = SelfOptions & Pick<QuantumStateGraphNodeOptions, 'createEquationDetailsButton' | 'tandem'>;

export default class WaveFunctionGraphNode extends QuantumStateGraphNode {

  //TODO Reduce coupling with QBSModel
  public constructor( model: QBSModel, providedOptions: WaveFunctionGraphNodeOptions ) {

    const options = optionize<WaveFunctionGraphNodeOptions, SelfOptions, QuantumStateGraphNodeOptions>()( {

      // Options related to the y-axis.
      yAxisLabelStringProperty: QuantumBoundStatesFluent.waveFunctionStringProperty,
      yRange: QBSConstants.WAVEFUNCTION_GRAPH_Y_RANGE,
      yTickSpacing: 0.5,
      yTickLabelDecimals: 1,

      // Visible when this graph is selected.
      visibleProperty: new DerivedProperty( [ model.quantumStateGraphProperty ], graph => graph === model.waveFunctionGraph ),

      // Core-description options for this graph.
      accessibleHeading: QuantumBoundStatesFluent.a11y.waveFunctionGraph.accessibleHeadingStringProperty,
      accessibleParagraph: QuantumBoundStatesFluent.a11y.waveFunctionGraph.accessibleParagraphStringProperty
    }, providedOptions );

    // If we do not have a button for showing equation details, then show a mathematical term in the top-right corner
    // of the chartRectangle. The term corresponds to the selected energy level.
    if ( !options.createEquationDetailsButton ) {
      options.createEquationTermNode = tandem => EquationTermNode.waveFunctionTerm( model.energyLevelProperty, tandem );
    }

    super( model.curvesVisibleProperty, options );

    const initialYValues = new Array( model.xGrid.xCoordinates.length ).fill( 0 );

    // Real Part
    const realPartPlot = new YLinePlot( this.chartTransform, model.xGrid.xCoordinates, initialYValues, {
      stroke: QBSColors.realPartStrokeProperty,
      lineWidth: 2,
      visibleProperty: model.waveFunctionGraph.realPartVisibleProperty
    } );
    model.waveFunctionGraph.realPartValuesProperty.link( values => realPartPlot.setYCoordinates( values ) );

    // Imaginary Part
    const imaginaryPartPlot = new YLinePlot( this.chartTransform, model.xGrid.xCoordinates, initialYValues, {
      stroke: QBSColors.imaginaryPartStrokeProperty,
      lineWidth: 2,
      visibleProperty: model.waveFunctionGraph.imaginaryPartVisibleProperty
    } );
    model.waveFunctionGraph.imaginaryPartValuesProperty.link( values => imaginaryPartPlot.setYCoordinates( values ) );

    //TODO const phasePlot = ...  See PhaseRenderer.java

    // Magnitude
    const magnitudePlot = new YLinePlot( this.chartTransform, model.xGrid.xCoordinates, initialYValues, {
      stroke: QBSColors.magnitudeStrokeProperty,
      lineWidth: 2,
      visibleProperty: model.waveFunctionGraph.magnitudeVisibleProperty
    } );
    model.waveFunctionGraph.magnitudeValuesProperty.link( values => magnitudePlot.setYCoordinates( values ) );

    // Rendering order
    //TODO this.addPlot( phasePlot );
    this.addPlot( magnitudePlot );
    this.addPlot( imaginaryPartPlot );
    this.addPlot( realPartPlot );

    model.waveFunctionGraph.yAxisRangeProperty.link( yAxisRange => {
      this.setYRange( yAxisRange.dilated( QBSConstants.QUANTUM_STATE_GRAPHS_Y_RANGE_DILATION ) );
      this.setYTickSpacing( yAxisRange.max );
    } );
  }
}
