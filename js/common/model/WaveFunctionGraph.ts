// Copyright 2026, University of Colorado Boulder

/**
 * WaveFunctionGraph is the model for the wave function graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSQueryParameters from '../QBSQueryParameters.js';
import QBSModel from './QBSModel.js';
import QuantumStateGraph from './QuantumStateGraph.js';
import XGrid from './solver/XGrid.js';

export default class WaveFunctionGraph extends QuantumStateGraph {

  // x-axis values
  public readonly xGrid: XGrid;

  // y-axis values for plotting components of the time-dependent wave function
  public readonly realPartValuesProperty: TReadOnlyProperty<number[]>;
  public readonly imaginaryPartValuesProperty: TReadOnlyProperty<number[]>;
  public readonly magnitudeValuesProperty: TReadOnlyProperty<number[]>;
  public readonly phaseValuesProperty: TReadOnlyProperty<number[]>;

  // Visibility of the wave function components
  public readonly realPartVisibleProperty: Property<boolean>;
  public readonly imaginaryPartVisibleProperty: Property<boolean>;
  public readonly magnitudeVisibleProperty: Property<boolean>;
  public readonly phaseVisibleProperty: Property<boolean>;

  // Range for the y-axis
  public readonly yAxisRangeProperty: TReadOnlyProperty<Range>;

  //TODO Reduce coupling with QBSModel
  public constructor( model: QBSModel, tandem: Tandem ) {

    super( tandem );

    this.xGrid = model.xGrid;

    this.realPartValuesProperty = model.realPartValuesProperty;
    this.imaginaryPartValuesProperty = model.imaginaryPartValuesProperty;
    this.magnitudeValuesProperty = model.magnitudeValuesProperty;
    this.phaseValuesProperty = model.phaseValuesProperty;

    this.realPartVisibleProperty = new BooleanProperty( QBSQueryParameters.realPartVisible, {
      tandem: tandem.createTandem( 'realPartVisibleProperty' ),
      phetioFeatured: true
    } );

    this.imaginaryPartVisibleProperty = new BooleanProperty( QBSQueryParameters.imaginaryPartVisible, {
      tandem: tandem.createTandem( 'imaginaryPartVisibleProperty' ),
      phetioFeatured: true
    } );

    this.magnitudeVisibleProperty = new BooleanProperty( QBSQueryParameters.magnitudeVisible, {
      tandem: tandem.createTandem( 'magnitudeVisibleProperty' ),
      phetioFeatured: true
    } );

    this.phaseVisibleProperty = new BooleanProperty( QBSQueryParameters.phaseVisible, {
      tandem: tandem.createTandem( 'phaseVisibleProperty' ),
      phetioFeatured: true
    } );

    // Use the maximum time-independent wave function value to set the y-axis range.
    this.yAxisRangeProperty = new DerivedProperty( [ model.selectedWaveFunctionValuesProperty ],
      selectedWaveFunctionValues => {
        //TODO It may be more performant to return maxAbsY as part of BoundStateResult
        const minY = Math.min( ...selectedWaveFunctionValues );
        const maxY = Math.max( ...selectedWaveFunctionValues );
        const maxAbsY = Math.max( Math.abs( minY ), Math.abs( maxY ) );
        return new Range( -maxAbsY, maxAbsY );
      } );
  }

  public override reset(): void {
    super.reset();
    this.realPartVisibleProperty.reset();
    this.imaginaryPartVisibleProperty.reset();
    this.magnitudeVisibleProperty.reset();
    this.phaseVisibleProperty.reset();
  }
}
