// Copyright 2026, University of Colorado Boulder

/**
 * PhaseFeatureControl is the control in the Preferences dialog for setting whether the phase overlay feature is
 * available. It is a labeled on/off switch.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Property from '../../../../axon/js/Property.js';
import PreferencesControl from '../../../../joist/js/preferences/PreferencesControl.js';
import PreferencesDialogConstants from '../../../../joist/js/preferences/PreferencesDialogConstants.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ToggleSwitch, { ToggleSwitchOptions } from '../../../../sun/js/ToggleSwitch.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSConstants from '../QBSConstants.js';
import QBSSymbols from '../QBSSymbols.js';

export default class PhaseFeatureControl extends PreferencesControl {

  public constructor( hasPhaseOverlayProperty: Property<boolean>, tandem: Tandem ) {

    const labelText = new Text( QuantumBoundStatesFluent.phaseFeatureControl.labelStringProperty, {
      font: QBSConstants.PREFERENCES_LABEL_FONT,
      maxWidth: QBSConstants.PREFERENCES_LABEL_MAX_WIDTH,
      tandem: tandem.createTandem( 'labelText' )
    } );

    const toggleSwitch = new ToggleSwitch( hasPhaseOverlayProperty, false, true,
      combineOptions<ToggleSwitchOptions>( {}, PreferencesDialogConstants.TOGGLE_SWITCH_OPTIONS, {
        tandem: tandem.createTandem( 'toggleSwitch' ),
        phetioVisiblePropertyInstrumented: false
      } ) );

    const descriptionStringProperty = new PatternStringProperty( QuantumBoundStatesFluent.phaseFeatureControl.descriptionStringProperty, {
      psi: QBSSymbols.psiSymbolProperty
    } );

    const descriptionText = new RichText( descriptionStringProperty, {
      lineWrap: QBSConstants.PREFERENCES_DESCRIPTION_LINE_WRAP,
      maxHeight: 50,
      font: QBSConstants.PREFERENCES_DESCRIPTION_FONT,
      tandem: tandem.createTandem( 'descriptionText' )
    } );

    super( {
      isDisposable: false,
      labelNode: labelText,
      controlNode: toggleSwitch,
      descriptionNode: descriptionText,
      labelSpacing: 20,
      tandem: tandem,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    } );
  }
}

quantumBoundStates.register( 'PhaseFeatureControl', PhaseFeatureControl );