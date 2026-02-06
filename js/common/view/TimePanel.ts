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
import QBSConstants from '../QBSConstants.js';
import TimeButtonGroup from './TimeButtonGroup.js';

export default class TimePanel extends Panel {

  public constructor( time: Time, tandem: Tandem ) {

    const options = combineOptions<PanelOptions>( {}, QBSConstants.PANEL_OPTIONS, {
      stroke: 'rgb( 200, 200, 200 )',
      fill: null,
      accessibleHeading: QuantumBoundStatesFluent.a11y.timeControls.accessibleHeadingStringProperty,
      tandem: tandem,
      phetioVisiblePropertyInstrumented: true
    } );

    const buttonGroup = new TimeButtonGroup( time, tandem.createTandem( 'buttonGroup' ) );

    const content = new HBox( {
      children: [ buttonGroup ],
      spacing: 20
    } );

    super( content, options );
  }
}

quantumBoundStates.register( 'TimePanel', TimePanel );