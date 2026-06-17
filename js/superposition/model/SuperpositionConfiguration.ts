// Copyright 2026, University of Colorado Boulder

/**
 * SuperpositionConfiguration is the base class for superposition configurations.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import ReferenceIO, { ReferenceIOState } from '../../../../tandem/js/types/ReferenceIO.js';
import { SuperpositionConfigurationType } from './SuperpositionConfigurationType.js';

type SelfOptions = {
  superpositionConfigurationType: SuperpositionConfigurationType;
  nameProperty: TReadOnlyProperty<string>;
  accessibleNameProperty?: TReadOnlyProperty<string>;
  tandemPrefix: string;
};

export type SuperpositionConfigurationOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class SuperpositionConfiguration extends PhetioObject {

  public readonly superpositionConfigurationType: SuperpositionConfigurationType;
  public readonly nameProperty: TReadOnlyProperty<string>;
  public readonly accessibleNameProperty: TReadOnlyProperty<string>;
  public readonly tandemPrefix: string;

  protected constructor( providedOptions: SuperpositionConfigurationOptions ) {

    const options = optionize<SuperpositionConfigurationOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      accessibleNameProperty: providedOptions.nameProperty,

      // PhetioObjectOptions
      isDisposable: false,
      phetioState: false
    }, providedOptions );

    super( options );

    this.superpositionConfigurationType = options.superpositionConfigurationType;
    this.nameProperty = options.nameProperty;
    this.accessibleNameProperty = options.accessibleNameProperty;
    this.tandemPrefix = options.tandemPrefix;
  }

  /**
   * SuperpositionConfigurationIO handles PhET-iO serialization of SuperpositionConfiguration instances.
   * It uses reference-type serialization as described in the Serialization section of
   * https://github.com/phetsims/phet-io/blob/main/doc/phet-io-instrumentation-technical-guide.md#serialization
   */
  public static readonly SuperpositionConfigurationIO = new IOType<SuperpositionConfiguration, ReferenceIOState>( 'SuperpositionConfigurationIO', {
    valueType: SuperpositionConfiguration,
    supertype: ReferenceIO( IOType.ObjectIO )
  } );
}