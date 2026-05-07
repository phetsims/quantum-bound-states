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
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import QBSModel from './QBSModel.js';
import QuantumStateGraph from './QuantumStateGraph.js';

export default class ProbabilityDensityGraph extends QuantumStateGraph {

  public readonly probabilityDensityValuesProperty: TReadOnlyProperty<number[]>;

  // Range for the y-axis
  public readonly yAxisRangeProperty: TReadOnlyProperty<Range>;

  //TODO Reduce coupling with QBSModel
  public constructor( model: QBSModel, tandem: Tandem ) {

    super( tandem );

    this.probabilityDensityValuesProperty = new DerivedProperty(
      [ model.selectedWaveFunctionValuesProperty ],
      selectedWaveFunctionValues => selectedWaveFunctionValues.map( x => x * x ), {
        //TODO units
        tandem: tandem.createTandem( 'probabilityDensityValuesProperty' ),
        phetioValueType: ArrayIO( NumberIO ),
        phetioFeatured: true
      } );

    this.yAxisRangeProperty = new DerivedProperty( [ this.probabilityDensityValuesProperty ],
      probabilityDensityValues => {
        //TODO It may be more performant to return maxAbsY as part of BoundStateResult, then use maxAbsY * maxAbsY here.
        const maxY = Math.max( ...probabilityDensityValues );
        return new Range( 0, maxY );
      } );
  }
}
