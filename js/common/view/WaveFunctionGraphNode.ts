// Copyright 2026, University of Colorado Boulder

/**
 * WaveFunctionGraphNode is the view for the wave function graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSModel from '../model/QBSModel.js';
import QBSColors from '../QBSColors.js';
import QBSConstants from '../QBSConstants.js';
import QuantumStateGraphNode, { QuantumStateGraphNodeOptions } from './QuantumStateGraphNode.js';
import WaveFunctionDetailsDialog from './WaveFunctionDetailsDialog.js';
import YLinePlot from './YLinePlot.js';

export default class WaveFunctionGraphNode extends QuantumStateGraphNode {

  public constructor( model: QBSModel, tandem: Tandem ) {

    const options: QuantumStateGraphNodeOptions = {

      // Options related to the y-axis.
      yAxisLabelStringProperty: QuantumBoundStatesFluent.waveFunctionStringProperty,
      yRange: QBSConstants.WAVEFUNCTION_GRAPH_Y_RANGE,
      yTickSpacing: 0.5,
      yTickLabelDecimals: 1,

      // Visible when this graph is selected.
      visibleProperty: new DerivedProperty( [ model.quantumStateGraphProperty ], graph => graph === model.waveFunctionGraph ),

      // Core-description options for this graph.
      accessibleHeading: QuantumBoundStatesFluent.a11y.graphs.waveFunctionGraph.accessibleHeadingStringProperty,
      accessibleParagraph: QuantumBoundStatesFluent.a11y.graphs.waveFunctionGraph.accessibleParagraphStringProperty,

      // Options for the button that opens a dialog that shows the expanded equation.
      functionDetailsButtonOptions: {
        listener: () => new WaveFunctionDetailsDialog().show(),
        labelStringProperty: QuantumBoundStatesFluent.functionDetailsButton.waveFunctionStringProperty,
        accessibleName: QuantumBoundStatesFluent.a11y.functionDetailsButton.waveFunction.accessibleNameStringProperty,
        accessibleHelpText: QuantumBoundStatesFluent.a11y.functionDetailsButton.waveFunction.accessibleHelpTextStringProperty,
        accessibleContextResponse: QuantumBoundStatesFluent.a11y.functionDetailsButton.waveFunction.accessibleContextResponseStringProperty
      },
      tandem: tandem
    };

    super( model.curvesVisibleProperty, options );

    //TODO temporary dataset for wave function
    const buildYCoordinates = (): number[] => {
      const groundStateIndex = model.potentialProperty.value.getGroundStateIndex();
      const waveFunctionIndex = model.energyLevelProperty.value - groundStateIndex;
      const waveFunctions = model.boundStateResultProperty.value.waveFunctions;
      if ( waveFunctionIndex < 0 || waveFunctionIndex >= waveFunctions.length ) {
        return new Array( model.energyDiagram.xGrid.xCoordinates.length ).fill( 0 ); //TODO temporary
      }
      else {
        return waveFunctions[ waveFunctionIndex ];
      }
    };

    const waveFunctionPlot = new YLinePlot( this.chartTransform, model.xGrid.xCoordinates, buildYCoordinates(), {
      stroke: QBSColors.realPartStrokeProperty,
      lineWidth: 2
    } );
    this.curveLayer.addChild( waveFunctionPlot );

    // Update the plot when the selected energy level or the bound-state result changes.
    model.energyLevelProperty.link( () => { waveFunctionPlot.setYCoordinates( buildYCoordinates() ); } );
    model.boundStateResultProperty.link( () => { waveFunctionPlot.setYCoordinates( buildYCoordinates() ); } );
  }
}
