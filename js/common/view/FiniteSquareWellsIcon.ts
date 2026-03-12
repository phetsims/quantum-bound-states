// Copyright 2026, University of Colorado Boulder

/**
 * FiniteSquareWellsIcon draws the icon for a potential that consists of one or more finite square wells.
 * It is used for screen icons and combo box icons.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Shape from '../../../../kite/js/Shape.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import Path, { PathOptions } from '../../../../scenery/js/nodes/Path.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QBSColors from '../QBSColors.js';

type SelfOptions = {
  numberOfWells: number;
  wellWidth: number;
  wellDepth?: number;
  wellSpacing?: number;
  edgeLength?: number;
};

type FiniteSquareWellsIconOptions = SelfOptions & PickOptional<PathOptions, 'stroke' | 'lineWidth'>;

export default class FiniteSquareWellsIcon extends Path {

  public constructor( providedOptions: FiniteSquareWellsIconOptions ) {

    const options = optionize<FiniteSquareWellsIconOptions, SelfOptions, PathOptions>()( {

      // SelfOptions
      wellDepth: 30,
      wellSpacing: providedOptions.wellWidth,
      edgeLength: 15,

      // PathOptions
      stroke: QBSColors.potentialEnergyColorProperty,
      lineWidth: 2
    }, providedOptions );

    const shape = new Shape().moveTo( 0, 0 ).lineTo( options.edgeLength, 0 );

    let x = options.edgeLength;
    for ( let i = 0; i < options.numberOfWells; i++ ) {
      shape.lineTo( x, options.wellDepth );
      x += options.wellWidth;
      shape.lineTo( x, options.wellDepth );
      shape.lineTo( x, 0 );
      if ( i < options.numberOfWells - 1 ) {
        x += options.wellSpacing;
      }
      else {
        x += options.edgeLength;
      }
      shape.lineTo( x, 0 );
    }

    super( shape, options );
  }
}

quantumBoundStates.register( 'FiniteSquareWellsIcon', FiniteSquareWellsIcon );