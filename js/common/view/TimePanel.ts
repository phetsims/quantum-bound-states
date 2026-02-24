// Copyright 2026, University of Colorado Boulder

/**
 * TimePanel is the panel containing time controls.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { combineOptions } from '../../../../phet-core/js/optionize.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import Time from '../model/Time.js';
import QBSColors from '../QBSColors.js';
import QBSConstants from '../QBSConstants.js';
import TimeButtonGroup from './TimeButtonGroup.js';
import TimeDisplay from './TimeDisplay.js';
import TimeSpeedSlider from './TimeSpeedSlider.js';

export default class TimePanel extends Panel {

  public constructor( time: Time, tandem: Tandem ) {

    const options = combineOptions<PanelOptions>( {}, QBSConstants.PANEL_OPTIONS, {
      yMargin: 3,
      fill: QBSColors.timePanelFillProperty,
      stroke: QBSColors.timePanelStrokeProperty,
      accessibleHeading: QuantumBoundStatesFluent.a11y.timeControls.accessibleHeadingStringProperty,
      tandem: tandem,
      phetioVisiblePropertyInstrumented: true
    } );

    const timeDisplay = new TimeDisplay( time.currentTimeProperty, tandem.createTandem( 'timeDisplay' ) );

    const buttonGroup = new TimeButtonGroup( time, tandem.createTandem( 'buttonGroup' ) );

    const timeSpeedSlider = new TimeSpeedSlider( time.timeScaleProperty, tandem.createTandem( 'timeSpeedSlider' ) );

    const content = new HBox( {
      children: [ timeDisplay, buttonGroup, timeSpeedSlider ],
      spacing: 20
    } );

    super( content, options );
  }
}

quantumBoundStates.register( 'TimePanel', TimePanel );