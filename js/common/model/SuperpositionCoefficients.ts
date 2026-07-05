// Copyright 2026, University of Colorado Boulder

//TODO Lots of stuff here probably needs to change or be deleted.
/**
 * SuperpositionCoefficients is a port of BSSuperpositionCoefficients.java.
 * It models the set of superposition coefficients that define the contribution of eigenstates to a quantum potential's
 * wave function.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import affirm, { affirmCallback, isAffirmEnabled } from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import ReferenceIO, { ReferenceIOState } from '../../../../tandem/js/types/ReferenceIO.js';
import { SuperpositionStateOptions } from '../../superposition/model/SuperpositionState.js';
import QBSConstants from '../QBSConstants.js';
import SuperpositionCoefficient from './SuperpositionCoefficient.js';

// Normalization error must be less than this value. The value is related to number of decimal places used in the
// visual interface for coefficient magnitude. For example, the user may only be able to enter 0.54, when the actual
// normalized coefficient should be 0.543.
const NORMALIZATION_ERROR = Math.pow( 10, -QBSConstants.SUPERPOSITION_COEFFICIENT_MAGNITUDE_DECIMAL_PLACES );

type SelfOptions = {

  // Name used in the visual interface
  visualNameProperty: TReadOnlyProperty<string>;

  // Name used in the accessible interface, including core description. Defaults to visualNameProperty.
  accessibleNameProperty?: TReadOnlyProperty<string>;
};

export type SuperpositionCoefficientsOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class SuperpositionCoefficients extends PhetioObject {

  //TODO Should the number of coefficients always match BoundStateResult.energies.length or are zeros implied?
  private coefficients: SuperpositionCoefficient[];

  // Notifies observers when this.coefficients changes in some way.
  public readonly valuesChangedEmitter: Emitter;

  public readonly visualNameProperty: TReadOnlyProperty<string>;
  public readonly accessibleNameProperty: TReadOnlyProperty<string>;

  public constructor( coefficients: SuperpositionCoefficient[], providedOptions: SuperpositionCoefficientsOptions ) {

    if ( isAffirmEnabled() ) {
      affirm( SuperpositionCoefficients.isValidCoefficients( coefficients ), 'coefficients.length must be > 0 and have at least 1 non-zero magnitude.' );
    }

    const options = optionize<SuperpositionStateOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      accessibleNameProperty: providedOptions.visualNameProperty,

      // PhetioObjectOptions
      isDisposable: false,
      phetioState: false
    }, providedOptions );

    super( options );

    this.coefficients = coefficients;
    this.visualNameProperty = options.visualNameProperty;
    this.accessibleNameProperty = options.accessibleNameProperty || this.visualNameProperty;
    this.valuesChangedEmitter = new Emitter();
  }

  /**
   * Resets to the state at which this object was constructed.
   */
  public reset(): void {
    this.coefficients = [ SuperpositionCoefficient.GROUND_STATE_COEFFICIENT ];
    this.valuesChangedEmitter.emit();
  }

  /**
   * Gets the coefficients.
   */
  public getCoefficients(): readonly SuperpositionCoefficient[] {
    return this.coefficients;
  }

  /**
   * Sets the coefficients.
   */
  public setCoefficients( coefficients: SuperpositionCoefficient[] ): void {
    if ( isAffirmEnabled() ) {
      affirm( SuperpositionCoefficients.isValidCoefficients( coefficients ), 'coefficients.length must be > 0 and have at least 1 non-zero magnitude.' );
    }
    this.coefficients = coefficients;
    this.valuesChangedEmitter.emit();
  }

  /**
   * Normalizes the coefficients and notifies observers.
   * Normalized means that c1^2 + c2^2 + ... + cn^2 = 1.
   */
  public normalize(): void {
    const sumOfSquares = this.getSumOfSquares();
    affirmCallback( () => sumOfSquares !== 0, 'sumOfSquares must be > zero to normalized' );
    for ( let i = 0; i < this.coefficients.length; i++ ) {
      const coefficient = this.coefficients[ i ];
      const normalizedMagnitude = Math.sqrt( ( coefficient.magnitude * coefficient.magnitude ) / sumOfSquares );
      this.coefficients[ i ] = new SuperpositionCoefficient( normalizedMagnitude, coefficient.phase );
    }
    affirmCallback( () => this.isNormalized(), 'expected to be normalized' );
    this.valuesChangedEmitter.emit();
  }

  /**
   * Sets the number of coefficients.
   *
   * If there are no coefficients, the first one is set to 1 and all others to zero.
   *
   * If the number of coefficients is increasing, the new ones are set to zero.
   *
   * If the number of coefficients is decreasing, then we need to examine the coefficient values. If any non-zero
   * coefficient will be lost, then the first coefficient is set to 1 and all others to zero. If only zero-valued
   * coefficient will be lost, then they can simply be deleted without changing the values of any non-zero coefficient.
   */
  public setNumberOfCoefficients( numberOfCoefficients: number ): void {

    if ( isAffirmEnabled() ) {
      affirm( Number.isInteger( numberOfCoefficients ), 'numberOfCoefficients must be an integer: ' + numberOfCoefficients );
      affirm( numberOfCoefficients > 0, 'numberOfCoefficients must be > 0: ' + numberOfCoefficients );
    }

    const previousNumberOfCoefficients = this.coefficients.length;
    let valuesChanged = false;

    if ( numberOfCoefficients === previousNumberOfCoefficients ) {
      // no change, do nothing
    }
    else {
      if ( numberOfCoefficients === 0 ) {
        this.coefficients = [];
        valuesChanged = true;
      }
      else if ( previousNumberOfCoefficients === 0 ) {

        // If we have no coefficients yet, then set the first coefficient to 1 and all the others to 0.
        this.coefficients = new Array( numberOfCoefficients ).fill( SuperpositionCoefficient.ZERO_COEFFICIENT );
        this.coefficients[ 0 ] = SuperpositionCoefficient.GROUND_STATE_COEFFICIENT;
        valuesChanged = true;
      }
      else if ( numberOfCoefficients > previousNumberOfCoefficients ) {

        // If the number of eigenstates is increasing, add new ones with zero values.
        for ( let i = previousNumberOfCoefficients; i < numberOfCoefficients; i++ ) {
          this.coefficients.push( SuperpositionCoefficient.ZERO_COEFFICIENT );
        }
        valuesChanged = false;
      }
      else {

        // The number of coefficients is decreasing.
        // If we lose any non-zero coefficients, renormalize the remaining coefficients.
        // If the remaining coefficients are all zero, then set the lowest one to 1.
        let needToNormalize = false;
        for ( let i = previousNumberOfCoefficients - 1; i >= numberOfCoefficients; i-- ) {
          const coefficient = this.coefficients.pop();
          affirm( coefficient !== undefined, 'coefficient is undefined' );
          if ( coefficient.magnitude !== 0 ) {
            needToNormalize = true;
          }
        }

        if ( needToNormalize ) {
          if ( this.getSum() === 0 ) {
            if ( numberOfCoefficients > 0 ) {
              this.coefficients[ 0 ] = SuperpositionCoefficient.GROUND_STATE_COEFFICIENT;
            }
          }
          else {
            this.normalize();
          }
        }

        valuesChanged = needToNormalize;
      }

      if ( valuesChanged ) {
        this.valuesChangedEmitter.emit();
      }
    }
    affirm( this.coefficients.length === numberOfCoefficients, 'coefficients.length is incorrect: ' + this.coefficients.length );
  }

  /**
   * Gets the number of coefficients.
   */
  public getNumberOfCoefficients(): number {
    return this.coefficients.length;
  }

  /**
   * Gets the number of coefficients with non-zero magnitude, possibly zero.
   */
  public getNumberOfNonZeroCoefficients(): number {
    let count = 0;
    this.coefficients.forEach( coefficient => {
      if ( coefficient.magnitude !== 0 ) {
        count++;
      }
    } );
    return count;
  }

  /**
   * Gets the value of a specific coefficient.
   */
  public getCoefficient( index: number ): SuperpositionCoefficient {
    if ( isAffirmEnabled() ) {
      affirm( Number.isInteger( index ), 'index must be an integer: ' + index );
      affirm( index >= 0 && index <= this.coefficients.length - 1, 'index is out of bounds: ' + index );
    }
    return this.coefficients[ index ];
  }

  /**
   * Sets the value of a specific coefficient and notifies observers.
   */
  public setCoefficient( index: number, coefficient: SuperpositionCoefficient ): void {
    if ( isAffirmEnabled() ) {
      affirm( Number.isInteger( index ), 'index must be an integer: ' + index );
      affirm( index >= 0 && index <= this.coefficients.length - 1, 'index is out of bounds: ' + index );
    }
    this.coefficients[ index ] = coefficient;
    if ( isAffirmEnabled() ) {
      affirm( SuperpositionCoefficients.isValidCoefficients( this.coefficients ),
        'coefficients.length must be > 0 and have at least 1 non-zero magnitude.' );
    }
    this.valuesChangedEmitter.emit();
  }

  /**
   * Sets a specific coefficient to GROUND_STATE_COEFFICIENT, sets all others to ZERO_COEFFICIENT, and notifies observers.
   * If numberOfCoefficients is provided, then the number of coefficients is also adjusted to match.
   */
  public setOneCoefficient( index: number, numberOfCoefficients?: number ): void {
    affirm( Number.isInteger( index ), 'index must be an integer: ' + index );

    // Adjust the number of coefficients if necessary.
    if ( numberOfCoefficients !== undefined && numberOfCoefficients !== this.coefficients.length ) {
      affirm( Number.isInteger( numberOfCoefficients ) && numberOfCoefficients > 1,
        'numberOfCoefficients must be an integer > 0: ' + numberOfCoefficients );
      this.coefficients = new Array( numberOfCoefficients ).fill( SuperpositionCoefficient.ZERO_COEFFICIENT );
    }
    else {
      this.coefficients.fill( SuperpositionCoefficient.ZERO_COEFFICIENT );
    }
    affirm( index >= 0 && index <= this.coefficients.length - 1, 'index is out of bounds: ' + index );

    this.coefficients[ index ] = SuperpositionCoefficient.GROUND_STATE_COEFFICIENT;
    this.valuesChangedEmitter.emit();
  }

  /**
   * Determines whether the set of coefficients has normalized magnitudes.
   * Normalized means that c1^2 + c2^2 + ... + cn^2 = 1.
   *
   * Allows you to specify how close is good enough to be considered normalized, which is useful when the view only
   * allows the user to enter values with limited precision. For example, the user may only be able to enter 0.54,
   * when the actual coefficient should be 0.543.
   */
  public isNormalized(): boolean {
    const sumOfSquares = this.getSumOfSquares();
    if ( sumOfSquares === 0 ) {
      return false;
    }
    else {
      return ( Math.abs( 1 - sumOfSquares ) < NORMALIZATION_ERROR );
    }
  }

  /**
   * Gets the sum of all coefficient magnitudes.
   */
  private getSum(): number {
    let sum = 0;
    this.coefficients.forEach( coefficient => {
      sum += coefficient.magnitude;
    } );
    return sum;
  }

  /*
   * Gets the sum of squares of all coefficient magnitudes.
   * (c1^2 + c2^2 + ... + cn^2).
   */
  private getSumOfSquares(): number {
    let sum = 0;
    this.coefficients.forEach( coefficient => {
      sum += ( coefficient.magnitude * coefficient.magnitude );
    } );
    return sum;
  }

  /**
   * Determines whether this set of coefficients represents a superposition state.
   * A superposition state has at least 2 coefficients with non-zero magnitude.
   */
  public isSuperpositionState(): boolean {
    return ( this.getNumberOfNonZeroCoefficients() >= 2 );
  }

  /**
   * Gets the index of the lowest coefficient with non-zero magnitude.
   * Returns -1 if there are no coefficients with non-zero magnitude.
   */
  public getLowestNonZeroCoefficientIndex(): number {
    let index = -1;
    for ( let i = 0; i < this.coefficients.length; i++ ) {
      if ( this.coefficients[ i ].magnitude !== 0 ) {
        index = i;
        break;
      }
    }
    return index;
  }

  /**
   * Determines whether an array of coefficients is valid.
   */
  public static isValidCoefficients( coefficients: SuperpositionCoefficient[] ): boolean {
    return ( coefficients.length > 0 && _.find( coefficients, coefficient => coefficient.magnitude !== 0 ) !== undefined );
  }

  //TODO Rename SuperpositionStateIO
  /**
   * SuperpositionCoefficientsIO handles PhET-iO serialization of SuperpositionCoefficients instances.
   * It uses reference-type serialization as described in the Serialization section of
   * https://github.com/phetsims/phet-io/blob/main/doc/phet-io-instrumentation-technical-guide.md#serialization
   */
  public static readonly SuperpositionCoefficientsIO = new IOType<SuperpositionCoefficients, ReferenceIOState>( 'SuperpositionCoefficientsIO', {
    valueType: SuperpositionCoefficients,
    supertype: ReferenceIO( IOType.ObjectIO )
  } );
}
