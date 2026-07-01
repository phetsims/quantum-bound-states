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
  public readonly yRangeProperty: TReadOnlyProperty<Range>;

  public constructor( model: QBSModel, tandem: Tandem ) {

    super( {
      accessibleNameProperty: QuantumBoundStatesFluent.waveFunctionStringProperty,
      tandem: tandem
    } );

    this.xGrid = model.xGrid;

    this.timeEvolvedSuperpositionProperty = model.timeEvolvedSuperpositionProperty;

    this.realPartSelectedProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'realPartSelectedProperty' ),
      phetioFeatured: true
    } );

    this.imaginaryPartSelectedProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'imaginaryPartSelectedProperty' ),
      phetioFeatured: true
    } );

    this.magnitudeSelectedProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'magnitudeSelectedProperty' ),
      phetioFeatured: true
    } );

    this.phaseSelectedProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'phaseSelectedProperty' ),
      phetioFeatured: true
    } );

    // Use the maximum time-independent wave function solution to set the y-axis range.
    this.yRangeProperty = new DerivedProperty( [ model.selectedEnergyLevelIndexProperty, model.boundStateResultProperty ],
      ( selectedEnergyLevelIndex, boundStateResult ) => model.getWaveFunctionRangeForEnergyLevel( selectedEnergyLevelIndex ) );
  }

  public override reset(): void {
    super.reset();
    this.realPartSelectedProperty.reset();
    this.imaginaryPartSelectedProperty.reset();
    this.magnitudeSelectedProperty.reset();
    this.phaseSelectedProperty.reset();
  }
}
