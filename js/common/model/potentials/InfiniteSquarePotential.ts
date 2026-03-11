// Copyright 2026, University of Colorado Boulder

/**
 * InfiniteSquarePotential is a quantum potential composed of 1 infinite square well.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Shape from '../../../../../kite/js/Shape.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Path from '../../../../../scenery/js/nodes/Path.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import QBSColors from '../../QBSColors.js';
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

  public override createIcon(): Node {
    const w = 12;
    const h = 12;
    const shape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( 0, h )
      .lineTo( w, h )
      .lineTo( w, 0 );
    return new Path( shape, {
      stroke: QBSColors.potentialEnergyColorProperty,
      lineWidth: 2
    } );
  }
}

quantumBoundStates.register( 'InfiniteSquarePotential', InfiniteSquarePotential );