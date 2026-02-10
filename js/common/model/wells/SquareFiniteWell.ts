// Copyright 2026, University of Colorado Boulder

/**
 * SquareFiniteWell is a square finite potential well.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import PotentialWell from './PotentialWell.js';

export default class SquareFiniteWell extends PotentialWell {

  public constructor( tandem: Tandem ) {
    super( {
      visualNameProperty: QuantumBoundStatesFluent.squareFiniteStringProperty,
      accessibleNameProperty: QuantumBoundStatesFluent.a11y.squareFinite.accessibleNameStringProperty,
      tandem: tandem
    } );
  }
}

quantumBoundStates.register( 'SquareFiniteWell', SquareFiniteWell );