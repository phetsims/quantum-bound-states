// Copyright 2026, University of Colorado Boulder

/**
 * ReferenceLine is the view for the reference line, a vertical line that connects the same x-coordinate in all graphs.
 * The x-coordinate is changed by dragging a handle left and right.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import AccessibleDraggableOptions from '../../../../scenery-phet/js/accessibility/grab-drag/AccessibleDraggableOptions.js';
import ShadedSphereNode, { ShadedSphereNodeOptions } from '../../../../scenery-phet/js/ShadedSphereNode.js';
import SoundRichDragListener from '../../../../scenery-phet/js/SoundRichDragListener.js';
import InteractiveHighlighting from '../../../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import ReferenceLine from '../model/ReferenceLine.js';
import QBSColors from '../QBSColors.js';
import QBSConstants from '../QBSConstants.js';

type SelfOptions = {

  // The top and bottom y-coordinates of the vertical line, in view coordinates.
  lineTop: number;
  lineBottom: number;
};

type ReferenceLineNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class ReferenceLineNode extends Node {

  public constructor( referenceLine: ReferenceLine,
                      chartTransform: ChartTransform,
                      providedOptions: ReferenceLineNodeOptions ) {

    // Spherical handle that can be dragged left and right to change the x-coordinate of the reference line.
    const handleNode = new ReferenceLineHandleNode( referenceLine, chartTransform, providedOptions.tandem.createTandem( 'handleNode' ) );
    handleNode.centerY = providedOptions.lineBottom;

    // Vertical line that passes through all graphs.
    const verticalLine = new Line( 0, providedOptions.lineTop, 0, providedOptions.lineBottom, {
      stroke: QBSColors.referenceLineStrokeProperty,
      lineWidth: 1,
      pickable: false // optimization
    } );

    const options = optionize<ReferenceLineNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      isDisposable: false,
      children: [ verticalLine, handleNode ],
      visibleProperty: referenceLine.visibleProperty,
      accessibleHeading: QuantumBoundStatesFluent.a11y.referenceLine.accessibleHeadingStringProperty,
      accessibleParagraph: QuantumBoundStatesFluent.a11y.referenceLine.accessibleParagraphStringProperty
    }, providedOptions );

    super( options );

    referenceLine.xProperty.link( x => {
      verticalLine.x = chartTransform.modelToViewX( x );
    } );
  }
}

/**
 * ReferenceLineHandleNode is the interactive part of the reference line. It can be dragged horizontally.
 */
class ReferenceLineHandleNode extends InteractiveHighlighting( ShadedSphereNode ) {

  public constructor( referenceLine: ReferenceLine, chartTransform: ChartTransform, tandem: Tandem ) {

    const options = combineOptions<ShadedSphereNodeOptions>( {
      isDisposable: false,
      cursor: 'ew-resize',
      mainColor: QBSColors.referenceLineHandleColorProperty,
      accessibleName: QuantumBoundStatesFluent.a11y.referenceLine.handle.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.referenceLine.handle.accessibleHelpTextStringProperty,
      tandem: tandem
    }, AccessibleDraggableOptions );

    super( QBSConstants.HANDLE_DIAMETER, options );

    // Synthesize a ModelViewTransform2 from the ChartTransform.
    const transform = ModelViewTransform2.createOffsetXYScaleMapping(
      new Vector2( 0, chartTransform.viewHeight / 2 ), // offset of the origin in view coordinates
      chartTransform.viewWidth / chartTransform.modelXRange.getLength(), // xScale, model to view
      -( chartTransform.viewHeight / chartTransform.modelYRange.getLength() ) // yScale, model to view
    );

    // Initial position in model coordinates. y-value can be anything because movement is constrained to horizontal.
    const positionProperty = new Property( new Vector2( referenceLine.xProperty.value, 0 ) );

    // Drag bounds in model coordinates. y values can be anything because movement is constrained to horizontal.
    const dragBoundsProperty = new Property( new Bounds2( chartTransform.modelXRange.min, 0, chartTransform.modelXRange.max, 0 ) );

    // As the handle is dragged, change xProperty.
    this.addInputListener( new SoundRichDragListener( {
      transform: transform,
      positionProperty: positionProperty,
      dragBoundsProperty: dragBoundsProperty,

      dragListenerOptions: {
        useParentOffset: true
      },
      keyboardDragListenerOptions: {
        dragSpeed: 300, // in view coordinates per second
        shiftDragSpeed: 75
      },

      drag: ( event, listener ) => {
        referenceLine.xProperty.value = positionProperty.value.x;
      },

      end: () => this.doAccessibleObjectResponse(),

      tandem: tandem
    } ) );

    referenceLine.xProperty.link( x => {
      this.x = chartTransform.modelToViewX( x );
    } );

    this.focusedProperty.lazyLink( focused => {
      focused && this.doAccessibleObjectResponse();
    } );
  }

  /**
   * Accessible response when the handle is moved or gets focus.
   */
  public doAccessibleObjectResponse(): void {
    this.addAccessibleObjectResponse( QuantumBoundStatesFluent.a11y.referenceLine.handle.accessibleObjectResponseStringProperty );
  }
}

quantumBoundStates.register( 'ReferenceLineNode', ReferenceLineNode );