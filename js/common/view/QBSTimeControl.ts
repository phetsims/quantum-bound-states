// Copyright 2026, University of Colorado Boulder

/**
 * QBSTimeControl is a custom time control for this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import PlayPauseButton from '../../../../scenery-phet/js/buttons/PlayPauseButton.js';
import RestartButton from '../../../../scenery-phet/js/buttons/RestartButton.js';
import StepButton from '../../../../scenery-phet/js/buttons/StepButton.js';
import SceneryPhetFluent from '../../../../scenery-phet/js/SceneryPhetFluent.js';
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

    const playPauseButton = new PlayPauseButton( time.isRunningProperty, {
      tandem: tandem.createTandem( 'playPauseButton' )
    } );

    const stepButton = new StepButton( {
      listener: () => time.stepOnce(),
      enabledProperty: DerivedProperty.not( time.isRunningProperty ),
      accessibleName: SceneryPhetFluent.a11y.stepButton.stepForwardStringProperty,
      accessibleHelpText: new DerivedStringProperty( [
        time.isRunningProperty,
        SceneryPhetFluent.a11y.stepButton.playingDescriptionStringProperty,
        SceneryPhetFluent.a11y.stepButton.pausedDescriptionStringProperty
      ], ( isRunning, playingDescription, pausedDescription ) => ( isRunning ? playingDescription : pausedDescription ) ),
      tandem: tandem.createTandem( 'stepButton' ),
      phetioDocumentation: 'Progress the simulation a single model step forwards.'
    } );

    super( {
      children: [ restartButton, playPauseButton, stepButton ],
      spacing: 8,
      tandem: tandem,
      phetioVisiblePropertyInstrumented: true
    } );
  }
}

quantumBoundStates.register( 'QBSTimeControl', QBSTimeControl );