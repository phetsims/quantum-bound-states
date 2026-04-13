// Copyright 2026, University of Colorado Boulder

/**
 * InfiniteSquareWellIcon draws the icon for a potential that consists of one infinite square well, with or without a step.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Shape from '../../../../kite/js/Shape.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import TColor from '../../../../scenery/js/util/TColor.js';
import QBSColors from '../QBSColors.js';
import QBSConstants from '../QBSConstants.js';

type SelfOptions = {
  wellWidth: number;
  wellDepth: number;
  hasStep?: boolean;
  stroke?: TColor;
  lineWidth?: number;
};

type InfiniteSquareWellIconOptions = SelfOptions;

export default class InfiniteSquareWellIcon extends Path {

  public constructor( providedOptions: InfiniteSquareWellIconOptions ) {

    const options = optionize<InfiniteSquareWellIconOptions, SelfOptions>()( {

      // SelfOptions
      hasStep: false,
      stroke: QBSColors.potentialEnergyColorProperty,
      lineWidth: QBSConstants.POTENTIAL_ICON_LINE_WIDTH
    }, providedOptions );

    // Draw the well, described from left to right, with or without a step.
    let shape: Shape;
    if ( options.hasStep ) {
      shape = new Shape()
        .moveTo( 0, 0 )
        .lineTo( 0, options.wellDepth )
        .lineTo( options.wellWidth / 2, options.wellDepth )
        .lineTo( options.wellWidth / 2, options.wellDepth / 2 )
        .lineTo( options.wellWidth, options.wellDepth / 2 )
        .lineTo( options.wellWidth, 0 );
    }
    else {
      shape = new Shape()
        .moveTo( 0, 0 )
        .lineTo( 0, options.wellDepth )
        .lineTo( options.wellWidth, options.wellDepth )
        .lineTo( options.wellWidth, 0 );
    }

    super( shape, options );
  }
}
