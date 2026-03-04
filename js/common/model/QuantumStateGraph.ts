// Copyright 2026, University of Colorado Boulder

/**
 * QuantumStateGraph is the base class for graphs that provide a representation of the quantum state.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';

export default class QuantumStateGraph {

  // Whether curves are visible on the graph.
  public readonly curvesVisibleProperty: Property<boolean>;

  protected constructor( tandem: Tandem ) {

    this.curvesVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'curvesVisibleProperty' ),
      phetioFeatured: true
    } );
  }

  public reset(): void {
    this.curvesVisibleProperty.reset();
  }
}

quantumBoundStates.register( 'QuantumStateGraph', QuantumStateGraph );