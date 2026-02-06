// Copyright 2026, University of Colorado Boulder

/**
 * TimePanel is the panel containing time controls.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Range from '../../../../dot/js/Range.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import EyeToggleButton from '../../../../scenery-phet/js/buttons/EyeToggleButton.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import Time from '../model/Time.js';
import QBSColors from '../QBSColors.js';
import QBSConstants from '../QBSConstants.js';
import TimeButtonGroup from './TimeButtonGroup.js';

export default class TimePanel extends Panel {

  public constructor( time: Time, tandem: Tandem ) {

    const options = combineOptions<PanelOptions>( {}, QBSConstants.PANEL_OPTIONS, {
      fill: QBSColors.timePanelFillProperty,
      stroke: QBSColors.timePanelStrokeProperty,
      accessibleHeading: QuantumBoundStatesFluent.a11y.timeControls.accessibleHeadingStringProperty,
      tandem: tandem,
      phetioVisiblePropertyInstrumented: true
    } );

    const timeDisplayTandem = tandem.createTandem( 'timeDisplay' );

    const timeDisplayVisibleProperty = new BooleanProperty( true, {
      tandem: timeDisplayTandem.createTandem( 'visibleProperty' )
    } );

    const timeDisplay = new NumberDisplay( time.currentTimeProperty, new Range( 0, 1000 ), {
      numberFormatter: value => StringUtils.fillIn( QuantumBoundStatesFluent.units.femtoSeconds.symbolPatternStringProperty, {
        // Use toFixed so that trailing zeros are preserved.
        value: toFixed( value, QBSConstants.TIME_DECIMAL_PLACES )
      } ),
      visibleProperty: timeDisplayVisibleProperty,
      tandem: timeDisplayTandem
    } );

    const timeDisplayToggleButton = new EyeToggleButton( timeDisplayVisibleProperty, {
      scale: 0.5,
      baseColor: new DerivedProperty(
        [ timeDisplayVisibleProperty, QBSColors.timeShownColorProperty, QBSColors.timeHiddenColorProperty ],
        ( timeVisible, timeShownColor, timeHiddenColor ) => timeVisible ? timeShownColor : timeHiddenColor ),
      accessibleNameOn: QuantumBoundStatesFluent.a11y.timeDisplayToggleButton.accessibleNameOnStringProperty,
      accessibleNameOff: QuantumBoundStatesFluent.a11y.timeDisplayToggleButton.accessibleNameOffStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.timeDisplayToggleButton.accessibleHelpTextStringProperty,
      accessibleContextResponseOn: QuantumBoundStatesFluent.a11y.timeDisplayToggleButton.accessibleContextResponseOnStringProperty,
      accessibleContextResponseOff: QuantumBoundStatesFluent.a11y.timeDisplayToggleButton.accessibleContextResponseOffStringProperty,
      tandem: tandem.createTandem( 'timeDisplayToggleButton' )
    } );

    const timeBox = new HBox( {
      excludeInvisibleChildrenFromBounds: false,
      children: [ timeDisplayToggleButton, timeDisplay ],
      spacing: 5
    } );

    const buttonGroup = new TimeButtonGroup( time, tandem.createTandem( 'buttonGroup' ) );

    const content = new HBox( {
      children: [ timeBox, buttonGroup ],
      spacing: 20
    } );

    super( content, options );
  }
}

quantumBoundStates.register( 'TimePanel', TimePanel );