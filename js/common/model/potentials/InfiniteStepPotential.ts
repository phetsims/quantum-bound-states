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

    const w = 12;
    const h = 12;
    const arrowHeadWidth = 6;
    const arrowHeadHeight = 4;

    // Draw the well without the arrow heads.
    const wellShape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( 0, h )
      .lineTo( w / 2, h )
      .lineTo( w / 2, h / 2 )
      .lineTo( w, h / 2 )
      .lineTo( w, 0 );
    const wellPath = new Path( wellShape, {
      stroke: QBSColors.potentialEnergyColorProperty,
      lineWidth: 2
    } );

    // Draw the arrow heads, starting at the tip of each.
    const arrowHeadsShape = new Shape()
      .moveTo( 0, -arrowHeadHeight )
      .lineTo( -arrowHeadWidth / 2, 0 )
      .lineTo( arrowHeadWidth / 2, 0 )
      .close()
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

quantumBoundStates.register( 'InfiniteStepPotential', InfiniteStepPotential );