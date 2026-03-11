// Copyright 2026, University of Colorado Boulder

/**
 * AsymmetricTrianglePotential is a quantum potential composed of 1 asymmetric triangle well.
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

export default class AsymmetricTrianglePotential extends Potential {

  public constructor( tandem: Tandem ) {
    super( {
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.asymmetricTriangleStringProperty,
      tandemPrefix: 'asymmetricTrianglePotential',
      tandem: tandem,
      phetioDocumentation: 'A quantum potential with one asymmetric triangle well.'
    } );
  }

  public override createIcon(): Node {
    const w = 12;
    const h = 12;
    const wings = 8;
    const shape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( wings, 0 )
      .lineTo( wings, h )
      .lineTo( wings + w, 0 )
      .lineTo( wings + w + wings, 0 );
    return new Path( shape, {
      stroke: QBSColors.potentialEnergyColorProperty,
      lineWidth: 2
    } );
  }
}

quantumBoundStates.register( 'AsymmetricTrianglePotential', AsymmetricTrianglePotential );