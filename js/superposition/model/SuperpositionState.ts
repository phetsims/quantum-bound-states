// Copyright 2026, University of Colorado Boulder

//TODO Combine SuperpositionState and SuperpositionCoefficients into a single class named SuperpositionState?
//TODO Move SuperpositionCoefficients methods that mutate into CustomSuperpositionState?
/**
 * SuperpositionState is the base class for superposition states. The state is defined by a set of coefficients.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import ReferenceIO, { ReferenceIOState } from '../../../../tandem/js/types/ReferenceIO.js';
import SuperpositionCoefficients from '../../common/model/SuperpositionCoefficients.js';

type SelfOptions = {

  // Name used in the visual interface
  visualNameProperty: TReadOnlyProperty<string>;

  // Name used in the accessible interface, including core description. Defaults to visualNameProperty.
  accessibleNameProperty?: TReadOnlyProperty<string>;
};

export type SuperpositionStateOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class SuperpositionState extends PhetioObject {

  public readonly superpositionCoefficients: SuperpositionCoefficients;
  public readonly visualNameProperty: TReadOnlyProperty<string>;
  public readonly accessibleNameProperty: TReadOnlyProperty<string>;

  protected constructor( superpositionCoefficients: SuperpositionCoefficients, providedOptions: SuperpositionStateOptions ) {

    const options = optionize<SuperpositionStateOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      accessibleNameProperty: providedOptions.visualNameProperty,

      // PhetioObjectOptions
      isDisposable: false,
      phetioState: false
    }, providedOptions );

    super( options );

    this.superpositionCoefficients = superpositionCoefficients;
    this.visualNameProperty = options.visualNameProperty;
    this.accessibleNameProperty = options.accessibleNameProperty;
  }

  /**
   * SuperpositionStateIO handles PhET-iO serialization of SuperpositionState instances.
   * It uses reference-type serialization as described in the Serialization section of
   * https://github.com/phetsims/phet-io/blob/main/doc/phet-io-instrumentation-technical-guide.md#serialization
   */
  public static readonly SuperpositionStateIO = new IOType<SuperpositionState, ReferenceIOState>( 'SuperpositionStateIO', {
    valueType: SuperpositionState,
    supertype: ReferenceIO( IOType.ObjectIO )
  } );
}