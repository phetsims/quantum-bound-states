// Copyright 2026, University of Colorado Boulder

/**
 * TimeButtonGroup is the set of buttons for controlling the simulation time.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import PlayPauseButton from '../../../../scenery-phet/js/buttons/PlayPauseButton.js';
import RestartButton from '../../../../scenery-phet/js/buttons/RestartButton.js';
import StepForwardButton from '../../../../scenery-phet/js/buttons/StepForwardButton.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSTime from '../model/QBSTime.js';
import QBSColors from '../QBSColors.js';

const RESTART_BUTTON_RADIUS = 15;
const STEP_FORWARD_BUTTON_RADIUS = RESTART_BUTTON_RADIUS;
const PLAY_PAUSE_BUTTON_RADIUS = 21;
const BUTTON_SPACING = 10;
const BUTTON_TOUCH_AREA_DILATION = 5;

export default class TimeButtonGroup extends HBox {

  public constructor( time: QBSTime, tandem: Tandem ) {

    const currentTimeStringProperty = time.currentTimeProperty.derived( currentTime => toFixed( currentTime, time.getDecimalPlaces() ) );
    const timeVisibleStringProperty = time.timeVisibleProperty.derived( visible => visible ? 'true' : 'false' );

    const restartButton = new RestartButton( {
      listener: () => time.restart(),
      baseColor: QBSColors.restartButtonColorProperty,
      radius: RESTART_BUTTON_RADIUS,
      touchAreaDilation: BUTTON_TOUCH_AREA_DILATION,
      enabledProperty: new DerivedProperty( [ time.currentTimeProperty ], currentTime => currentTime !== 0 ),
      accessibleHelpText: QuantumBoundStatesFluent.a11y.restartButton.accessibleHelpTextStringProperty,
      accessibleContextResponse: QuantumBoundStatesFluent.a11y.restartButton.accessibleContextResponse.createProperty( {
        timeVisible: timeVisibleStringProperty
      } ),
      tandem: tandem.createTandem( 'restartButton' )
    } );

    // Note the time when paused, otherwise just note that the sim is paused.
    const pausedContextResponseProperty = QuantumBoundStatesFluent.a11y.playPauseButton.accessibleContextResponseOff.createProperty( {
      timeVisible: timeVisibleStringProperty,
      time: currentTimeStringProperty
    } );

    const playPauseButton = new PlayPauseButton( time.isPlayingProperty, {
      baseColor: QBSColors.playPauseButtonColorProperty,
      radius: PLAY_PAUSE_BUTTON_RADIUS,
      touchAreaDilation: BUTTON_TOUCH_AREA_DILATION,
      accessibleHelpText: new DerivedStringProperty( [
          time.isPlayingProperty,
          QuantumBoundStatesFluent.a11y.playPauseButton.accessibleHelpTextPlayingStringProperty,
          QuantumBoundStatesFluent.a11y.playPauseButton.accessibleHelpTextPausedStringProperty
        ],
        ( isPlaying, accessibleHelpTextPlayingString, accessibleHelpTextPausedString ) =>
          isPlaying ? accessibleHelpTextPlayingString : accessibleHelpTextPausedString ),
      accessibleContextResponseOff: pausedContextResponseProperty,
      tandem: tandem.createTandem( 'playPauseButton' )
    } );

    // If time is visible when the playPauseButton gets focus, note the time.
    playPauseButton.focusedProperty.lazyLink( focused => {
      if ( focused && time.timeVisibleProperty && !time.isPlayingProperty.value ) {
        playPauseButton.addAccessibleContextResponse( pausedContextResponseProperty.value );
      }
    } );

    const stepForwardButton = new StepForwardButton( {
      listener: () => time.stepForward(),
      baseColor: QBSColors.stepForwardButtonColorProperty,
      radius: STEP_FORWARD_BUTTON_RADIUS,
      touchAreaDilation: BUTTON_TOUCH_AREA_DILATION,
      enabledProperty: DerivedProperty.not( time.isPlayingProperty ),
      accessibleHelpText: QuantumBoundStatesFluent.a11y.stepForwardButton.accessibleHelpTextStringProperty,
      accessibleContextResponse: QuantumBoundStatesFluent.a11y.stepForwardButton.accessibleContextResponse.createProperty( {
        timeVisible: timeVisibleStringProperty,
        time: currentTimeStringProperty
      } ),
      tandem: tandem.createTandem( 'stepForwardButton' )
    } );

    super( {
      isDisposable: false,
      children: [ restartButton, playPauseButton, stepForwardButton ],
      spacing: BUTTON_SPACING,
      accessibleHeading: QuantumBoundStatesFluent.a11y.timeButtonGroup.accessibleHeadingStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.timeButtonGroup.accessibleHelpTextStringProperty,
      tandem: tandem,
      phetioVisiblePropertyInstrumented: true
    } );
  }
}
