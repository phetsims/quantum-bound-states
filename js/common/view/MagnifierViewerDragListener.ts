// Copyright 2026, University of Colorado Boulder

/**
 * MagnifierViewerDragListener is the drag listener for moving the magnifier's viewer.
 * It supports both pointer and keyboard dragging, with sound feedback.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import SoundRichDragListener from '../../../../scenery-phet/js/SoundRichDragListener.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { MagnifierViewerNode } from './MagnifierNode.js';

export default class MagnifierViewerDragListener extends SoundRichDragListener {

  public constructor( viewerNode: MagnifierViewerNode,
                      viewerPositionProperty: Property<Vector2>,
                      chartTransform: ChartTransform,
                      parentTandem: Tandem ) {

    // Synthesize a ModelViewTransform2 from the ChartTransform.
    const transform = ModelViewTransform2.createOffsetXYScaleMapping(
      //TODO y-offset is incorrect, energyDiagram.yRangeProperty is dynamic.
      chartTransform.modelToViewPosition( Vector2.ZERO ), // offset of the origin in view coordinates
      chartTransform.viewWidth / chartTransform.modelXRange.getLength(), // xScale, model to view
      //TODO y-scale is incorrect, y-range is dynamic.
      -( chartTransform.viewHeight / chartTransform.modelYRange.getLength() ) // yScale, model to view
    );

    // Drag bounds in model coordinates, adjusted for the size of the viewer.
    // y values can be anything because movement is constrained to horizontal.
    //TODO dragBoundsProperty is incorrect, energyDiagram.yRangeProperty is dynamic.
    const viewerWith = chartTransform.viewToModelDeltaX( viewerNode.width );
    const viewerHeight = chartTransform.viewToModelDeltaY( viewerNode.height );
    const dragBoundsProperty = new Property( new Bounds2( chartTransform.modelXRange.min, chartTransform.modelYRange.min - viewerHeight,
      chartTransform.modelXRange.max - viewerWith, chartTransform.modelYRange.max ) );

    super( {
      transform: transform,
      positionProperty: viewerPositionProperty,
      dragBoundsProperty: dragBoundsProperty,
      dragListenerOptions: {
        useParentOffset: true //TODO delete this?
      },
      keyboardDragListenerOptions: {
        dragDelta: chartTransform.modelToViewDeltaX( 0.1 ),
        shiftDragDelta: chartTransform.modelToViewDeltaX( 0.01 ),
        moveOnHoldInterval: 50
      },
      end: () => viewerNode.doAccessibleObjectResponse(),
      tandem: parentTandem
    } );
  }
}
