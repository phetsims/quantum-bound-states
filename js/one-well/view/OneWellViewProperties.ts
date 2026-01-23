// Copyright 2026, University of Colorado Boulder

/**
 * OneWellViewProperties is the set of view-specific Properties for the 'One Well' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';

export default class OneWellViewProperties {

  public readonly referenceLineVisibleProperty: Property<boolean>;

  public constructor( tandem: Tandem ) {

    this.referenceLineVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'referenceLineVisibleProperty' )
    } );
  }

  public reset(): void {
    this.referenceLineVisibleProperty.reset();
  }
}

quantumBoundStates.register( 'OneWellViewProperties', OneWellViewProperties );
