// Copyright 2026, University of Colorado Boulder

/**
 * PotentialDragListener is the base class for drag listeners that change some Property of a quantum potential.
 * It is responsible for pausing the sim while the drag is in progress and for creating a sound player.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TRangedProperty from '../../../../../axon/js/TRangedProperty.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../../dot/js/Vector2Property.js';
import optionize, { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../../phet-core/js/types/StrictOmit.js';
import RichDragListener, { RichDragListenerOptions } from '../../../../../scenery/js/listeners/RichDragListener.js';
import ValueChangeSoundPlayer from '../../../../../tambo/js/sound-generators/ValueChangeSoundPlayer.js';
import QuantumPotential from '../../model/potentials/QuantumPotential.js';
import QBSTime from '../../model/QBSTime.js';
import PotentialDragHandleNode from './PotentialDragHandleNode.js';

type SelfOptions = EmptySelfOptions;

export type PotentialDragListenerOptions = SelfOptions &
  StrictOmit<RichDragListenerOptions, 'positionProperty' | 'transform' | 'start' | 'end'>;

export default class PotentialDragListener<T extends QuantumPotential> extends RichDragListener {

  private readonly valueChangeSoundPlayer: ValueChangeSoundPlayer;

  protected constructor( dragHandleNode: PotentialDragHandleNode<T>,
                         rangedProperty: TRangedProperty,
                         time: QBSTime,
                         providedOptions: PotentialDragListenerOptions ) {

    // Remember whether the sim was playing when the drag started, so that we can restore it after the drag ends.
    let wasPlaying = time.isPlayingProperty.value;

    const options = optionize<PotentialDragListenerOptions, SelfOptions, RichDragListenerOptions>()( {

      // We will not provide a transform value, so all drag events (including listener.modelDelta) will be in view coordinates.
      // Provide a positionProperty so that we can get listener.modelDelta.
      positionProperty: new Vector2Property( new Vector2( 0, 0 ) ),

      // When the drag starts, pause the sim.
      start: ( event, listener ) => {
        wasPlaying = time.isPlayingProperty.value;
        time.isPlayingProperty.value = false;
        time.restart();
      },

      // When the drag ends, describe the new state of the sim and restart the sim.
      end: ( event, listener ) => {
        dragHandleNode.describeMoved();
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