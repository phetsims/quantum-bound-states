// Copyright 2026, University of Colorado Boulder

/**
 * InfiniteSquareWellIcon draws the icon for a potential that consists of one infinite square well, with or without a step.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Shape from '../../../../kite/js/Shape.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import TColor from '../../../../scenery/js/util/TColor.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QBSColors from '../QBSColors.js';
import QBSConstants from '../QBSConstants.js';
import FiniteSquareWellsIcon from './FiniteSquareWellsIcon.js';

type SelfOptions = {
  wellWidth: number;
  wellDepth: number;
  arrowHeadWidth?: number;
  arrowHeadHeight?: number;
  hasStep?: boolean;
  stroke?: TColor;
  lineWidth?: number;
};

type InfiniteSquareWellIconOptions = SelfOptions;

export default class InfiniteSquareWellIcon extends Node {

  public constructor( providedOptions: InfiniteSquareWellIconOptions ) {

    const options = optionize<InfiniteSquareWellIconOptions, SelfOptions>()( {

      // SelfOptions
      arrowHeadWidth: 6,
      arrowHeadHeight: 4,
      hasStep: false,
      stroke: QBSColors.potentialEnergyColorProperty,
      lineWidth: 2
    }, providedOptions );

    // Draw the well without the arrow heads, described from left to right, with or without a step.
    let wellIcon: Node;
    if ( options.hasStep ) {
      const wellShape = new Shape()
        .moveTo( 0, 0 )
        .lineTo( 0, options.wellDepth )
        .lineTo( options.wellWidth / 2, options.wellDepth )
        .lineTo( options.wellWidth / 2, options.wellDepth / 2 )
        .lineTo( options.wellWidth, options.wellDepth / 2 )
        .lineTo( options.wellWidth, 0 );
      wellIcon = new Path( wellShape, {
        stroke: QBSColors.potentialEnergyColorProperty,
        lineWidth: QBSConstants.POTENTIAL_ICON_LINE_WIDTH
      } );
    }
    else {
      wellIcon = new FiniteSquareWellsIcon( {
        numberOfWells: 1,
        wellWidth: options.wellWidth,
        wellDepth: options.wellDepth,
        edgeLength: 0
      } );
    }

    // Draw the arrow heads, starting at the tip of each.
    const arrowHeadsShape = new Shape()
      // Left arrow head
      .moveTo( 0, -options.arrowHeadHeight )
      .lineTo( -options.arrowHeadWidth / 2, 0 )
      .lineTo( options.arrowHeadWidth / 2, 0 )
      .close()
      // Right arrow head
      .newSubpath()
      .moveTo( options.wellWidth, -options.arrowHeadHeight )
      .lineTo( options.wellWidth - options.arrowHeadWidth / 2, 0 )
      .lineTo( options.wellWidth + options.arrowHeadWidth / 2, 0 )
      .close();
    const arrowHeadsPath = new Path( arrowHeadsShape, {
      fill: QBSColors.potentialEnergyColorProperty
    } );

    super( {
      children: [ wellIcon, arrowHeadsPath ]
    } );
  }
}

quantumBoundStates.register( 'InfiniteSquareWellIcon', InfiniteSquareWellIcon );