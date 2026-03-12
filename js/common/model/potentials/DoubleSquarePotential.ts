// Copyright 2026, University of Colorado Boulder

/**
 * DoubleSquarePotential is a quantum potential composed of 2 finite square wells.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Node from '../../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import QBSConstants from '../../QBSConstants.js';
import FiniteSquareWellsIcon from '../../view/FiniteSquareWellsIcon.js'; // eslint-disable-line phet/no-view-imported-from-model
import Potential from './Potential.js';

export default class DoubleSquarePotential extends Potential {

  public constructor( tandem: Tandem ) {
    super( {
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.doubleSquareStringProperty,
      tandemPrefix: 'doubleSquarePotential',
      tandem: tandem,
      phetioDocumentation: 'A quantum potential with two finite square wells.'
    } );
  }

  /**
   * Creates the icon for this potential.
   */
  public override createIcon(): Node {
    return new FiniteSquareWellsIcon( {
      numberOfWells: 2,
      wellWidth: 12,
      wellDepth: 12,
      edgeLength: 8,
      wellSpacing: 6,
      lineWidth: QBSConstants.POTENTIAL_ICON_LINE_WIDTH
    } );
  }
}

quantumBoundStates.register( 'DoubleSquarePotential', DoubleSquarePotential );