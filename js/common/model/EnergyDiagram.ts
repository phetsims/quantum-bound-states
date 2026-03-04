// Copyright 2026, University of Colorado Boulder

/**
 * EnergyDiagram is the model for the 'Energy' diagram.
 * An intentional design decision was to call this a "diagram", not a "graph".
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';

export default class EnergyDiagram {

  // Visibility of values on drag handles and energy lines.
  public readonly valuesVisibleProperty: Property<boolean>;

  public constructor( tandem: Tandem ) {

    this.valuesVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'valuesVisibleProperty' ),
      phetioFeatured: true
    } );
  }

  public reset(): void {
    this.valuesVisibleProperty.reset();
  }
}

quantumBoundStates.register( 'EnergyDiagram', EnergyDiagram );