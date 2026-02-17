// Copyright 2026, University of Colorado Boulder

//TODO Base this on DetectorNode in beers-law-lab.
/**
 * MagnifierToolNode is the view of the magnifier tool.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import AccessibleDraggableOptions from '../../../../scenery-phet/js/accessibility/grab-drag/AccessibleDraggableOptions.js';
import ProbeNode, { ProbeNodeOptions } from '../../../../scenery-phet/js/ProbeNode.js';
import ShadedRectangle from '../../../../scenery-phet/js/ShadedRectangle.js';
import InteractiveHighlighting from '../../../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import Node from '../../../../scenery/js/nodes/Node.js';
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

export default class MagnifierToolNode extends Node {

  public constructor( magnifierTool: MagnifierTool, tandem: Tandem ) {

    const bodyNode = new MagnifierToolBodyNode();

    const probeNode = new MagnifierToolProbeNode( tandem.createTandem( 'probeNode' ) );

    super( {
      children: [ bodyNode, probeNode ],
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
      radius: 26,
      innerRadius: 20,
      handleWidth: 34,
      handleHeight: 30,
      handleCornerRadius: 11,
      lightAngle: 1.25 * Math.PI,
      color: QBSColors.magnifierToolProbeColorProperty,
      sensorTypeFunction: ProbeNode.crosshairs( {
        stroke: QBSColors.magnifierToolCrosshairsStrokeProperty
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

quantumBoundStates.register( 'MagnifierToolNode', MagnifierToolNode );