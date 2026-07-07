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

  // Updates the associated Property during a drag.
  updateProperty: ( viewPosition: Vector2, viewDelta: Vector2, isFromPDOM: boolean ) => void;

  // Keyboard options
  keyboardDragDelta: number; // in model units
  keyboardShiftDragDelta: number; // in model units
};

export type PotentialHandleDragListenerOptions = SelfOptions &
  StrictOmit<RichDragListenerOptions, 'positionProperty' | 'transform' | 'keyboardDragListenerOptions' | 'start' | 'drag' | 'end'>;

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
    // listener.modelPoint and listener.modelDelta will be in view coordinates. Subclasses will transform those view
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

      start: ( event, listener ) => {
        handleNode.isDraggingProperty.value = true;

        // Move the handle to the front so that it renders on top of other handles.
        handleNode.moveToFront();

        // Pause the sim and restart time.
        wasPlaying = time.isPlayingProperty.value;
        time.isPlayingProperty.value = false;
        time.restart();
      },

      drag: ( event, listener ) => {

        // Remember the Property's previous value for sound feedback.
        const previousValue = rangedProperty.value;

        // Update the associated Property. Since we are not providing options.transform, listener.modelPoint and
        // listener.modelDelta are (confusingly) in view coordinates.
        options.updateProperty( listener.modelPoint, listener.modelDelta, event.isFromPDOM() );

        // Play sound to communicate how the Property changed.
        this.valueChangeSoundPlayer.playSoundForValueChange( rangedProperty.value, previousValue );

        // Mark the event as handled so that it does not bubble up and cause highlighting of energy levels.
        event.handle();
      },

      end: ( event, listener ) => {
        handleNode.isDraggingProperty.value = false;

        // Describe the new state.
        handleNode.describeMoved();

        // Resume playing if the sim was playing when the drag started.
        time.isPlayingProperty.value = wasPlaying;
      }
    }, providedOptions );

    super( options );

    this.valueChangeSoundPlayer = new ValueChangeSoundPlayer( rangedProperty.rangeProperty, {
      minimumInterMiddleSoundTime: 0.1 // seconds
    } );
  }

  /**
   * Given the number of decimal places in the value, computes the drag delta for keyboard dragging.
   * With values that have a single decimal place, we want drag and shift-drag to be the same.
   * See https://github.com/phetsims/quantum-bound-states/issues/89#issuecomment-4907515293
   */
  protected static getKeyboardDragDelta( numberOfDecimalPlaces: number ): number {
    if ( numberOfDecimalPlaces === 1 ) {
      return PotentialDragListener.getKeyboardShiftDragDelta( numberOfDecimalPlaces );
    }
    else {
      return Math.pow( 10, -( numberOfDecimalPlaces - 1 ) );
    }
  }

  /**
   * Given the number of decimal places in the value, computes the shift-drag delta for keyboard dragging.
   */
  protected static getKeyboardShiftDragDelta( numberOfDecimalPlaces: number ): number {
    return Math.pow( 10, -numberOfDecimalPlaces );
  }
}