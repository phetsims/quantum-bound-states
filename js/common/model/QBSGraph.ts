// Copyright 2026, University of Colorado Boulder

/**
 * QBSGraph is the base class for graph models in this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';

export default class QBSGraph {

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

quantumBoundStates.register( 'QBSGraph', QBSGraph );