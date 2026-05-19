// Copyright 2026, University of Colorado Boulder

/**
 * FiniteSquareDepthDragListener is the drag listener for changing the well depth of a Finite Square potential.
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
import FiniteSquarePotential from '../../model/potentials/FiniteSquarePotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import PotentialDragHandleNode from './PotentialDragHandleNode.js';

// Drag deltas in eV.
const DRAG_DELTA = 0.5;
const SHIFT_DRAG_DELTA = 0.1;

export default class FiniteSquareDepthDragListener extends RichDragListener {

  public constructor( dragHandleNode: PotentialDragHandleNode,
                      potential: FiniteSquarePotential,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      parentTandem: Tandem ) {

    const wellDepthProperty = potential.wellDepthProperty;
    const chartTransform = energyDiagramNode.chartTransform;

    // Create a positionProperty so that we can get listener.modelDelta.
    const positionProperty = new Vector2Property( new Vector2( 0, 0 ) );

    // Constrain the drag bounds.
    const energyDiagramRectangleBounds = energyDiagramNode.getChartRectangleGlobalBounds();
    const dragBoundsProperty = new DerivedProperty( [ potential.yOffsetProperty ],
      yOffset => new Bounds2(
        energyDiagramRectangleBounds.minX,
        chartTransform.modelToViewY( yOffset + wellDepthProperty.range.max ),
        energyDiagramRectangleBounds.maxX,
        chartTransform.modelToViewY( yOffset + wellDepthProperty.range.min ) ) );

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
        keyboardDragDirection: 'upDown',
        // Invert the sign on dragDelta and shiftDragDelta because drag events are in view coordinates, where +y is down.
        dragDelta: -chartTransform.modelToViewDeltaY( DRAG_DELTA ),
        shiftDragDelta: -chartTransform.modelToViewDeltaY( SHIFT_DRAG_DELTA ),
        moveOnHoldInterval: 20
      },

      start: ( event, listener ) => {
        wasPlaying = time.isPlayingProperty.value;
        time.isPlayingProperty.value = false;
        time.restart();
      },

      drag: ( event, listener ) => {

        // Remember the Property's previous value for sound feedback.
        const previousWellDepth = wellDepthProperty.value;

        // Update the Property.
        const deltaDepth = chartTransform.viewToModelDeltaY( listener.modelDelta.y );
        wellDepthProperty.value = wellDepthProperty.range.clampValue( wellDepthProperty.value + deltaDepth );

        // Play sound to communicate how the Property changed.
        soundPlayer.playSoundForValueChange( wellDepthProperty.value, previousWellDepth );
      },

      end: ( event, listener ) => {
        dragHandleNode.describeMoved();
        time.isPlayingProperty.value = wasPlaying;
      }
    } );
  }
}