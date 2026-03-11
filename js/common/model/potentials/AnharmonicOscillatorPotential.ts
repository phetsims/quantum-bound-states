// Copyright 2026, University of Colorado Boulder

/**
 * AnharmonicOscillatorPotential is a quantum potential composed of 1 anharmonic oscillator well.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Node from '../../../../../scenery/js/nodes/Node.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
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
    return new Text( '?', {
      font: QBSConstants.CONTROL_FONT,
      fill: QBSColors.potentialEnergyColorProperty
    } );
  }

}

quantumBoundStates.register( 'AnharmonicOscillatorPotential', AnharmonicOscillatorPotential );