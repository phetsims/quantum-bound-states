// Copyright 2026, University of Colorado Boulder

/**
 * QBSTime is the model of simulation time. Real time (seconds) is transformed to simulation time (femtoseconds).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import { femtosecondsUnit } from '../../../../scenery-phet/js/units/femtosecondsUnit.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';

// Time steps for each time speed.
const TIME_STEP_VALUES = [ 0.01, 0.1, 1, 10, 100 ];
affirm( _.every( TIME_STEP_VALUES, value => value > 0 ), 'TIME_STEP_VALUES must be > 0' );

// Number of decimal places to display for each time speed.
const TIME_DECIMAL_PLACES = [ 2, 1, 0, 0, 0 ];
affirm( _.every( TIME_DECIMAL_PLACES, value => Number.isInteger( value ) && value >= 0 ), 'TIME_DECIMAL_PLACES must be integers >= 0' );
affirm( TIME_DECIMAL_PLACES.length === TIME_STEP_VALUES.length, 'TIME_DECIMAL_PLACES and TIME_STEP_VALUES must have the same length' );

// Conversion of real time (seconds) to simulation time (femtoseconds). Change this to make the sim run faster or slower.
const FEMTOSECONDS_PER_SECOND = 1;

export default class QBSTime extends PhetioObject {

  // Whether the simulation is currently playing.
  public readonly isPlayingProperty: Property<boolean>;

  // The current time, in femtoseconds.
  private readonly _currentTimeProperty: Property<number>;
  public readonly currentTimeProperty: TReadOnlyProperty<number>;

  // Time speed is a 1-based index used to selected values from 0-based TIME_STEP_VALUES and TIME_DECIMAL_PLACES.
  public readonly timeSpeedProperty: NumberProperty;

  // Time step in fs
  public readonly timeStepProperty: TReadOnlyProperty<number>;

  // Whether time is visible.
  public readonly timeVisibleProperty: Property<boolean>;

  // With the three base units for length, mass and energy (nm, m_e, eV), using L = 10^-9, m_e = 9.1093837015e-31, and
  // eV = 1.602176634e-19 the time unit is:
  // t = L * sqrt( m/eV ) = 1 nm * sqrt( 9.1093837015e-31 / 1.602176634e-19 ) = 2.385 x10^-15 sec = 2.385 fs for 1 natural time unit
  // See also https://github.com/phetsims/quantum-bound-states/issues/47
  public static readonly NATURAL_TIME_UNIT_FS = 2.385;

  public constructor( tandem: Tandem ) {

    super( {
      isDisposable: false,
      tandem: tandem,
      phetioState: false
    } );

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

    // timeSpeedProperty values are 1-based.
    const timeSpeedValues = TIME_STEP_VALUES.map( ( value, index ) => index + 1 );

    this.timeSpeedProperty = new NumberProperty( 3, {
      numberType: 'Integer',
      range: new Range( 1, timeSpeedValues.length ),
      validValues: timeSpeedValues,
      tandem: tandem.createTandem( 'timeSpeedProperty' ),
      phetioFeatured: true
    } );

    // When the time speed is changed, reset the current time to zero.
    this.timeSpeedProperty.link( () => {
      if ( !isSettingPhetioStateProperty.value ) {
        this._currentTimeProperty.reset();
      }
    } );

    this.timeStepProperty = new DerivedProperty( [ this.timeSpeedProperty ],
      timeSpeed => TIME_STEP_VALUES[ timeSpeed - 1 ], {
        validValues: TIME_STEP_VALUES,
        tandem: tandem.createTandem( 'timeStepProperty' ),
        phetioValueType: NumberIO,
        phetioFeatured: true
      } );

    this.timeVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'timeVisibleProperty' )
    } );
  }

  public getDecimalPlaces(): number {
    return TIME_DECIMAL_PLACES[ this.timeSpeedProperty.value - 1 ];
  }

  public reset(): void {
    this._currentTimeProperty.reset();
    this.isPlayingProperty.reset();
    this.timeSpeedProperty.reset();
    this.timeVisibleProperty.reset();
  }

  /**
   * Steps time.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    this._currentTimeProperty.value += ( FEMTOSECONDS_PER_SECOND * dt * this.timeStepProperty.value );
  }

  /**
   * Steps time forward by one step, called when the user presses the 'Step Forward' button.
   */
  public stepForward(): void {
    this._currentTimeProperty.value += this.timeStepProperty.value;
  }

  /**
   * Restart time, called when the user presses the 'Restart' button.
   */
  public restart(): void {
    this._currentTimeProperty.reset();
  }
}
