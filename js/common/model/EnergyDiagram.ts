// Copyright 2026, University of Colorado Boulder

/**
 * EnergyDiagram is the model for the 'Energy' diagram.
 * An intentional design decision was to call this a "diagram", not a "graph".
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumPotential from './potentials/QuantumPotential.js';
import QBSModel from './QBSModel.js';
import XGrid from './solvers/XGrid.js';

export default class EnergyDiagram extends PhetioObject {

  // x-axis (position) values
  public readonly xGrid: XGrid;

  // y-range (energy range) of the selected potential.
  public readonly yRangeProperty: TReadOnlyProperty<Range>;

  // Visibility of values on drag handles and energy lines.
  public readonly valuesVisibleProperty: Property<boolean>;

  public constructor( model: QBSModel, tandem: Tandem ) {

    super( {
      isDisposable: false,
      tandem: tandem,
      phetioState: false
    } );

    this.xGrid = model.xGrid;

    // Use the y-range of the selected potential.
    this.yRangeProperty = new DynamicProperty<Range, Range, QuantumPotential>( model.potentialProperty, {
      derive: potential => potential.yRangeProperty
      // This is a one-way Property, so do not instrument for PhET-iO, or restoring state will try to set it.
    } );

    // Defaults to false, see https://github.com/phetsims/quantum-bound-states/issues/100.
    this.valuesVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'valuesVisibleProperty' ),
      phetioFeatured: true
    } );
  }

  public reset(): void {
    this.valuesVisibleProperty.reset();
    //TODO Add additional Properties to reset.
  }
}
