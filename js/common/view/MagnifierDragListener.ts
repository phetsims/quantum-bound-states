// Copyright 2026, University of Colorado Boulder

/**
 * MagnifierDragListener is the drag listener for moving the Magnifier.
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
import { MagnifierProbeNode } from './MagnifierNode.js';

export default class MagnifierDragListener extends SoundRichDragListener {

  public constructor( magnifierProbeNode: MagnifierProbeNode,
                      probePositionProperty: Property<Vector2>,
                      chartTransform: ChartTransform,
                      parentTandem: Tandem ) {

    // Synthesize a ModelViewTransform2 from the ChartTransform.
    const transform = ModelViewTransform2.createOffsetXYScaleMapping(
      //TODO y-offset is incorrect, it is dynamic.
      new Vector2( chartTransform.modelToViewX( 0 ), chartTransform.modelToViewY( 0 ) ), // offset of the origin in view coordinates
      chartTransform.viewWidth / chartTransform.modelXRange.getLength(), // xScale, model to view
      -( chartTransform.viewHeight / chartTransform.modelYRange.getLength() ) // yScale, model to view
    );

    // Drag bounds in model coordinates. y values can be anything because movement is constrained to horizontal.
    const dragBoundsProperty = new Property( new Bounds2( chartTransform.modelXRange.min, 0, chartTransform.modelXRange.max, 0 ) );

    super( {
      transform: transform,
      positionProperty: probePositionProperty,
      dragBoundsProperty: dragBoundsProperty,
      dragListenerOptions: {
        useParentOffset: true //TODO delete this?
      },
      keyboardDragListenerOptions: {
        dragDelta: chartTransform.modelToViewDeltaX( 0.1 ),
        shiftDragDelta: chartTransform.modelToViewDeltaX( 0.01 ),
        moveOnHoldInterval: 50
      },

      end: () => magnifierProbeNode.doAccessibleObjectResponse(),

      tandem: parentTandem
    } );
  }
}
