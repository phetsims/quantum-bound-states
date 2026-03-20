// Copyright 2026, University of Colorado Boulder

/**
 * Time is the model of simulation time. Real time (seconds) is transformed to simulation time (femtoseconds).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { femtosecondsUnit } from './units/femtosecondsUnit.js';

export default class Time {

  // Whether the simulation is currently playing.
  public readonly isPlayingProperty: Property<boolean>;

  // The current time, in femtoseconds.
  private readonly _currentTimeProperty: Property<number>;
  public readonly currentTimeProperty: TReadOnlyProperty<number>;

  // Scale factor that is applied to time while the simulation is playing.
  // Values > 1 make the sim run faster, values < 1 make it run slower.
  public readonly timeScaleProperty: NumberProperty;

  // Whether time is visible.
  public readonly timeVisibleProperty: Property<boolean>;

  // Conversion of real time (seconds) to simulation time (femtoseconds).
  public static readonly FEMTOSECONDS_PER_SECOND = 1;

  // How much to step time forward (in femtoseconds) when the user presses the 'Step Forward' button.
  public static readonly STEP_FORWARD_DELTA = 1;

  public constructor( tandem: Tandem ) {

    this.isPlayingProperty = new BooleanProperty( false, {  //TODO defaults should be true
      tandem: tandem.createTandem( 'isPlayingProperty' ),
      phetioFeatured: true
    } );

    this._currentTimeProperty = new NumberProperty( 0, {
      units: femtosecondsUnit,
      numberType: 'FloatingPoint',
      isValidValue: time => time >= 0,
      tandem: tandem.createTandem( 'currentTimeProperty' ),
      phetioFeatured: true,
      phetioReadOnly: true
    } );
    this.currentTimeProperty = this._currentTimeProperty;

    //TODO Java used constant dts of [ 0.01, 0.1, 1, 10 ], which is problematic with a linear slider.
    const validValues = _.sortBy( [ 1, 2, 3, 4 ] );
    this.timeScaleProperty = new NumberProperty( 1, {
      validValues: validValues,
      range: new Range( validValues[ 0 ], validValues[ validValues.length - 1 ] ),
      isValidValue: timeScale => timeScale > 0,
      numberType: 'FloatingPoint',
      tandem: tandem.createTandem( 'timeScaleProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'The factor by which time is sped up (> 1) or slowed down (< 1).'
    } );

    this.timeVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'timeVisibleProperty' )
    } );
  }

  public reset(): void {
    this._currentTimeProperty.reset();
    this.isPlayingProperty.reset();
    this.timeScaleProperty.reset();
    this.timeVisibleProperty.reset();
  }

  /**
   * Steps time.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    this._currentTimeProperty.value += Time.FEMTOSECONDS_PER_SECOND * dt * this.timeScaleProperty.value;
  }

  /**
   * Steps time forward by one step, called when the user presses the 'Step Forward' button.
   */
  public stepForward(): void {
    this._currentTimeProperty.value += Time.STEP_FORWARD_DELTA;
  }

  /**
   * Restart time, called when the user presses the 'Restart' button.
   */
  public restart(): void {
    this._currentTimeProperty.reset();
  }
}
