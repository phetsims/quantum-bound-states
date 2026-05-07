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
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { femtosecondsUnit } from './units/femtosecondsUnit.js';

const TIME_STEP_VALUES = [ 0.01, 0.1, 1, 10 ];
affirm( _.every( TIME_STEP_VALUES, value => value > 0 ), 'TIME_STEP_VALUES must be > 0' );

const TIME_DECIMAL_PLACES = [ 2, 1, 0, 0 ];
affirm( _.every( TIME_DECIMAL_PLACES, value => Number.isInteger( value ) && value >= 0 ), 'TIME_DECIMAL_PLACES must be integers >= 0' );
affirm( TIME_DECIMAL_PLACES.length === TIME_STEP_VALUES.length, 'TIME_DECIMAL_PLACES and TIME_STEP_VALUES must have the same length' );


export default class Time {

  // Whether the simulation is currently playing.
  public readonly isPlayingProperty: Property<boolean>;

  // The current time, in femtoseconds.
  private readonly _currentTimeProperty: Property<number>;
  public readonly currentTimeProperty: TReadOnlyProperty<number>;

  // Selects the time step from TIME_STEP_VALUES.
  public readonly timeStepIndexProperty: NumberProperty;

  // Whether time is visible.
  public readonly timeVisibleProperty: Property<boolean>;

  // Conversion of real time (seconds) to simulation time (femtoseconds).
  // Larger values make the simulation time increase faster.
  public static readonly FEMTOSECONDS_PER_SECOND = 25;

  // How much to step time forward (in femtoseconds) when the user presses the 'Step Forward' button.
  public static readonly STEP_FORWARD_DELTA = 1;

  public constructor( tandem: Tandem ) {

    this.isPlayingProperty = new BooleanProperty( true, {
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

    this.timeStepIndexProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      range: new Range( 0, TIME_STEP_VALUES.length - 1 ),
      validValues: [ ...TIME_STEP_VALUES.keys() ],
      tandem: tandem.createTandem( 'timeStepIndexProperty' ),
      phetioFeatured: true
    } );

    // When the time step is changed, reset the current time to zero.
    this.timeStepIndexProperty.link( () => this._currentTimeProperty.reset() );

    this.timeVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'timeVisibleProperty' )
    } );
  }

  public getDecimalPlaces(): number {
    return TIME_DECIMAL_PLACES[ this.timeStepIndexProperty.value ];
  }

  private getTimeStep(): number {
    return TIME_STEP_VALUES[ this.timeStepIndexProperty.value ];
  }

  public reset(): void {
    this._currentTimeProperty.reset();
    this.isPlayingProperty.reset();
    this.timeStepIndexProperty.reset();
    this.timeVisibleProperty.reset();
  }

  /**
   * Steps time.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    this._currentTimeProperty.value += ( Time.FEMTOSECONDS_PER_SECOND * dt * this.getTimeStep() );
  }

  /**
   * Steps time forward by one step, called when the user presses the 'Step Forward' button.
   */
  public stepForward(): void {
    this._currentTimeProperty.value += this.getTimeStep();
  }

  /**
   * Restart time, called when the user presses the 'Restart' button.
   */
  public restart(): void {
    this._currentTimeProperty.reset();
  }
}
