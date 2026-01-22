// Copyright 2026, University of Colorado Boulder

/**
 * QuantumBoundStatesPreferences is the model for sim-specific preferences, accessed via the Preferences dialog.
 * These preferences are global and affect all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QBSQueryParameters from '../QBSQueryParameters.js';

export default class QBSPreferences {

  private constructor() {
    // Not intended for instantiation.
  }

  public static readonly phaseCheckboxVisibleProperty = new BooleanProperty( QBSQueryParameters.phaseCheckboxVisible, {
    tandem: Tandem.PREFERENCES.createTandem( 'phaseCheckboxVisibleProperty' ),
    phetioFeatured: true,
    phetioDocumentation: 'Determines whether the Phase checkbox is visible in control panels.'
  } );
}

quantumBoundStates.register( 'QBSPreferences', QBSPreferences );