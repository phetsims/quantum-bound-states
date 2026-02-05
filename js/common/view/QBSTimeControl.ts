// Copyright 2026, University of Colorado Boulder

//TODO https://github.com/phetsims/scenery-phet/issues/968 Revisit accessible options for buttons used herein.
/**
 * QBSTimeControl is a custom time control for this simulation.
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

export default class QBSTimeControl extends HBox {

  public constructor( time: Time, tandem: Tandem ) {

    const buttonGroup = new ButtonGroup( time, tandem.createTandem( 'buttonGroup' ) );

    super( {
      children: [ buttonGroup ],
      spacing: 20,
      accessibleHeading: QuantumBoundStatesFluent.a11y.timeControls.accessibleHeadingStringProperty,
      tandem: tandem
    } );
  }
}

/**
 * ButtonGroup is a group of push buttons (restart, play-pause, step) for controlling the simulation time.
 */
class ButtonGroup extends HBox {

  public constructor( time: Time, tandem: Tandem ) {

    const restartButton = new RestartButton( {
      listener: () => time.currentTimeProperty.reset(),
      accessibleName: QuantumBoundStatesFluent.a11y.restartButton.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.restartButton.accessibleHelpTextStringProperty,
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
      tandem: tandem.createTandem( 'stepButton' ),
      phetioDocumentation: 'Progress the simulation a single model step forwards.'
    } );

    super( {
      children: [ restartButton, playPauseButton, stepButton ],
      spacing: 8,
      accessibleHeading: QuantumBoundStatesFluent.a11y.timeButtonGroup.accessibleHeadingStringProperty,
      tandem: tandem,
      phetioVisiblePropertyInstrumented: true
    } );
  }
}

quantumBoundStates.register( 'QBSTimeControl', QBSTimeControl );