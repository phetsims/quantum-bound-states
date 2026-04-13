// Copyright 2026, University of Colorado Boulder

/**
 * SuperpositionCoefficient is a complex number that defines the weight or "amount" of a specific basis state present
 * in a quantum system's overall superposition state. Magnitude represents the probability of measuring state n, while
 * phase dictates the interference patterns between states.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Range from '../../../../dot/js/Range.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import { StateObject } from '../../../../tandem/js/types/StateSchema.js';

const STATE_SCHEMA = {
  magnitude: NumberIO,
  phaseMultiplier: NumberIO
};

type SuperpositionCoefficientStateObject = StateObject<typeof STATE_SCHEMA>;

export default class SuperpositionCoefficient {

  public static readonly MAGNITUDE_RANGE = new Range( 0, 1 );
  public static readonly PHASE_MULTIPLIER_RANGE = new Range( 0, 2 );

  public readonly magnitude: number;
  public readonly phaseMultiplier: number;

  public constructor( magnitude: number, phaseMultiplier: number ) {
    affirm( SuperpositionCoefficient.MAGNITUDE_RANGE.contains( magnitude ), `invalid magnitude: ${magnitude}` );
    affirm( SuperpositionCoefficient.PHASE_MULTIPLIER_RANGE.contains( phaseMultiplier ), `invalid phaseMultiplier: ${phaseMultiplier}` );

    this.magnitude = magnitude;
    this.phaseMultiplier = phaseMultiplier;
  }

  public get phase(): number {
    return this.phaseMultiplier * Math.PI;
  }

  /**
   * Serializes this SuperpositionCoefficient for PhET-iO.
   */
  private toStateObject(): SuperpositionCoefficientStateObject {
    return {
      magnitude: this.magnitude,
      phaseMultiplier: this.phaseMultiplier
    };
  }

  /**
   * Deserializes a SuperpositionCoefficient instance for PhET-iO.
   */
  private static fromStateObject( stateObject: SuperpositionCoefficientStateObject ): SuperpositionCoefficient {
    return new SuperpositionCoefficient( stateObject.magnitude, stateObject.phaseMultiplier );
  }

  /**
   * SuperpositionCoefficientIO implements PhET-iO serialization for SuperpositionCoefficient instances.
   * It implements data-type serialization as described in the Serialization section of
   * https://github.com/phetsims/phet-io/blob/main/doc/phet-io-instrumentation-technical-guide.md#serialization
   */
  public static readonly SuperpositionCoefficientIO =
    new IOType<SuperpositionCoefficient, SuperpositionCoefficientStateObject>( 'SuperpositionCoefficientIO', {
      valueType: SuperpositionCoefficient,
      stateSchema: STATE_SCHEMA,
      toStateObject: ( superpositionCoefficient: SuperpositionCoefficient ) => superpositionCoefficient.toStateObject(),
      fromStateObject: ( stateObject: SuperpositionCoefficientStateObject ) => SuperpositionCoefficient.fromStateObject( stateObject )
    } );
}