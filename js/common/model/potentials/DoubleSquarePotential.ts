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
import QBSConstants from '../../QBSConstants.js';
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

    const w = 12; // width of one well
    const h = 12; // height of both wells
    const edge = 8; // horizontal length of the edges that extend to the left and right of the square wells
    const spacing = 6; // horizontal spacing between the two square wells

    // Described from left to right
    const shape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( edge, 0 )
      .lineTo( edge, h )
      .lineTo( edge + w, h )
      .lineTo( edge + w, 0 )
      .lineTo( edge + w + spacing, 0 )
      .lineTo( edge + w + spacing, h )
      .lineTo( edge + w + spacing + w, h )
      .lineTo( edge + w + spacing + w, 0 )
      .lineTo( edge + w + spacing + w + edge, 0 );

    return new Path( shape, {
      stroke: QBSColors.potentialEnergyColorProperty,
      lineWidth: QBSConstants.POTENTIAL_ICON_LINE_WIDTH
    } );
  }
}

quantumBoundStates.register( 'DoubleSquarePotential', DoubleSquarePotential );