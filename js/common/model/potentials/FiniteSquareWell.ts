// Copyright 2026, University of Colorado Boulder

/**
 * FiniteSquareWell is a square finite potential well.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import Potential from './Potential.js';

export default class FiniteSquareWell extends Potential {

  public constructor( tandem: Tandem ) {
    super( {
      visualNameProperty: QuantumBoundStatesFluent.wells.finiteSquareStringProperty,
      accessibleNameProperty: QuantumBoundStatesFluent.a11y.wells.finiteSquare.accessibleNameStringProperty,
      tandemPrefix: 'finiteSquareWell',
      tandem: tandem
    } );
  }
}

quantumBoundStates.register( 'FiniteSquareWell', FiniteSquareWell );