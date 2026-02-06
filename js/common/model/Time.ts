// Copyright 2026, University of Colorado Boulder

/**
 * Time is the model of the simulation clock, which controls the passage of time.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';

export default class Time {

  private readonly _currentTimeProperty: Property<number>;
  public readonly currentTimeProperty: TReadOnlyProperty<number>;

  public readonly isPlayingProperty: Property<boolean>;
  public readonly timeScaleProperty: Property<number>;

  // Conversion of real time (seconds) to simulation time (femtoseconds).
  public static readonly FEMTOSECONDS_PER_SECOND = 1;

  public static readonly STEP_FORWARD_DELTA = 1; // fs

  public constructor( tandem: Tandem ) {

    this._currentTimeProperty = new NumberProperty( 0, {
      units: 'fs',
      numberType: 'FloatingPoint',
      isValidValue: time => time >= 0,
      tandem: tandem.createTandem( 'currentTimeProperty' ),
      phetioFeatured: true,
      phetioReadOnly: true
    } );
    this.currentTimeProperty = this._currentTimeProperty;

    this.isPlayingProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isPlayingProperty' ),
      phetioFeatured: true
    } );

    this.timeScaleProperty = new NumberProperty( 1, {
      validValues: [ 1, 2, 3, 4 ],
      numberType: 'FloatingPoint',
      tandem: tandem.createTandem( 'timeScaleProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'The factor by which time is sped up (> 1) or slowed down (< 1).'
    } );
  }

  public reset(): void {
    this._currentTimeProperty.reset();
    this.isPlayingProperty.reset();
    this.timeScaleProperty.reset();
  }

  /**
   * Steps time.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    this._currentTimeProperty.value += Time.FEMTOSECONDS_PER_SECOND * dt * this.timeScaleProperty.value;
  }

  /**
   * Steps time forward by one step.
   */
  public stepForward(): void {
    this._currentTimeProperty.value += Time.STEP_FORWARD_DELTA;
  }

  /**
   * Restart time, setting it back to zero.
   */
  public restart(): void {
    this._currentTimeProperty.reset();
  }
}

quantumBoundStates.register( 'Time', Time );