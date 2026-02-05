// Copyright 2026, University of Colorado Boulder

/**
 * QBSTimeControl is a custom time control for this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import Time from '../model/Time.js';
import TimeButtonGroup from './TimeButtonGroup.js';

export default class QBSTimeControl extends HBox {

  public constructor( time: Time, tandem: Tandem ) {

    const buttonGroup = new TimeButtonGroup( time, tandem.createTandem( 'buttonGroup' ) );

    super( {
      children: [ buttonGroup ],
      spacing: 20,
      accessibleHeading: QuantumBoundStatesFluent.a11y.timeControls.accessibleHeadingStringProperty,
      tandem: tandem
    } );
  }
}

quantumBoundStates.register( 'QBSTimeControl', QBSTimeControl );