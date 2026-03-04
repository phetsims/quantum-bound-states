// Copyright 2026, University of Colorado Boulder

/**
 * QuantumStateGraph is the base class for graphs that provide a representation of the quantum state.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import ReferenceIO, { ReferenceIOState } from '../../../../tandem/js/types/ReferenceIO.js';
import quantumBoundStates from '../../quantumBoundStates.js';

export default class QuantumStateGraph extends PhetioObject {

  protected constructor( tandem: Tandem ) {

    super( {
      isDisposable: false,
      tandem: tandem,
      phetioState: false,
      phetioType: QuantumStateGraph.QuantumStateGraphIO
    } );
  }

  public reset(): void {
    //TODO
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

quantumBoundStates.register( 'QuantumStateGraph', QuantumStateGraph );