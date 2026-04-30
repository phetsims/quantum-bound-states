// Copyright 2026, University of Colorado Boulder

/**
 * EnergyAxisDragListener is the drag listener for the drag handle that appears on the y-axis of the Energy Diagram.
 * If supports dragging with pointer and keyboard.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import { clamp } from '../../../../dot/js/util/clamp.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import RichDragListener from '../../../../scenery/js/listeners/RichDragListener.js';
import ValueChangeSoundPlayer from '../../../../tambo/js/sound-generators/ValueChangeSoundPlayer.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumPotential from '../model/potentials/QuantumPotential.js';
import EnergyAxisDragHandle from './EnergyAxisDragHandle.js';

export default class EnergyAxisDragListener extends RichDragListener {

  public constructor( energyAxisDragHandle: EnergyAxisDragHandle,
                      potentialProperty: TReadOnlyProperty<QuantumPotential>,
                      energyDiagramRectangleBounds: Bounds2,
                      energyDiagramChartTransform: ChartTransform,
                      tandem: Tandem ) {

    // Create a positionProperty so that we can get listener.modelDelta.y.
    const positionProperty = new Vector2Property( new Vector2( 0, 0 ) );

    // Constrain the drag bounds to the y dimension of the Energy Diagram rectangle.
    const dragBoundsProperty = new Property( new Bounds2(
      energyDiagramRectangleBounds.minX,
      energyDiagramRectangleBounds.minY,
      energyDiagramRectangleBounds.minX,
      energyDiagramRectangleBounds.maxY ) );

    // Use the range of yOffsetProperty for the selected potential to determine the sound range.
    let soundPlayer: ValueChangeSoundPlayer;
    potentialProperty.link( potential => {
      soundPlayer = new ValueChangeSoundPlayer( potential.yOffsetProperty.range );
    } );

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

      drag: ( event, listener ) => {

        const previousYOffset = potentialProperty.value.yOffsetProperty.value;

        // Compute the new yOffset value.
        const dy = energyDiagramChartTransform.viewToModelDeltaY( listener.modelDelta.y );
        let yOffset = potentialProperty.value.yOffsetProperty.value - dy;
        yOffset = clamp( yOffset, potentialProperty.value.yOffsetProperty.range.min, potentialProperty.value.yOffsetProperty.range.max );
        potentialProperty.value.yOffsetProperty.value = yOffset;

        // Play sound to communicate how yOffset changed, similar to Slider behavior.
        soundPlayer.playSoundForValueChange( yOffset, previousYOffset );
      },

      end: ( event, listener ) => energyAxisDragHandle.describeMoved()
    } );
  }
}