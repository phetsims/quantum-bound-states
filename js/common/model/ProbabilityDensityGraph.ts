// Copyright 2026, University of Colorado Boulder

/**
 * ProbabilityDensityGraph is the model for the 'Probability Density' graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSModel from './QBSModel.js';
import QuantumStateGraph from './QuantumStateGraph.js';
import XGrid from './solvers/XGrid.js';
import { TimeEvolvedSuperposition } from './TimeEvolvedSuperposition.js';

export default class ProbabilityDensityGraph extends QuantumStateGraph {

  // x-axis values
  public readonly xGrid: XGrid;

  // y-axis values for plotting the time-dependent probability density
  public readonly timeEvolvedSuperpositionProperty: TReadOnlyProperty<TimeEvolvedSuperposition>;

  // Range for the y-axis
  public readonly yRangeProperty: TReadOnlyProperty<Range>;

  // Number of nodes in the displayed Probability Density curve.
  public readonly numberOfNodesProperty: TReadOnlyProperty<number>;

  public constructor( model: QBSModel, tandem: Tandem ) {

    super( {
      accessibleNameProperty: QuantumBoundStatesFluent.probabilityDensityStringProperty,
      tandem: tandem
    } );

    this.xGrid = model.xGrid;
    this.timeEvolvedSuperpositionProperty = model.timeEvolvedSuperpositionProperty;
    this.numberOfNodesProperty = model.numberOfNodesProperty;

    // Use the maximum time-independent wave function solution to set the y-axis range.
    this.yRangeProperty = new DerivedProperty( [ model.selectedEnergyLevelIndexProperty, model.boundStateResultProperty ],
      ( selectedEnergyLevelIndex, boundStateResult ) => model.getProbabilityDensityRangeForEnergyLevel( selectedEnergyLevelIndex ) );
  }
}
