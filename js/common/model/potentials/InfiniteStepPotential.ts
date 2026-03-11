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
    const shape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( 0, h )
      .lineTo( w / 2, h )
      .lineTo( w / 2, h / 2 )
      .lineTo( w, h / 2 )
      .lineTo( w, 0 );
    return new Path( shape, {
      stroke: QBSColors.potentialEnergyColorProperty,
      lineWidth: 2
    } );
  }
}

quantumBoundStates.register( 'InfiniteStepPotential', InfiniteStepPotential );