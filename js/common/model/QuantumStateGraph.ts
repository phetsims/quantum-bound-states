// Copyright 2026, University of Colorado Boulder

/**
 * QuantumStateGraph is the base class for graphs that provide a representation of the quantum state.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import ReferenceIO, { ReferenceIOState } from '../../../../tandem/js/types/ReferenceIO.js';

type SelfOptions = {
  accessibleNameProperty: TReadOnlyProperty<string>;
};

export type QuantumStateGraphOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class QuantumStateGraph extends PhetioObject {

  public readonly accessibleNameProperty: TReadOnlyProperty<string>;

  protected constructor( providedOptions: QuantumStateGraphOptions ) {

    const options = optionize<QuantumStateGraphOptions, SelfOptions, PhetioObjectOptions>()( {

      // PhetioObjectOptions
      isDisposable: false,
      tandemNameSuffix: 'Graph',
      phetioState: false,
      phetioType: QuantumStateGraph.QuantumStateGraphIO
    }, providedOptions );

    super( options );

    this.accessibleNameProperty = options.accessibleNameProperty;
  }

  public reset(): void {
    //TODO Implement reset
  }

  /**
   * QuantumStateGraphIO handles PhET-iO serialization of QuantumStateGraph instances. Since all QuantumStateGraph
   * instances are static instances, it implements 'Reference type serialization', as described in the Serialization
   * section of https://github.com/phetsims/phet-io/blob/main/doc/phet-io-instrumentation-technical-guide.md#serialization
   */
  public static readonly QuantumStateGraphIO = new IOType<QuantumStateGraph, ReferenceIOState>( 'QuantumStateGraphIO', {
    valueType: QuantumStateGraph,
    supertype: ReferenceIO( IOType.ObjectIO )
  } );
}
