// Copyright 2026, University of Colorado Boulder

//TODO https://github.com/phetsims/scenery-phet/issues/968 Revisit accessible options for buttons used herein.
/**
 * TimeButtonGroup is the set of buttons for controlling the simulation time.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import PlayPauseButton from '../../../../scenery-phet/js/buttons/PlayPauseButton.js';
import RestartButton from '../../../../scenery-phet/js/buttons/RestartButton.js';
import StepForwardButton from '../../../../scenery-phet/js/buttons/StepForwardButton.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import Time from '../model/Time.js';

export default class TimeButtonGroup extends HBox {

  public constructor( time: Time, tandem: Tandem ) {

    const restartButton = new RestartButton( {
      listener: () => time.currentTimeProperty.reset(),
      accessibleName: QuantumBoundStatesFluent.a11y.restartButton.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.restartButton.accessibleHelpTextStringProperty,
      accessibleContextResponse: QuantumBoundStatesFluent.a11y.restartButton.accessibleContextResponseStringProperty,
      tandem: tandem.createTandem( 'restartButton' )
    } );

    const playPauseButton = new PlayPauseButton( time.isPlayingProperty, {
      accessibleNameOn: QuantumBoundStatesFluent.a11y.playPauseButton.accessibleNamePlayingStringProperty,
      accessibleNameOff: QuantumBoundStatesFluent.a11y.playPauseButton.accessibleNamePausedStringProperty,
      accessibleHelpText: new DerivedStringProperty( [
          time.isPlayingProperty,
          QuantumBoundStatesFluent.a11y.playPauseButton.accessibleHelpTextPlayingStringProperty,
          QuantumBoundStatesFluent.a11y.playPauseButton.accessibleHelpTextPausedStringProperty
        ],
        ( isPlaying, accessibleHelpTextPlayingString, accessibleHelpTextPausedString ) =>
          isPlaying ? accessibleHelpTextPlayingString : accessibleHelpTextPausedString ),
      tandem: tandem.createTandem( 'playPauseButton' )
    } );

    const stepButton = new StepForwardButton( {
      listener: () => time.stepOnce(),
      enabledProperty: DerivedProperty.not( time.isPlayingProperty ),
      accessibleName: QuantumBoundStatesFluent.a11y.stepForwardButton.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.stepForwardButton.accessibleHelpTextStringProperty,
      accessibleContextResponse: QuantumBoundStatesFluent.a11y.stepForwardButton.accessibleContextResponse.createProperty( {
        value: Time.STEP_FORWARD_DELTA
      } ),
      tandem: tandem.createTandem( 'stepButton' )
    } );

    super( {
      isDisposable: false,
      children: [ restartButton, playPauseButton, stepButton ],
      spacing: 8,
      accessibleHeading: QuantumBoundStatesFluent.a11y.timeButtonGroup.accessibleHeadingStringProperty,
      tandem: tandem,
      phetioVisiblePropertyInstrumented: true
    } );
  }
}

quantumBoundStates.register( 'TimeButtonGroup', TimeButtonGroup );