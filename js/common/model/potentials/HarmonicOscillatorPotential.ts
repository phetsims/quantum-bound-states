// Copyright 2026, University of Colorado Boulder

/**
 * HarmonicOscillatorPotential is a quantum potential composed of 1 harmonic oscillator well.
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

export default class HarmonicOscillatorPotential extends Potential {

  public constructor( tandem: Tandem ) {
    super( {
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.harmonicOscillatorStringProperty,
      tandemPrefix: 'harmonicOscillatorPotential',
      tandem: tandem,
      phetioDocumentation: 'A quantum potential with one harmonic oscillator.'
    } );
  }

  public override createIcon(): Node {
    const w = 17;
    const shape = new Shape()
      .moveTo( 0, 3 )
      .quadraticCurveTo( w / 2, 30, w, 3 );
    return new Path( shape, {
      stroke: QBSColors.potentialEnergyColorProperty,
      lineWidth: 2
    } );
  }
}

quantumBoundStates.register( 'HarmonicOscillatorPotential', HarmonicOscillatorPotential );