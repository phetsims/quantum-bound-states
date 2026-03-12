// Copyright 2026, University of Colorado Boulder

/**
 * InfiniteStepPotential is a quantum potential composed of 1 infinite step well.
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

export default class InfiniteStepPotential extends Potential {

  public constructor( tandem: Tandem ) {
    super( {
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.infiniteStepStringProperty,
      tandemPrefix: 'infiniteStepPotential',
      tandem: tandem,
      phetioDocumentation: 'A quantum potential with one infinite step well.'
    } );
  }

  public override createIcon(): Node {

    const wellWidth = 12;
    const wellDepth = 12;
    const arrowHeadWidth = 6;
    const arrowHeadHeight = 4;

    // Draw the well without the arrow heads, described from left to right.
    const wellShape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( 0, wellDepth )
      .lineTo( wellWidth / 2, wellDepth )
      .lineTo( wellWidth / 2, wellDepth / 2 )
      .lineTo( wellWidth, wellDepth / 2 )
      .lineTo( wellWidth, 0 );
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
      .moveTo( wellWidth, -arrowHeadHeight )
      .lineTo( wellWidth - arrowHeadWidth / 2, 0 )
      .lineTo( wellWidth + arrowHeadWidth / 2, 0 )
      .close();
    const arrowHeadsPath = new Path( arrowHeadsShape, {
      fill: QBSColors.potentialEnergyColorProperty
    } );

    return new Node( {
      children: [ wellPath, arrowHeadsPath ]
    } );
  }
}

quantumBoundStates.register( 'InfiniteStepPotential', InfiniteStepPotential );