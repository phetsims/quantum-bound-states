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
import QBSConstants from '../../QBSConstants.js';
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

    const w = 12; // width of the well
    const h = 12; // height of the well
    const arrowHeadWidth = 6;
    const arrowHeadHeight = 4;

    // Draw the well without the arrow heads, described from left to right.
    const wellShape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( 0, h )
      .lineTo( w, h )
      .lineTo( w, 0 );
    const wellPath = new Path( wellShape, {
      stroke: QBSColors.potentialEnergyColorProperty,
      lineWidth: QBSConstants.POTENTIAL_ICON_LINE_WIDTH
    } );

    // Draw the arrow heads, starting at the tip of each.
    const arrowHeadsShape = new Shape()
      // Left arrow head
      .moveTo( 0, -arrowHeadHeight )
      .lineTo( -arrowHeadWidth / 2, 0 )
      .lineTo( arrowHeadWidth / 2, 0 )
      .close()
      // Right arrow head
      .newSubpath()
      .moveTo( w, -arrowHeadHeight )
      .lineTo( w - arrowHeadWidth / 2, 0 )
      .lineTo( w + arrowHeadWidth / 2, 0 )
      .close();

    const arrowHeadsPath = new Path( arrowHeadsShape, {
      fill: QBSColors.potentialEnergyColorProperty
    } );

    return new Node( {
      children: [ wellPath, arrowHeadsPath ]
    } );
  }
}

quantumBoundStates.register( 'InfiniteSquarePotential', InfiniteSquarePotential );