// Copyright 2026, University of Colorado Boulder

/**
 * MagnifierToolNode is the view of the magnifier tool.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import ShadedRectangle from '../../../../scenery-phet/js/ShadedRectangle.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import MagnifierTool from '../model/MagnifierTool.js';
import QBSColors from '../QBSColors.js';

const BODY_SIZE = new Dimension2( 175, 75 );
const X_MARGIN = 10;
const Y_MARGIN = 10;

export default class MagnifierToolNode extends Node {

  public constructor( magnifierTool: MagnifierTool, tandem: Tandem ) {

    const bodyNode = new ShadedRectangle( new Bounds2( 0, 0, BODY_SIZE.width, BODY_SIZE.height ), {
      baseColor: QBSColors.magnifierToolBodyColorProperty,
      lightOffset: 0.95
    } );

    //TODO This should be a bamboo chart.
    const displayNode = new Rectangle( 0, 0, BODY_SIZE.width - 2 * X_MARGIN, BODY_SIZE.height - 2 * Y_MARGIN, {
      fill: QBSColors.magnifierToolDisplayFillProperty,
      stroke: QBSColors.magnifierToolDisplayStrokeProperty,
      center: bodyNode.center
    } );

    super( {
      children: [ bodyNode, displayNode ],
      visibleProperty: magnifierTool.visibleProperty,
      tandem: tandem
    } );
  }
}

quantumBoundStates.register( 'MagnifierToolNode', MagnifierToolNode );