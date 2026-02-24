// Copyright 2026, University of Colorado Boulder

//TODO Base this on DetectorNode in beers-law-lab.
/**
 * MagnifierNode is the view of the magnifier.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import { linear } from '../../../../dot/js/util/linear.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import AccessibleDraggableOptions from '../../../../scenery-phet/js/accessibility/grab-drag/AccessibleDraggableOptions.js';
import ProbeNode, { ProbeNodeOptions } from '../../../../scenery-phet/js/ProbeNode.js';
import ShadedRectangle from '../../../../scenery-phet/js/ShadedRectangle.js';
import InteractiveHighlighting from '../../../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import MagnifierTool from '../model/MagnifierTool.js';
import QBSColors from '../QBSColors.js';

const BODY_SIZE = new Dimension2( 175, 75 );
const CORNER_RADIUS = 8;
const X_MARGIN = 5;
const Y_MARGIN = 5;

export default class MagnifierNode extends Node {

  public constructor( magnifierTool: MagnifierTool, tandem: Tandem ) {

    const bodyNode = new MagnifierToolBodyNode();

    const probeNode = new MagnifierToolProbeNode( tandem.createTandem( 'probeNode' ) );

    const wireNode = new MagnifierToolWireNode( bodyNode, probeNode );

    super( {
      children: [ wireNode, bodyNode, probeNode ],
      visibleProperty: magnifierTool.visibleProperty,
      accessibleHeading: QuantumBoundStatesFluent.a11y.magnifierTool.accessibleHeadingStringProperty,
      accessibleParagraph: QuantumBoundStatesFluent.a11y.magnifierTool.accessibleParagraphStringProperty,
      tandem: tandem
    } );

    //TODO delete this
    probeNode.right = bodyNode.left - 50;
    probeNode.top = bodyNode.bottom;
  }
}

/**
 * MagnifierToolBodyNode is the body of the magnifier, where the magnified energy levels are displayed.
 */
class MagnifierToolBodyNode extends Node {

  public constructor() {

    const shadedRectangle = new ShadedRectangle( new Bounds2( 0, 0, BODY_SIZE.width, BODY_SIZE.height ), {
      baseColor: QBSColors.magnifierToolBodyColorProperty,
      lightOffset: 0.95,
      cornerRadius: CORNER_RADIUS
    } );

    //TODO This should be a bamboo chart.
    const displayNode = new Rectangle( 0, 0, BODY_SIZE.width - 2 * X_MARGIN, BODY_SIZE.height - 2 * Y_MARGIN, {
      fill: QBSColors.magnifierToolDisplayFillProperty,
      stroke: QBSColors.magnifierToolDisplayStrokeProperty,
      cornerRadius: CORNER_RADIUS / 2, //TODO Why is divided by 2 needed to match ShadedRectangle?
      center: shadedRectangle.center
    } );

    super( {
      children: [ shadedRectangle, displayNode ]
    } );
  }
}

/**
 * MagnifierToolProbeNode is the movable probe, for selecting which part of the Energy graph is displayed.
 */
class MagnifierToolProbeNode extends InteractiveHighlighting( ProbeNode ) {

  public constructor( tandem: Tandem ) {

    const options = combineOptions<ProbeNodeOptions>( {
      cursor: 'pointer',
      radius: 18,
      innerRadius: 14,
      handleWidth: 20,
      handleHeight: 20,
      handleCornerRadius: 8,
      lightAngle: 1.25 * Math.PI,
      color: QBSColors.magnifierToolProbeColorProperty,
      sensorTypeFunction: ProbeNode.crosshairs( {
        stroke: QBSColors.magnifierToolCrosshairsStrokeProperty,
        lineWidth: 2,
        intersectionRadius: 4
      } ),
      accessibleName: QuantumBoundStatesFluent.a11y.magnifierTool.probe.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.magnifierTool.probe.accessibleHelpTextStringProperty,
      tandem: tandem,
      phetioInputEnabledPropertyInstrumented: true,
      phetioVisiblePropertyInstrumented: false
    }, AccessibleDraggableOptions );

    super( options );
  }
}

/**
 * MagnifierToolWireNode is the wire that connects the body and probe.
 */
class MagnifierToolWireNode extends Path {

  public constructor( bodyNode: Node, probeNode: Node ) {

    const shapeProperty = new DerivedProperty( [ bodyNode.boundsProperty, probeNode.boundsProperty ], () => {

      // connection points
      const bodyConnectionPoint = new Vector2( bodyNode.centerX, bodyNode.bottom );
      const probeConnectionPoint = new Vector2( probeNode.centerX, probeNode.bottom );

      // control points
      // The y coordinate of the body's control point varies with the x distance between the body and probe.
      const c1Offset = new Vector2( 0, linear( 0, 800, 0, 200, bodyNode.centerX - probeNode.left ) ); // x distance -> y coordinate
      const c2Offset = new Vector2( 50, 150 );
      const c1 = new Vector2( bodyConnectionPoint.x + c1Offset.x, bodyConnectionPoint.y + c1Offset.y );
      const c2 = new Vector2( probeConnectionPoint.x + c2Offset.x, probeConnectionPoint.y + c2Offset.y );

      // cubic curve
      return new Shape()
        .moveTo( bodyConnectionPoint.x, bodyConnectionPoint.y )
        .cubicCurveTo( c1.x, c1.y, c2.x, c2.y, probeConnectionPoint.x, probeConnectionPoint.y );
    } );

    super( shapeProperty, {

      // PathOptions
      stroke: QBSColors.magnifierToolWireStrokeProperty,
      lineWidth: 3,
      lineCap: 'square',
      lineJoin: 'round',
      pickable: false
    } );
  }
}

quantumBoundStates.register( 'MagnifierNode', MagnifierNode );