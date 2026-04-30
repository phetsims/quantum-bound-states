// Copyright 2026, University of Colorado Boulder

/**
 * ReferenceLineDragListener is the drag listener for moving the Reference Line.
 * It supports both pointer and keyboard dragging, with sound feedback.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import TRangedProperty from '../../../../axon/js/TRangedProperty.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import RichDragListener from '../../../../scenery/js/listeners/RichDragListener.js';
import ValueChangeSoundPlayer from '../../../../tambo/js/sound-generators/ValueChangeSoundPlayer.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { ReferenceLineHandleNode } from './ReferenceLineNode.js';

export default class ReferenceLineDragListener extends RichDragListener {

  public constructor( referenceLineHandleNode: ReferenceLineHandleNode,
                      xProperty: TRangedProperty,
                      positionProperty: Property<Vector2>,
                      positionRange: Range,
                      chartTransform: ChartTransform,
                      parentTandem: Tandem ) {

    //TODO Generalize creation of ModelViewTransform2 in QBSChartTransform extends ChartTransform.

    // Synthesize a ModelViewTransform2 from the ChartTransform.
    const transform = ModelViewTransform2.createOffsetXYScaleMapping(
      //TODO y-offset is incorrect, y-range is dynamic.
      chartTransform.modelToViewPosition( Vector2.ZERO ), // offset of the origin in view coordinates
      chartTransform.viewWidth / chartTransform.modelXRange.getLength(), // xScale, model to view
      //TODO y-scale is incorrect, y-range is dynamic. But reference line only moves horizontally, so maybe that's OK.
      -( chartTransform.viewHeight / chartTransform.modelYRange.getLength() ) // yScale, model to view
    );

    // Drag bounds in model coordinates. y values can be anything because movement is constrained to horizontal.
    //TODO dragBoundsProperty is incorrect, y-range is dynamic. But reference line only moves horizontally, so maybe that's OK.
    const dragBoundsProperty = new Property( new Bounds2( chartTransform.modelXRange.min, 0, chartTransform.modelXRange.max, 0 ) );

    const soundPlayer = new ValueChangeSoundPlayer( positionRange, {
      minimumInterMiddleSoundTime: 0.1 // seconds
    } );

    super( {
      transform: transform,
      positionProperty: positionProperty,
      dragBoundsProperty: dragBoundsProperty,
      dragListenerOptions: {
        useParentOffset: true
      },
      keyboardDragListenerOptions: {
        keyboardDragDirection: 'leftRight',
        dragDelta: chartTransform.modelToViewDeltaX( 0.1 ),
        shiftDragDelta: chartTransform.modelToViewDeltaX( 0.01 ),
        moveOnHoldInterval: 50
      },

      drag: ( event, listener ) => {
        const previousX = xProperty.value;
        xProperty.value = positionProperty.value.x;
        soundPlayer.playSoundForValueChange( xProperty.value, previousX );
      },

      end: () => referenceLineHandleNode.describeMoved(),

      tandem: parentTandem
    } );
  }
}
