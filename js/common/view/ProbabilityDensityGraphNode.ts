// Copyright 2026, University of Colorado Boulder

/**
 * ProbabilityDensityGraphNode is the view for the 'Probability Density' graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import LinePlot from '../../../../bamboo/js/LinePlot.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSModel from '../model/QBSModel.js';
import QBSColors from '../QBSColors.js';
import QBSConstants from '../QBSConstants.js';
import ProbabilityDensityDetailsDialog from './ProbabilityDensityDetailsDialog.js';
import QuantumStateGraphNode, { QuantumStateGraphNodeOptions } from './QuantumStateGraphNode.js';

export default class ProbabilityDensityGraphNode extends QuantumStateGraphNode {

  public constructor( model: QBSModel, tandem: Tandem ) {

    const options: QuantumStateGraphNodeOptions = {

      // Options related to the y-axis.
      yAxisLabelStringProperty: QuantumBoundStatesFluent.probabilityDensityStringProperty,
      yRange: QBSConstants.PROBABILITY_DENSITY_GRAPH_Y_RANGE,
      yTickSpacing: 0.5,
      yTickLabelDecimals: 1,

      // Visible when this graph is selected.
      visibleProperty: new DerivedProperty( [ model.quantumStateGraphProperty ], graph => graph === model.probabilityDensityGraph ),

      // Core-description options for this graph.
      accessibleHeading: QuantumBoundStatesFluent.a11y.graphs.probabilityDensityGraph.accessibleHeadingStringProperty,
      accessibleParagraph: QuantumBoundStatesFluent.a11y.graphs.probabilityDensityGraph.accessibleParagraphStringProperty,

      // Options for the button that opens a dialog that shows the expanded equation.
      functionDetailsButtonOptions: {
        listener: () => new ProbabilityDensityDetailsDialog().show(),
        labelStringProperty: QuantumBoundStatesFluent.functionDetailsButton.probabilityDensityStringProperty,
        accessibleName: QuantumBoundStatesFluent.a11y.functionDetailsButton.probabilityDensity.accessibleNameStringProperty,
        accessibleHelpText: QuantumBoundStatesFluent.a11y.functionDetailsButton.probabilityDensity.accessibleHelpTextStringProperty,
        accessibleContextResponse: QuantumBoundStatesFluent.a11y.functionDetailsButton.probabilityDensity.accessibleContextResponseStringProperty
      },
      tandem: tandem
    };

    super( model.curvesVisibleProperty, options );

    //TODO Create a Plot that takes a fixed set of x-coordinates and variable set of y-coordinates.
    const probabilityDensityDataSet: Vector2[] = [];
    const groundStateWaveFunction = model.energyDiagram.boundStateResultProperty.value.waveFunctions[ 0 ];
    groundStateWaveFunction.forEach( ( value, i ) => {
      const x = model.energyDiagram.xGrid.xCoordinates[ i ];
      probabilityDensityDataSet.push( new Vector2( x, value * value ) );
    } );

    const probabilityDensityPlot = new LinePlot( this.chartTransform, probabilityDensityDataSet, {
      stroke: QBSColors.probabilityDensityStrokeProperty,
      lineWidth: 2
    } );

    this.curveLayer.addChild( probabilityDensityPlot );
  }
}
