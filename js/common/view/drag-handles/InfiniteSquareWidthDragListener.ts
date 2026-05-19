// Copyright 2026, University of Colorado Boulder

/**
 * InfiniteSquareWidthDragListener is the drag listener for changing the well width of an Infinite Square potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../../dot/js/Vector2Property.js';
import RichDragListener from '../../../../../scenery/js/listeners/RichDragListener.js';
import ValueChangeSoundPlayer from '../../../../../tambo/js/sound-generators/ValueChangeSoundPlayer.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import InfiniteSquarePotential from '../../model/potentials/InfiniteSquarePotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import PotentialDragHandleNode from './PotentialDragHandleNode.js';

// Drag deltas in nm.
const DRAG_DELTA = 0.5;
const SHIFT_DRAG_DELTA = 0.1;

export default class InfiniteSquareWidthDragListener extends RichDragListener {

  public constructor( dragHandleNode: PotentialDragHandleNode,
                      potential: InfiniteSquarePotential,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      parentTandem: Tandem ) {

    const wellWidthProperty = potential.wellWidthProperty;
    const chartTransform = energyDiagramNode.chartTransform;

    // Create a positionProperty so that we can get listener.modelDelta.
    const positionProperty = new Vector2Property( new Vector2( 0, 0 ) );

    // Constrain the drag bounds.
    const energyDiagramRectangleBounds = energyDiagramNode.getChartRectangleGlobalBounds();
    const dragBoundsProperty = new DerivedProperty( [ potential.xOffsetProperty ],
      xOffset => new Bounds2(
        chartTransform.modelToViewX( xOffset + wellWidthProperty.range.min ),
        energyDiagramRectangleBounds.minY,
        chartTransform.modelToViewX( xOffset + wellWidthProperty.range.max ),
        energyDiagramRectangleBounds.maxY ) );

    const soundPlayer = new ValueChangeSoundPlayer( potential.wellWidthProperty.rangeProperty, {
      minimumInterMiddleSoundTime: 0.1 // seconds
    } );

    // Remember whether the sim was playing when the drag started, so that we can restart it after the drag ends.
    let wasPlaying = time.isPlayingProperty.value;

    // Since we are not providing a transform option value, all drag events (including listener.modelDelta) are in view coordinates.
    super( {
      tandem: parentTandem,
      positionProperty: positionProperty,
      dragBoundsProperty: dragBoundsProperty,

      keyboardDragListenerOptions: {
        keyboardDragDirection: 'leftRight',
        dragDelta: chartTransform.modelToViewDeltaX( DRAG_DELTA ),
        shiftDragDelta: chartTransform.modelToViewDeltaX( SHIFT_DRAG_DELTA ),
        moveOnHoldInterval: 20
      },

      start: ( event, listener ) => {
        wasPlaying = time.isPlayingProperty.value;
        time.isPlayingProperty.value = false;
        time.restart();
      },

      drag: ( event, listener ) => {

        // Remember the Property's previous value for sound feedback.
        const previousWellWidth = wellWidthProperty.value;

        // Update the Property.
        const deltaWidth = 2 * chartTransform.viewToModelDeltaX( listener.modelDelta.x );
        wellWidthProperty.value = wellWidthProperty.range.clampValue( wellWidthProperty.value + deltaWidth );

        // Play sound to communicate how the Property changed.
        soundPlayer.playSoundForValueChange( wellWidthProperty.value, previousWellWidth );
      },

      end: ( event, listener ) => {
        dragHandleNode.describeMoved();
        time.isPlayingProperty.value = wasPlaying;
      }
    } );
  }
}