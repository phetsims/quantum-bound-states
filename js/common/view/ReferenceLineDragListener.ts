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
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import RichDragListener from '../../../../scenery/js/listeners/RichDragListener.js';
import ValueChangeSoundPlayer from '../../../../tambo/js/sound-generators/ValueChangeSoundPlayer.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { ReferenceLineHandleNode } from './ReferenceLineNode.js';

export default class ReferenceLineDragListener extends RichDragListener {

  public constructor( referenceLineHandleNode: ReferenceLineHandleNode,
                      xProperty: TRangedProperty,
                      chartTransform: ChartTransform,
                      parentTandem: Tandem ) {

    const soundPlayer = new ValueChangeSoundPlayer( xProperty.range, {
      minimumInterMiddleSoundTime: 0.1 // seconds
    } );

    // CONFUSION ALERT!
    // Scenery drag listeners require a ModelViewTransform2 and we have a ChartTransform. So we will not provide a
    // value for the transform option. This means that (according to the drag listener API) positionProperty,
    // dragBoundsProperty, and listener.modelDelta will be in view units.
    super( {

      // Provide a positionProperty so that drag callback can get listener.modelDelta.
      // This Property can have any initial value and will be synchronized with the drag position in view coordinates.
      positionProperty: new Vector2Property( new Vector2( 0, 0 ) ),

      // Drag bounds in view coordinates. y values can be anything because movement is constrained to horizontal.
      dragBoundsProperty: new Property( new Bounds2(
        chartTransform.modelToViewX( chartTransform.modelXRange.min ), 0,
        chartTransform.modelToViewX( chartTransform.modelXRange.max ), 0 ) ),

      keyboardDragListenerOptions: {
        keyboardDragDirection: 'leftRight',
        dragDelta: chartTransform.modelToViewDeltaX( 0.1 ),
        shiftDragDelta: chartTransform.modelToViewDeltaX( 0.01 ),
        moveOnHoldInterval: 50
      },

      drag: ( event, listener ) => {
        const previousX = xProperty.value;
        const deltaX = chartTransform.viewToModelDeltaX( listener.modelDelta.x );
        xProperty.value = xProperty.range.constrainValue( previousX + deltaX );
        soundPlayer.playSoundForValueChange( xProperty.value, previousX );
      },

      end: () => referenceLineHandleNode.describeMoved(),

      tandem: parentTandem
    } );
  }
}
