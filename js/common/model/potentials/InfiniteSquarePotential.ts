// Copyright 2026, University of Colorado Boulder

/**
 * InfiniteSquarePotential is a quantum potential composed of 1 infinite square well.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import Potential from './Potential.js';

export default class InfiniteSquarePotential extends Potential {

  public constructor( tandem: Tandem ) {
    super( {
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.infiniteSquareStringProperty,
      tandemPrefix: 'infiniteSquarePotential',
      tandem: tandem,
      phetioDocumentation: 'A quantum potential with one infinite square well.'
    } );
  }
}

quantumBoundStates.register( 'InfiniteSquarePotential', InfiniteSquarePotential );