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

export default class Time {

  public readonly currentTimeProperty: Property<number>;
  public readonly isPlayingProperty: Property<boolean>;
  public readonly timeSpeedFactorProperty: Property<number>;

  // Conversion of real time (seconds) to simulation time (femtoseconds).
  public static readonly FEMTOSECONDS_PER_SECOND = 1;

  public static readonly STEP_FORWARD_DELTA = 1; // fs

  public constructor( tandem: Tandem ) {

    this.currentTimeProperty = new NumberProperty( 0, {
      units: 'fs',
      numberType: 'FloatingPoint',
      isValidValue: time => time >= 0,
      tandem: tandem.createTandem( 'currentTimeProperty' ),
      phetioFeatured: true,
      phetioReadOnly: true
    } );

    this.isPlayingProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isPlayingProperty' ),
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
    this.isPlayingProperty.reset();
    this.timeSpeedFactorProperty.reset();
  }

  public stepForward(): void {
    this.currentTimeProperty.value += Time.STEP_FORWARD_DELTA;
  }
}

quantumBoundStates.register( 'Time', Time );