// Copyright 2026, University of Colorado Boulder

/**
 * AnharmonicOscillatorPotential is a quantum potential composed of 1 anharmonic oscillator well.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { roundSymmetric } from '../../../../../dot/js/util/roundSymmetric.js';
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

  /**
   * Creates the icon for this potential.
   * Note that this implementation was adapted from an implementation that was suggested by Claude Code.
   */
  public override createIcon(): Node {

    // Claude suggested using a Morse curve to approximate this potential shape.
    const getMorseCurve = ( x: number, depth = 1, width = 1, center = 1 ): number => {
      const term = 1 - Math.exp( -width * ( x - center ) );
      return depth * ( Math.pow( term, 2 ) - 1 );
    };

    // Sample x from 0.2 to 10
    const xs = Array.from( { length: 99 }, ( _, i ) => ( i + 2 ) * 0.1 );
    const ys = xs.map( x => getMorseCurve( x ) );

    // Map to SVG coordinate space: x_svg in [4, 60], y_svg in [4, 60] (flipped)
    const xMin = 0.2;
    const xMax = 10;
    const yMin = Math.min( ...ys ) - 0.05;
    const yMax = Math.max( ...ys ) + 0.05;

    const toSVG = ( x: number, y: number ): [ number, number ] => {
      const sx = 4 + ( ( x - xMin ) / ( xMax - xMin ) ) * 56;
      const sy = 60 - ( ( y - yMin ) / ( yMax - yMin ) ) * 56;
      return [ roundSymmetric( sx * 10 ) / 10, roundSymmetric( sy * 10 ) / 10 ];
    };

    const points = xs.map( ( x, i ) => toSVG( x, ys[ i ] ) );

    const scale = 0.3; // applied to the points

    const shape = new Shape();
    points.forEach( ( [ x, y ] ) => shape.lineTo( scale * x, scale * y ) );

    return new Path( shape, {
      stroke: QBSColors.potentialEnergyColorProperty,
      lineWidth: QBSConstants.POTENTIAL_ICON_LINE_WIDTH
    } );
  }

}

quantumBoundStates.register( 'AnharmonicOscillatorPotential', AnharmonicOscillatorPotential );