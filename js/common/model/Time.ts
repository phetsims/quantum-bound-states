// Copyright 2026, University of Colorado Boulder

/**
 * Time is the model of the simulation clock, which controls the passage of time.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';

const STEP_ONCE_DELTA = 0.1;

export default class Time {

  public readonly currentTimeProperty: Property<number>;
  public readonly isRunningProperty: Property<boolean>;
  public readonly timeSpeedFactorProperty: Property<number>;

  public constructor( tandem: Tandem ) {

    this.currentTimeProperty = new NumberProperty( 0, {
      units: 'fs',
      numberType: 'FloatingPoint',
      isValidValue: time => time >= 0,
      tandem: tandem.createTandem( 'currentTimeProperty' ),
      phetioFeatured: true,
      phetioReadOnly: true
    } );

    this.isRunningProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isRunningProperty' ),
      phetioFeatured: true
    } );

    this.timeSpeedFactorProperty = new NumberProperty( 1, {
      validValues: [ 1, 2, 3, 4 ],
      numberType: 'FloatingPoint',
      tandem: tandem.createTandem( 'timeSpeedFactorProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'The factor by which time is sped up (> 1) or slowed down (< 1).'
    } );
  }

  public reset(): void {
    this.currentTimeProperty.reset();
    this.isRunningProperty.reset();
    this.timeSpeedFactorProperty.reset();
  }

  public stepOnce(): void {
    this.currentTimeProperty.value += STEP_ONCE_DELTA * this.timeSpeedFactorProperty.value;
  }
}

quantumBoundStates.register( 'Time', Time );