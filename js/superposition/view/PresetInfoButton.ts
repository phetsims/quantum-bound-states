// Copyright 2026, University of Colorado Boulder

/**
 * PresetInfoButton is the button that opens the 'Superposition Details' dialog for viewing a preset
 * superposition state.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import InfoButton, { InfoButtonOptions } from '../../../../scenery-phet/js/buttons/InfoButton.js';
import QBSColors from '../../common/QBSColors.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';

type SelfOptions = EmptySelfOptions;

type SuperpositionInfoButtonOptions = SelfOptions & PickRequired<InfoButtonOptions, 'tandem' | 'listener'>;

export default class PresetInfoButton extends InfoButton {

  public constructor( providedOptions: SuperpositionInfoButtonOptions ) {

    const options = optionize<SuperpositionInfoButtonOptions, SelfOptions, InfoButtonOptions>()( {

      // InfoButtonOptions
      isDisposable: false,
      iconScale: 0.7,
      xMargin: 5,
      yMargin: 5,
      baseColor: QBSColors.superpositionDetailsButtonBaseColorProperty,
      iconFill: QBSColors.superpositionDetailsButtonIconColorProperty,
      accessibleName: QuantumBoundStatesFluent.a11y.presetButton.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.presetButton.accessibleHelpTextStringProperty,
      accessibleContextResponse: QuantumBoundStatesFluent.a11y.presetButton.accessibleContextResponseStringProperty
    }, providedOptions );

    super( options );
  }
}
