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

      // TODO: These accessibleName and accessibleHelpText are now the defaults for RestartButton and
      //  can be removed, see https://github.com/phetsims/scenery-phet/issues/968
      // accessibleName: QuantumBoundStatesFluent.a11y.restartButton.accessibleNameStringProperty,
      // accessibleHelpText: QuantumBoundStatesFluent.a11y.restartButton.accessibleHelpTextStringProperty,
      accessibleContextResponse: QuantumBoundStatesFluent.a11y.restartButton.accessibleContextResponseStringProperty,
      tandem: tandem.createTandem( 'restartButton' )
    } );

    const playPauseButton = new PlayPauseButton( time.isPlayingProperty, {

      // TODO: These are already the defaults for PlayPauseButton and can be removed, see
      //  https://github.com/phetsims/scenery-phet/issues/968
      // accessibleNameOn: QuantumBoundStatesFluent.a11y.playPauseButton.accessibleNamePlayingStringProperty,
      // accessibleNameOff: QuantumBoundStatesFluent.a11y.playPauseButton.accessibleNamePausedStringProperty,

      // TODO: I didn't see a better place for this in common code. accessibleHelpText is only
      //  necessary for a PlayPauseButton when there is also a step button to describe - as is done
      //  in PlayPauseStepButtonGroup.
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
      listener: () => time.stepForward(),
      enabledProperty: DerivedProperty.not( time.isPlayingProperty ),

      // TODO: This is now the default for StepFrowardButton and can be removed, see
      //   https://github.com/phetsims/scenery-phet/issues/968
      // accessibleName: QuantumBoundStatesFluent.a11y.stepForwardButton.accessibleNameStringProperty,

      // TODO: StepForwardButton doesn't have defaults in common code. I think it is OK to remove this.
      // accessibleHelpText: QuantumBoundStatesFluent.a11y.stepForwardButton.accessibleHelpTextStringProperty,
      accessibleContextResponse: QuantumBoundStatesFluent.a11y.stepForwardButton.accessibleContextResponse.createProperty( {
        value: Time.STEP_FORWARD_DELTA
      } ),
      tandem: tandem.createTandem( 'stepButton' )
    } );

    // TODO: One thing that you could do is use PlayPauseStepButtonGroup here. Then
    //   the above two buttons would be replaced by this. And this group implements the description
    //   structure and accessibleHelpText for play/pause/step buttons that Taliesin designed.
    //   See https://github.com/phetsims/scenery-phet/issues/968.
    // const playPauseStepButtonGroup = new PlayPauseStepButtonGroup( time.isPlayingProperty, {
    //   stepForwardButtonOptions: {
    //     accessibleContextResponse: QuantumBoundStatesFluent.a11y.stepForwardButton.accessibleContextResponse.createProperty( {
    //       value: Time.STEP_FORWARD_DELTA
    //     } )
    //   }
    // } );

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