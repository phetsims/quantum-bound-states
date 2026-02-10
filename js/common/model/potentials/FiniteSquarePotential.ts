// Copyright 2026, University of Colorado Boulder

/**
 * FiniteSquarePotential is a square finite potential well.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import Potential from './Potential.js';

export default class FiniteSquarePotential extends Potential {

  public constructor( tandem: Tandem ) {
    super( {
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.finiteSquareStringProperty,
      accessibleNameProperty: QuantumBoundStatesFluent.potentialWells.finiteSquareStringProperty,
      tandemPrefix: 'finiteSquarePotential',
      tandem: tandem
    } );
  }
}

quantumBoundStates.register( 'FiniteSquarePotential', FiniteSquarePotential );