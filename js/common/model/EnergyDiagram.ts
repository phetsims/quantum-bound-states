// Copyright 2026, University of Colorado Boulder

/**
 * EnergyDiagram is the model for the 'Energy' diagram.
 * An intentional design decision was to call this a "diagram", not a "graph".
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QBSConstants from '../QBSConstants.js';
import QBSQueryParameters from '../QBSQueryParameters.js';
import Potential from './potentials/Potential.js';

export default class EnergyDiagram {

  // Visibility of values on drag handles and energy lines.
  public readonly valuesVisibleProperty: Property<boolean>;

  // Points to approximate the selected potential.
  public readonly potentialPointsProperty: Property<Vector2[]>;

  public constructor( potentialProperty: TReadOnlyProperty<Potential>,
                      tandem: Tandem ) {

    this.valuesVisibleProperty = new BooleanProperty( QBSQueryParameters.valuesVisible, {
      tandem: tandem.createTandem( 'valuesVisibleProperty' ),
      phetioFeatured: true
    } );

    //TODO Temporary
    const xRange = QBSConstants.ALL_GRAPHS_X_RANGE;
    const numberOfPoints = 1000;
    this.potentialPointsProperty = new Property( potentialProperty.value.getPotentialPoints( xRange, numberOfPoints ) );
    potentialProperty.link( potential => {
      this.potentialPointsProperty.value = potential.getPotentialPoints( xRange, numberOfPoints );
    } );
  }

  public reset(): void {
    this.valuesVisibleProperty.reset();
  }
}

quantumBoundStates.register( 'EnergyDiagram', EnergyDiagram );