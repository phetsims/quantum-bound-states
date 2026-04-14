// Copyright 2026, University of Colorado Boulder

/**
 * WaveFunctionGraphNode is the view for the wave function graph.
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

type WaveFunctionGraphNodeOptions = SelfOptions & Pick<QuantumStateGraphNodeOptions, 'createEquationDetailsButton' | 'tandem'>;

export default class WaveFunctionGraphNode extends QuantumStateGraphNode {

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
      accessibleHeading: QuantumBoundStatesFluent.a11y.graphs.waveFunctionGraph.accessibleHeadingStringProperty,
      accessibleParagraph: QuantumBoundStatesFluent.a11y.graphs.waveFunctionGraph.accessibleParagraphStringProperty
    }, providedOptions );

    super( model.curvesVisibleProperty, options );

    // Computes the y-coordinates for the wave function plot.
    const computeYCoordinates = (): number[] => {
      const groundStateIndex = model.potentialProperty.value.getGroundStateIndex();
      const waveFunctionsIndex = model.energyLevelProperty.value - groundStateIndex;
      const waveFunctions = model.boundStateResultProperty.value.waveFunctions;
      affirm( waveFunctionsIndex >= 0 && waveFunctions.length, `waveFunctionIndex out of range: ${waveFunctionsIndex}` );
      return waveFunctions[ waveFunctionsIndex ];
    };

    const waveFunctionPlot = new YLinePlot( this.chartTransform, model.xGrid.xCoordinates, computeYCoordinates(), {
      stroke: QBSColors.realPartStrokeProperty,
      lineWidth: 2
    } );
    this.curveLayer.addChild( waveFunctionPlot );

    // Update the plot when the selected energy level or the bound-state result changes.
    const updateWaveFunctionPlot = () => {
      const yCoordinates = computeYCoordinates();

      // Change the y-axis range and tick marks to fit the entire curve.
      const minY = Math.min( ...yCoordinates );
      const maxY = Math.max( ...yCoordinates );
      const maxAbsY = Math.max( Math.abs( minY ), Math.abs( maxY ) );
      this.setYRange( new Range( -maxAbsY, maxAbsY ).dilated( QBSConstants.QUANTUM_STATE_GRAPHS_Y_RANGE_DILATION ) );
      this.setYTickSpacing( maxY );
    };
    model.energyLevelProperty.link( updateWaveFunctionPlot );
    model.boundStateResultProperty.link( updateWaveFunctionPlot );
  }
}
