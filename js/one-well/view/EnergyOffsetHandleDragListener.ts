// Copyright 2026, University of Colorado Boulder

//TODO Delete when certain that we will not revert to this approach
/**
 * EnergyOffsetHandleDragListener is the listener for the drag handle that appears on the y-axis of the Energy Diagram.
 * If supports dragging with pointer and keyboard.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import { clamp } from '../../../../dot/js/util/clamp.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import RichDragListener from '../../../../scenery/js/listeners/RichDragListener.js';
import ValueChangeSoundPlayer from '../../../../tambo/js/sound-generators/ValueChangeSoundPlayer.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSTime from '../../common/model/QBSTime.js';
import EnergyOffsetHandleNode from './EnergyOffsetHandleNode.js';

export default class EnergyOffsetHandleDragListener extends RichDragListener {

  public constructor( energyOffsetHandleNode: EnergyOffsetHandleNode,
                      yOffsetProperty: NumberProperty,
                      energyDiagramRectangleBounds: Bounds2,
                      energyDiagramChartTransform: ChartTransform,
                      time: QBSTime,
                      tandem: Tandem ) {

    // Create a positionProperty so that we can get listener.modelDelta.y.
    const positionProperty = new Vector2Property( new Vector2( 0, 0 ) );

    // Constrain the drag bounds to the y dimension of the Energy Diagram rectangle.
    const dragBoundsProperty = new Property( new Bounds2(
      energyDiagramRectangleBounds.minX,
      energyDiagramRectangleBounds.minY,
      energyDiagramRectangleBounds.minX,
      energyDiagramRectangleBounds.maxY ) );

    // Sound behavior is determined by the range of yOffsetProperty for the selected potential.
    const soundPlayer = new ValueChangeSoundPlayer( yOffsetProperty.rangeProperty, {
      minimumInterMiddleSoundTime: 0.1 // seconds
    } );

    let wasPlaying = time.isPlayingProperty.value;

    super( {
      tandem: tandem,
      positionProperty: positionProperty,
      dragBoundsProperty: dragBoundsProperty,

      keyboardDragListenerOptions: {
        keyboardDragDirection: 'upDown',
        dragDelta: -energyDiagramChartTransform.modelToViewDeltaY( 0.5 ),
        shiftDragDelta: -energyDiagramChartTransform.modelToViewDeltaY( 0.1 ),
        moveOnHoldInterval: 20
      },

      start: ( event, listener ) => {
        wasPlaying = time.isPlayingProperty.value;
        time.isPlayingProperty.value = false;
        time.restart();
      },

      drag: ( event, listener ) => {

        const previousYOffset = yOffsetProperty.value;

        // Compute the new yOffset value.
        const dy = energyDiagramChartTransform.viewToModelDeltaY( listener.modelDelta.y );
        let yOffset = yOffsetProperty.value - dy;
        yOffset = clamp( yOffset, yOffsetProperty.range.min, yOffsetProperty.range.max );
        yOffsetProperty.value = yOffset;

        // Play sound to communicate how yOffset changed.
        soundPlayer.playSoundForValueChange( yOffset, previousYOffset );
      },

      end: ( event, listener ) => {
        energyOffsetHandleNode.describeMoved();
        time.isPlayingProperty.value = wasPlaying;
      }
    } );
  }
}