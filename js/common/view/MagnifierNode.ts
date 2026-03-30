// Copyright 2026, University of Colorado Boulder

//TODO Base this on DetectorNode in beers-law-lab.
/**
 * MagnifierNode is the view of the magnifier.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import { linear } from '../../../../dot/js/util/linear.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import AccessibleDraggableOptions from '../../../../scenery-phet/js/accessibility/grab-drag/AccessibleDraggableOptions.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import ProbeNode, { ProbeNodeOptions } from '../../../../scenery-phet/js/ProbeNode.js';
import ShadedRectangle from '../../../../scenery-phet/js/ShadedRectangle.js';
import InteractiveHighlighting from '../../../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import Magnifier from '../model/Magnifier.js';
import QBSColors from '../QBSColors.js';
import QBSConstants from '../QBSConstants.js';
import MagnifierBodyDragListener from './MagnifierBodyDragListener.js';
import MagnifierProbeDragListener from './MagnifierProbeDragListener.js';

const DISPLAY_SIZE = new Dimension2( 170, 70 );
const CORNER_RADIUS = 8;
const BEZEL_WIDTH = 5;
const BOTTOM_BEZEL_WIDTH = 20;

export default class MagnifierNode extends Node {

  public constructor( magnifier: Magnifier, chartTransform: ChartTransform, tandem: Tandem ) {

    const bodyNode = new MagnifierBodyNode( magnifier, chartTransform, tandem.createTandem( 'bodyNode' ) );

    const probeNode = new MagnifierProbeNode( magnifier, chartTransform, tandem.createTandem( 'probeNode' ) );

    const wireNode = new MagnifierWireNode( bodyNode, probeNode );

    super( {
      children: [ bodyNode, wireNode, probeNode ],
      visibleProperty: magnifier.visibleProperty,
      accessibleHeading: QuantumBoundStatesFluent.a11y.magnifier.accessibleHeadingStringProperty,
      accessibleParagraph: QuantumBoundStatesFluent.a11y.magnifier.accessibleParagraphStringProperty,
      tandem: tandem
    } );

    this.pdomOrder = [ probeNode, bodyNode ];
  }
}

/**
 * MagnifierBodyNode is the body of the magnifier, where the magnified energy levels are displayed.
 */
export class MagnifierBodyNode extends InteractiveHighlighting( Node ) {

  public constructor( magnifier: Magnifier, chartTransform: ChartTransform, tandem: Tandem ) {

    const options = combineOptions<NodeOptions>( {}, AccessibleDraggableOptions, {
      cursor: 'pointer',
      accessibleName: QuantumBoundStatesFluent.a11y.magnifier.body.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.magnifier.body.accessibleHelpTextStringProperty,
      tandem: tandem,
      phetioInputEnabledPropertyInstrumented: true,
      phetioVisiblePropertyInstrumented: false
    } );

    const shadedRectangle = new ShadedRectangle( new Bounds2( 0, 0,
      DISPLAY_SIZE.width + BEZEL_WIDTH + 2,
      DISPLAY_SIZE.height + BEZEL_WIDTH + BOTTOM_BEZEL_WIDTH ), {
      baseColor: QBSColors.magnifierBodyColorProperty,
      lightOffset: 0.95,
      cornerRadius: CORNER_RADIUS
    } );

    //TODO This should be a bamboo chart.
    const displayNode = new Rectangle( 0, 0, DISPLAY_SIZE.width, DISPLAY_SIZE.height, {
      fill: QBSColors.magnifierDisplayFillProperty,
      stroke: QBSColors.magnifierDisplayStrokeProperty,
      cornerRadius: CORNER_RADIUS / 2, //TODO Why is divided by 2 needed to match ShadedRectangle?
      centerX: shadedRectangle.centerX,
      top: shadedRectangle.top + BEZEL_WIDTH
    } );

    //TODO temporarily display probe position as (x,y)
    const xyStringProperty = new DerivedProperty( [ magnifier.probePositionProperty ],
      probePosition => `(${toFixed( probePosition.x, 2 )}, ${toFixed( probePosition.y, 2 )})` );
    const xyText = new Text( xyStringProperty, {
      font: new PhetFont( 12 ),
      fill: 'red'
    } );
    xyText.boundsProperty.link( bounds => {
      xyText.center = displayNode.center;
    } );

    const powerStringProperty = new PatternStringProperty( QuantumBoundStatesFluent.magnificationPowerStringProperty, {
      value: Magnifier.MAGNIFICATION_POWER
    } );
    const powerText = new Text( powerStringProperty, {
      font: new PhetFont( 16 ),
      fill: QBSColors.magnifierPowerTextColorProperty,
      centerX: shadedRectangle.centerX,
      top: displayNode.bottom,
      maxWidth: DISPLAY_SIZE.width,
      maxHeight: BOTTOM_BEZEL_WIDTH - 3
    } );

    options.children = [ shadedRectangle, displayNode, xyText, powerText ];

    super( options );

    this.addInputListener( new MagnifierBodyDragListener( this, magnifier.bodyPositionProperty, chartTransform, tandem ) );

    magnifier.bodyPositionProperty.link( bodyPosition => {
      this.translation = chartTransform.modelToViewPosition( bodyPosition );
    } );
  }

  public doAccessibleObjectResponse(): void {
    this.addAccessibleObjectResponse( QuantumBoundStatesFluent.a11y.magnifier.body.accessibleObjectResponseStringProperty );
  }
}

/**
 * MagnifierProbeNode is the movable probe, for selecting which part of the Energy graph is displayed.
 */
export class MagnifierProbeNode extends InteractiveHighlighting( ProbeNode ) {

  public constructor( magnifier: Magnifier, chartTransform: ChartTransform, tandem: Tandem ) {

    const options = combineOptions<ProbeNodeOptions>( {}, AccessibleDraggableOptions, QBSConstants.PROBE_NODE_OPTIONS, {
      cursor: 'pointer',
      accessibleName: QuantumBoundStatesFluent.a11y.magnifier.probe.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.magnifier.probe.accessibleHelpTextStringProperty,
      tandem: tandem,
      phetioInputEnabledPropertyInstrumented: true,
      phetioVisiblePropertyInstrumented: false
    } );

    super( options );

    this.addInputListener( new MagnifierProbeDragListener( this, magnifier.probePositionProperty, chartTransform, tandem ) );

    magnifier.probePositionProperty.link( probePosition => {
      this.translation = chartTransform.modelToViewPosition( probePosition );
    } );
  }

  public doAccessibleObjectResponse(): void {
    this.addAccessibleObjectResponse( QuantumBoundStatesFluent.a11y.magnifier.probe.accessibleObjectResponseStringProperty );
  }
}

/**
 * MagnifierWireNode is the wire that connects the body and probe.
 */
class MagnifierWireNode extends Path {

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
      stroke: QBSColors.magnifierWireStrokeProperty,
      lineWidth: 3,
      lineCap: 'square',
      lineJoin: 'round',
      pickable: false
    } );
  }
}
