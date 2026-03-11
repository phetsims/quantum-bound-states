// Copyright 2026, University of Colorado Boulder

/**
 * AnharmonicOscillatorPotential is a quantum potential composed of 1 anharmonic oscillator well.
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

export default class AnharmonicOscillatorPotential extends Potential {

  public constructor( tandem: Tandem ) {
    super( {
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.anharmonicOscillatorStringProperty,
      tandemPrefix: 'anharmonicOscillatorPotential',
      tandem: tandem,
      phetioDocumentation: 'A quantum potential with one anharmonic oscillator.'
    } );
  }


  public override createIcon(): Node {

    //TODO Suggested by Gemini, but not quite right.
    const shape = new Shape()
      .moveTo( 9, 9 )
      .cubicCurveTo( 14, 48, 9, 4, 26, 10 );

    return new Path( shape, {
      stroke: QBSColors.potentialEnergyColorProperty,
      lineWidth: QBSConstants.POTENTIAL_ICON_LINE_WIDTH
    } );
  }

}

quantumBoundStates.register( 'AnharmonicOscillatorPotential', AnharmonicOscillatorPotential );