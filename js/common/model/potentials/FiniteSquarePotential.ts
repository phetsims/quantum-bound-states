// Copyright 2026, University of Colorado Boulder

/**
 * FiniteSquarePotential is a quantum potential composed of 1 finite square well.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Node from '../../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import FiniteSquareWellsIcon from '../../view/FiniteSquareWellsIcon.js'; // eslint-disable-line phet/no-view-imported-from-model
import Potential from './Potential.js';

export default class FiniteSquarePotential extends Potential {

  public constructor( tandem: Tandem ) {
    super( {
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.finiteSquareStringProperty,
      tandemPrefix: 'finiteSquarePotential',
      tandem: tandem,
      phetioDocumentation: 'A quantum potential with one finite square well.'
    } );
  }

  /**
   * Creates the icon for this potential.
   */
  public override createIcon(): Node {
    return new FiniteSquareWellsIcon( {
      numberOfWells: 1,
      wellWidth: 12,
      wellDepth: 12,
      edgeLength: 8,
      lineWidth: 2
    } );
  }
}

quantumBoundStates.register( 'FiniteSquarePotential', FiniteSquarePotential );