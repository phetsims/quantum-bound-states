// Copyright 2026, University of Colorado Boulder

/**
 * PotentialDragListener is the base class for drag listeners that change some Property of a quantum potential.
 * It is responsible for pausing the sim while the drag is in progress and for creating a sound player.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TRangedProperty from '../../../../../axon/js/TRangedProperty.js';
import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../../dot/js/Vector2Property.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../../phet-core/js/types/StrictOmit.js';
import RichDragListener, { RichDragListenerOptions } from '../../../../../scenery/js/listeners/RichDragListener.js';
import ValueChangeSoundPlayer from '../../../../../tambo/js/sound-generators/ValueChangeSoundPlayer.js';
import QuantumPotential from '../../model/potentials/QuantumPotential.js';
import QBSTime from '../../model/QBSTime.js';
import PotentialHandleNode from './PotentialHandleNode.js';

type SelfOptions = {
  orientation: 'horizontal' | 'vertical';
  keyboardDragDelta: number; // in model units
  keyboardShiftDragDelta: number; // in model units
};

export type PotentialHandleDragListenerOptions = SelfOptions &
  StrictOmit<RichDragListenerOptions, 'positionProperty' | 'transform' | 'keyboardDragListenerOptions' | 'start' | 'end'>;

export default class PotentialDragListener<T extends QuantumPotential> extends RichDragListener {

  private readonly valueChangeSoundPlayer: ValueChangeSoundPlayer;

  protected constructor( handleNode: PotentialHandleNode<T>,
                         rangedProperty: TRangedProperty,
                         chartTransform: ChartTransform,
                         time: QBSTime,
                         providedOptions: PotentialHandleDragListenerOptions ) {

    // Remember whether the sim was playing when the drag started, so that we can restore it after the drag ends.
    let wasPlaying = time.isPlayingProperty.value;

    // SelfOptions keyboardDragDelta and keyboardShiftDragDelta are in model units, so convert them to view units.
    // When dragging vertically, invert the sign on dragDelta and shiftDragDelta because drag events are in
    // view coordinates, where +y is down.
    const keyboardDragDeltaView = ( providedOptions.orientation === 'horizontal' ) ?
                                  chartTransform.modelToViewDeltaX( providedOptions.keyboardDragDelta ) :
                                  -chartTransform.modelToViewDeltaY( providedOptions.keyboardDragDelta );
    const keyboardShiftDragDeltaView = ( providedOptions.orientation === 'horizontal' ) ?
                                       chartTransform.modelToViewDeltaX( providedOptions.keyboardShiftDragDelta ) :
                                       -chartTransform.modelToViewDeltaY( providedOptions.keyboardShiftDragDelta );

    // CONFUSION ALERT!
    // Scenery drag listeners require a ModelViewTransform2 and we have a ChartTransform. So we will not provide
    // a value for options.transform. This means that (according to the scenery drag listener API) positionProperty,
    // dragBoundsProperty, and listener.modelDelta will be in view coordinates. Subclasses will transform those view
    // coordinates to model coordinates using the ChartTransform.
    const options = optionize<PotentialHandleDragListenerOptions, SelfOptions, RichDragListenerOptions>()( {

      // Provide a positionProperty so that subclasses can get listener.modelDelta in their drag callback.
      // This Property can have any initial value and will be synchronized with the drag position in view coordinates.
      positionProperty: new Vector2Property( new Vector2( 0, 0 ) ),

      keyboardDragListenerOptions: {
        keyboardDragDirection: ( providedOptions.orientation === 'horizontal' ) ? 'leftRight' : 'upDown',
        dragDelta: keyboardDragDeltaView,
        shiftDragDelta: keyboardShiftDragDeltaView,
        moveOnHoldInterval: 20
      },

      // When the drag starts, pause the sim.
      start: ( event, listener ) => {
        handleNode.isDraggingProperty.value = true;
        handleNode.moveToFront();
        wasPlaying = time.isPlayingProperty.value;
        time.isPlayingProperty.value = false;
        time.restart();
      },

      // When the drag ends, describe the new state of the sim and restart the sim.
      end: ( event, listener ) => {
        handleNode.isDraggingProperty.value = false;
        handleNode.describeMoved();
        time.isPlayingProperty.value = wasPlaying;
      }
    }, providedOptions );

    super( options );

    this.valueChangeSoundPlayer = new ValueChangeSoundPlayer( rangedProperty.rangeProperty, {
      minimumInterMiddleSoundTime: 0.1 // seconds
    } );
  }

  /**
   * Subclasses should call this method when they change the value of the associated Property.
   */
  protected playSoundForValueChange( newValue: number, oldValue: number ): void {
    this.valueChangeSoundPlayer.playSoundForValueChange( newValue, oldValue );
  }
}