// Copyright 2026, University of Colorado Boulder

/**
 * QBSSimulationPreferencesNode is the user interface for sim-specific preferences, accessed via the
 * Simulation tab of the Preferences dialog. These preferences are global and affect all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QBSPreferences from '../model/QBSPreferences.js';
import PhaseFeatureControl from './PhaseFeatureControl.js';

export default class QBSSimulationPreferencesNode extends VBox {

  public constructor( tandem: Tandem ) {

    // Controls in the order that they appear in the Simulation tab, from top-to-bottom.
    const controls = [
      new PhaseFeatureControl( QBSPreferences.phaseCheckboxVisibleProperty, tandem.createTandem( 'phaseFeatureControl' ) )
    ];

    super( {
      children: controls,
      align: 'left',
      spacing: 30,
      phetioVisiblePropertyInstrumented: false,
      tandem: tandem
    } );
  }
}

quantumBoundStates.register( 'QBSSimulationPreferencesNode', QBSSimulationPreferencesNode );