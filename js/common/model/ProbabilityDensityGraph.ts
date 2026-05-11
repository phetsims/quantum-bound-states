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
import QBSModel from './QBSModel.js';
import QuantumStateGraph from './QuantumStateGraph.js';
import XGrid from './solver/XGrid.js';

export default class ProbabilityDensityGraph extends QuantumStateGraph {

  // x-axis values
  public readonly xGrid: XGrid;

  // y-axis values for plotting the time-dependent probability density
  public readonly probabilityDensityValuesProperty: TReadOnlyProperty<number[]>;

  // Range for the y-axis
  public readonly yAxisRangeProperty: TReadOnlyProperty<Range>;

  //TODO Reduce coupling with QBSModel
  public constructor( model: QBSModel, tandem: Tandem ) {

    super( tandem );

    this.xGrid = model.xGrid;
    this.probabilityDensityValuesProperty = model.probabilityDensityValuesProperty;

    // Use the maximum time-independent probability density to set the y-axis range.
    this.yAxisRangeProperty = new DerivedProperty(
      [ model.selectedWaveFunctionValuesProperty ],
      waveFunctionValues => {
        //TODO It may be more performant to return maxAbsY as part of BoundStateResult, then use maxAbsY * maxAbsY here.
        const maxY = Math.max( ...waveFunctionValues );
        return new Range( 0, maxY * maxY );
      } );
  }
}
