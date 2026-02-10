// Copyright 2026, University of Colorado Boulder

/**
 * SquareInfiniteWell is a square infinite potential well.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import PotentialWell from './PotentialWell.js';

export default class SquareInfiniteWell extends PotentialWell {

  public constructor( tandem: Tandem ) {
    super( {
      visualNameProperty: QuantumBoundStatesFluent.squareInfiniteStringProperty,
      accessibleNameProperty: QuantumBoundStatesFluent.a11y.squareInfinite.accessibleNameStringProperty,
      tandem: tandem
    } );
  }
}

quantumBoundStates.register( 'SquareInfiniteWell', SquareInfiniteWell );