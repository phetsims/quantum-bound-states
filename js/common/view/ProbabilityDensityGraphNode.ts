// Copyright 2026, University of Colorado Boulder

/**
 * ProbabilityDensityGraphNode is the view for the 'Probability Density' graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import Range from '../../../../dot/js/Range.js';
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

  //TODO Reduce coupling with QBSModel
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
      accessibleHeading: QuantumBoundStatesFluent.a11y.probabilityDensityGraph.accessibleHeadingStringProperty,
      accessibleParagraph: QuantumBoundStatesFluent.a11y.probabilityDensityGraph.accessibleParagraphStringProperty
    }, providedOptions );

    // If we do not have a button for showing equation details, then show a mathematical term in the top-right corner
    // of the chartRectangle. The term corresponds to the selected energy level.
    if ( !options.createEquationDetailsButton ) {
      options.termStringProperty = new DerivedStringProperty( [ model.energyLevelProperty ],
        energyLevel => `|Ψ<sub>${energyLevel}</sub>(x,t)|<sup>2</sup>` );
    }

    super( model.curvesVisibleProperty, options );

    const probabilityDensityPlot = new YLinePlot( this.chartTransform, model.xGrid.xCoordinates,
      model.probabilityDensityGraph.probabilityDensityValuesProperty.value, {
      stroke: QBSColors.probabilityDensityStrokeProperty,
      lineWidth: 2
    } );

    this.curveLayer.addChild( probabilityDensityPlot );

    model.probabilityDensityGraph.probabilityDensityValuesProperty.lazyLink( probabilityDensityValues => {
      probabilityDensityPlot.setYCoordinates( probabilityDensityValues );

      // Change y-axis range and tick marks to fit the entire curve.
      const maxY = Math.max( ...probabilityDensityValues );
      this.setYRange( new Range( 0, maxY + QBSConstants.QUANTUM_STATE_GRAPHS_Y_RANGE_DILATION ) );
      this.setYTickSpacing( maxY );
    } );
  }
}
