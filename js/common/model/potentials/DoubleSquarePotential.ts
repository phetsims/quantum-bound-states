// Copyright 2026, University of Colorado Boulder

/**
 * DoubleSquarePotential is a quantum potential composed of 2 finite square wells.
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

export default class DoubleSquarePotential extends Potential {

  public constructor( tandem: Tandem ) {
    super( {
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.doubleSquareStringProperty,
      tandemPrefix: 'doubleSquarePotential',
      tandem: tandem,
      phetioDocumentation: 'A quantum potential with two finite square wells.'
    } );
  }

  public override createIcon(): Node {
    const w = 12;
    const h = 12;
    const wings = 8;
    const spacing = 6;
    const shape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( wings, 0 )
      .lineTo( wings, h )
      .lineTo( wings + w, h )
      .lineTo( wings + w, 0 )
      .lineTo( wings + w + spacing, 0 )
      .lineTo( wings + w + spacing, h )
      .lineTo( wings + w + spacing + w, h )
      .lineTo( wings + w + spacing + w, 0 )
      .lineTo( wings + w + spacing + w + wings, 0 );
    return new Path( shape, {
      stroke: QBSColors.potentialEnergyColorProperty,
      lineWidth: 2
    } );
  }
}

quantumBoundStates.register( 'DoubleSquarePotential', DoubleSquarePotential );