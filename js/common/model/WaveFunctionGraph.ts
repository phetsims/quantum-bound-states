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
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSQueryParameters from '../QBSQueryParameters.js';
import QBSModel from './QBSModel.js';
import QuantumStateGraph from './QuantumStateGraph.js';
import XGrid from './solvers/XGrid.js';
import { TimeEvolvedSuperposition } from './TimeEvolvedSuperposition.js';

export default class WaveFunctionGraph extends QuantumStateGraph {

  // x-axis values
  public readonly xGrid: XGrid;

  // y-axis values for plotting components of the time-dependent wave function
  public readonly timeEvolvedSuperpositionProperty: TReadOnlyProperty<TimeEvolvedSuperposition>;

  // Wave function components that are selected for display. They may or may not be visible based on other settings.
  public readonly realPartSelectedProperty: Property<boolean>;
  public readonly imaginaryPartSelectedProperty: Property<boolean>;
  public readonly magnitudeSelectedProperty: Property<boolean>;
  public readonly phaseSelectedProperty: Property<boolean>;

  // Range for the y-axis
  public readonly yAxisRangeProperty: TReadOnlyProperty<Range>;

  //TODO Reduce coupling with QBSModel
  public constructor( model: QBSModel, tandem: Tandem ) {

    super( {
      accessibleNameProperty: QuantumBoundStatesFluent.a11y.waveFunctionGraph.accessibleHeadingStringProperty,
      tandem: tandem
    } );

    this.xGrid = model.xGrid;

    this.timeEvolvedSuperpositionProperty = model.timeEvolvedSuperpositionProperty;

    this.realPartSelectedProperty = new BooleanProperty( QBSQueryParameters.realPartSelected, {
      tandem: tandem.createTandem( 'realPartSelectedProperty' ),
      phetioFeatured: true
    } );

    this.imaginaryPartSelectedProperty = new BooleanProperty( QBSQueryParameters.imaginaryPartSelected, {
      tandem: tandem.createTandem( 'imaginaryPartSelectedProperty' ),
      phetioFeatured: true
    } );

    this.magnitudeSelectedProperty = new BooleanProperty( QBSQueryParameters.magnitudeSelected, {
      tandem: tandem.createTandem( 'magnitudeSelectedProperty' ),
      phetioFeatured: true
    } );

    this.phaseSelectedProperty = new BooleanProperty( QBSQueryParameters.phaseSelected, {
      tandem: tandem.createTandem( 'phaseSelectedProperty' ),
      phetioFeatured: true
    } );

    // Use the maximum time-independent wave function value to set the y-axis range.
    this.yAxisRangeProperty = new DerivedProperty( [ model.selectedWaveFunctionValuesProperty ],
      selectedWaveFunctionValues => {
        //TODO It may be more performant to return maxAbsY as part of BoundStateResult
        const minY = Math.min( ...selectedWaveFunctionValues );
        const maxY = Math.max( ...selectedWaveFunctionValues );
        const maxAbsY = Math.max( Math.abs( minY ), Math.abs( maxY ) );

        // Guard against maxAbsY === 0, which occurs when the wave function is all zeros
        // (e.g. the placeholder used for the no-bound-state edge case, see
        // https://github.com/phetsims/quantum-bound-states/issues/56). A degenerate
        // Range(0,0) propagates to setYTickSpacing(0), crashing bamboo's forEachSpacing with NaN.
        const safeMaxAbsY = ( maxAbsY > 0 && Number.isFinite( maxAbsY ) ) ? maxAbsY : 1;
        return new Range( -safeMaxAbsY, safeMaxAbsY );
      } );
  }

  public override reset(): void {
    super.reset();
    this.realPartSelectedProperty.reset();
    this.imaginaryPartSelectedProperty.reset();
    this.magnitudeSelectedProperty.reset();
    this.phaseSelectedProperty.reset();
  }
}
