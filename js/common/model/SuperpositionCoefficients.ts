// Copyright 2026, University of Colorado Boulder

//TODO This is a temporary implementation of superposition coefficients that does not address phase.
/**
 * SuperpositionCoefficients is a port of BSSuperpositionCoefficients.java.
 * It models the set of superposition coefficients that define the contribution of eigenstates to a quantum potential's
 * wave function.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import affirm, { affirmCallback, isAffirmEnabled } from '../../../../perennial-alias/js/browser-and-node/affirm.js';

export default class SuperpositionCoefficients {

  private coefficients: number[];
  public readonly valuesChangedEmitter: Emitter;
  public readonly numberOfCoefficientsChangedEmitter: Emitter;

  public constructor( coefficients?: number[] ) {
    this.coefficients = coefficients || [ 1 ];
    this.valuesChangedEmitter = new Emitter();
    this.numberOfCoefficientsChangedEmitter = new Emitter();
  }

  /**
   * Sets all coefficients to zero and notifies observers.
   */
  public clear(): void {
    this.coefficients.fill( 0 );
    this.valuesChangedEmitter.emit();
  }

  /**
   * Copies the coefficients from another set of coefficients. If the other set has fewer coefficients than this set,
   * then the extra coefficients are set to zero.
   */
  public apply( superpositionCoefficients: SuperpositionCoefficients ): void {
    affirmCallback( () => superpositionCoefficients.coefficients.length <= this.coefficients.length,
      'too many coefficients: ' + superpositionCoefficients.coefficients.length + ', max: ' + this.coefficients.length + '' );
    this.coefficients.fill( 0 );
    superpositionCoefficients.coefficients.forEach( ( coefficient, index ) => {
      this.coefficients[ index ] = coefficient;
    } );
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
      this.coefficients[ i ] = Math.sqrt( ( coefficient * coefficient ) / sumOfSquares );
    }
    affirmCallback( () => this.isNormalized(), 'expected to be normalized' );
    this.valuesChangedEmitter.emit();
  }

  /**
   * Gets a defensive copy of the coefficient values.
   */
  public getCoefficientsCopy(): number[] {
    const coefficients = new Array( this.coefficients.length );
    this.coefficients.forEach( ( coefficient, index ) => {
      coefficients[ index ] = coefficient;
    } );
    affirm( coefficients.length === this.coefficients.length, 'coefficients.length is incorrect: ' + coefficients.length );
    return coefficients;
  }

  /**
   * Sets the coefficient values.
   */
  public setCoefficients( coefficients: number[] ): void {
    affirm( coefficients.length > 0, 'coefficients.length must be > 0: ' + coefficients.length );

    const previousNumberOfCoefficients = coefficients.length;

    this.coefficients = new Array( coefficients.length );
    coefficients.forEach( ( coefficient, index ) => {
      this.coefficients[ index ] = coefficient;
    } );
    affirm( this.coefficients.length === coefficients.length, 'this.coefficients.length is incorrect: ' + this.coefficients.length );

    if ( previousNumberOfCoefficients !== this.coefficients.length ) {
      this.numberOfCoefficientsChangedEmitter.emit();
    }
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
    let numberOfCoefficientsChanged = false;
    let valuesChanged = false;

    if ( numberOfCoefficients === previousNumberOfCoefficients ) {
      // no change, do nothing
    }
    else {
      if ( numberOfCoefficients === 0 ) {
        this.coefficients = [];
        numberOfCoefficientsChanged = true;
        valuesChanged = true;
      }
      else if ( previousNumberOfCoefficients === 0 ) {

        // If we have no coefficients yet, then set the first coefficient to 1 and all the others to 0.
        this.coefficients = new Array( numberOfCoefficients ).fill( 0 );
        this.coefficients[ 0 ] = 1;
        numberOfCoefficientsChanged = true;
        valuesChanged = true;
      }
      else if ( numberOfCoefficients > previousNumberOfCoefficients ) {

        // If the number of eigenstates is increasing, add new ones with zero values.
        for ( let i = previousNumberOfCoefficients; i < numberOfCoefficients; i++ ) {
          this.coefficients.push( 0 );
        }
        numberOfCoefficientsChanged = true;
        valuesChanged = false;
      }
      else {

        // The number of coefficients is decreasing.
        // If we lose any non-zero coefficients, renormalize the remaining coefficients.
        // If the remaining coefficients are all zero, then set the lowest one to 1.
        let needToNormalize = false;
        for ( let i = previousNumberOfCoefficients - 1; i >= numberOfCoefficients; i-- ) {
          const coefficient = this.coefficients.pop();
          if ( coefficient !== 0 ) {
            needToNormalize = true;
          }
        }

        if ( needToNormalize ) {
          if ( this.getSum() === 0 ) {
            if ( numberOfCoefficients > 0 ) {
              this.coefficients[ 0 ] = 1;
            }
          }
          else {
            this.normalize();
          }
        }

        numberOfCoefficientsChanged = true;
        valuesChanged = needToNormalize;
      }

      if ( numberOfCoefficientsChanged ) {
        this.numberOfCoefficientsChangedEmitter.emit();
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
   * Gets the number of non-zero coefficients, possibly zero.
   */
  public getNumberOfNonZeroCoefficients(): number {
    let count = 0;
    this.coefficients.forEach( coefficient => {
      if ( coefficient !== 0 ) {
        count++;
      }
    } );
    return count;
  }

  /**
   * Gets the value of a specific coefficient.
   */
  public getCoefficient( index: number ): number {
    if ( isAffirmEnabled() ) {
      affirm( Number.isInteger( index ), 'index must be an integer: ' + index );
      affirm( index >= 0 && index <= this.coefficients.length - 1, 'index is out of bounds: ' + index );
    }
    return this.coefficients[ index ];
  }

  /**
   * Sets the value of a specific coefficient and notifies observers.
   */
  public setCoefficient( index: number, coefficient: number ): void {
    if ( isAffirmEnabled() ) {
      affirm( Number.isInteger( index ), 'index must be an integer: ' + index );
      affirm( index >= 0 && index <= this.coefficients.length - 1, 'index is out of bounds: ' + index );
      affirm( coefficient >= 0 && coefficient <= 1, 'coefficient must be between 0 and 1: ' + coefficient );
    }
    this.coefficients[ index ] = coefficient;
    this.valuesChangedEmitter.emit();
  }

  /**
   * Sets a specific coefficient to 1, sets all others to zero, and notifies observers.
   * If numberOfCoefficients is provided, then the number of coefficients is also adjusted to match.
   */
  public setOneCoefficient( index: number, numberOfCoefficients?: number ): void {
    isAffirmEnabled() && affirm( Number.isInteger( index ), 'index must be an integer: ' + index );
    const previousNumberOfCoefficients = this.coefficients.length;
    if ( numberOfCoefficients !== undefined && numberOfCoefficients !== this.coefficients.length ) {
      this.coefficients = new Array( numberOfCoefficients ).fill( 0 );
    }
    else {
      this.coefficients.fill( 0 );
    }
    affirm( index >= 0 && index <= this.coefficients.length - 1, 'index is out of bounds: ' + index );
    this.coefficients[ index ] = 1;
    if ( previousNumberOfCoefficients !== this.coefficients.length ) {
      this.numberOfCoefficientsChangedEmitter.emit();
    }
    this.valuesChangedEmitter.emit();
  }

  /**
   * Determines whether the set of coefficients is normalized.
   * Normalized means that c1^2 + c2^2 + ... + cn^2 = 1.
   *
   * Allows you to specify how close is good enough to be considered normalized, which is useful when the view only
   * allows the user to enter values with limited precision. For example, the user may only be able to enter 0.54,
   * when the actual coefficient should be 0.543.
   */
  public isNormalized( normalizationError = 0 ): boolean {
    isAffirmEnabled() && affirm( normalizationError >= 0, 'normalizationError must be >= 0: ' + normalizationError );
    const sumOfSquares = this.getSumOfSquares();
    if ( sumOfSquares === 0 ) {
      return false;
    }
    else {
      const difference = Math.abs( 1 - sumOfSquares );
      return ( difference <= normalizationError );
    }
  }

  /**
   * Gets the sum of all coefficients.
   */
  public getSum(): number {
    let total = 0;
    this.coefficients.forEach( coefficient => {
      total += coefficient;
    } );
    return total;
  }

  /*
   * Gets the sum of squares of all coefficients.
   * (c1^2 + c2^2 + ... + cn^2).
   */
  private getSumOfSquares(): number {
    let total = 0;
    this.coefficients.forEach( coefficient => {
      total += ( coefficient * coefficient );
    } );
    return total;
  }

  /**
   * Determines whether this set of coefficients represents a superposition state.
   * A superposition state has at least 2 non-zero coefficients.
   */
  public isSuperpositionState(): boolean {
    return ( this.getNumberOfNonZeroCoefficients() >= 2 );
  }

  /**
   * Gets the index of the lowest non-zero coefficient.
   * Returns -1 if there are no non-zero coefficients.
   */
  public getLowestNonZeroCoefficientIndex(): number {
    let index = -1;
    for ( let i = 0; i < this.coefficients.length; i++ ) {
      if ( this.coefficients[ i ] !== 0 ) {
        index = i;
        break;
      }
    }
    return index;
  }

  //TODO Delete this because we removed 'Average Probability Density of Band' feature.
  /**
   * Sets all the coefficient values in a band of eigenstates. Coefficients outside the band are set to zero.
   * The band is defined by startIndex and endIndex inclusive.
   */
  public setBandOfCoefficients( startIndex: number, endIndex: number, coefficient: number ): void {
    if ( isAffirmEnabled() ) {
      affirm( Number.isInteger( startIndex ), 'startIndex must be an integer: ' + startIndex );
      affirm( Number.isInteger( endIndex ), 'endIndex must be an integer: ' + endIndex );
      affirm( startIndex < endIndex, 'startIndex must be < endIndex: ' + startIndex + ', ' + endIndex );
      affirm( startIndex >= 0 && startIndex < this.coefficients.length, 'startIndex is out of bounds: ' + startIndex );
      affirm( endIndex >= 0 && endIndex < this.coefficients.length, 'endIndex is out of bounds: ' + endIndex );
      affirm( coefficient >= 0 && coefficient <= 1, 'coefficient must be between 0 and 1: ' + coefficient );
    }

    this.coefficients.fill( 0 );
    for ( let i = startIndex; i <= endIndex; i++ ) {
      this.coefficients[ i ] = coefficient;
    }
    this.valuesChangedEmitter.emit();
  }
}
