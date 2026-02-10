// Copyright 2026, University of Colorado Boulder

/**
 * InfiniteSquareWell is a square infinite potential well.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import Potential from './Potential.js';

export default class InfiniteSquareWell extends Potential {

  public constructor( tandem: Tandem ) {
    super( {
      visualNameProperty: QuantumBoundStatesFluent.wells.infiniteSquareStringProperty,
      accessibleNameProperty: QuantumBoundStatesFluent.a11y.wells.infiniteSquare.accessibleNameStringProperty,
      tandem: tandem
    } );
  }
}

quantumBoundStates.register( 'InfiniteSquareWell', InfiniteSquareWell );