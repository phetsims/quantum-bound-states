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

  // Property for the 'Phase' preference
  public static readonly hasPhaseFeatureProperty = new BooleanProperty( QBSQueryParameters.hasPhaseFeature, {
    tandem: Tandem.PREFERENCES.createTandem( 'hasPhaseFeatureProperty' ),
    phetioFeatured: true,
    phetioDocumentation: 'Enables the feature for showing the phase of wave functions.'
  } );
}

quantumBoundStates.register( 'QBSPreferences', QBSPreferences );