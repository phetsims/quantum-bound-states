// Copyright 2026, University of Colorado Boulder

/**
 * SuperpositionDetailsButton is the button that opens the 'Superposition Details' dialog for viewing a preset
 * superposition configuration.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import InfoButton, { InfoButtonOptions } from '../../../../scenery-phet/js/buttons/InfoButton.js';
import QBSColors from '../../common/QBSColors.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';

type SelfOptions = EmptySelfOptions;

type SuperpositionInfoButtonOptions = SelfOptions & PickRequired<InfoButtonOptions, 'tandem' | 'listener'>;

export default class SuperpositionDetailsButton extends InfoButton {

  public constructor( providedOptions: SuperpositionInfoButtonOptions ) {

    const options = optionize<SuperpositionInfoButtonOptions, SelfOptions, InfoButtonOptions>()( {

      // InfoButtonOptions
      iconScale: 0.7,
      xMargin: 5,
      yMargin: 5,
      baseColor: QBSColors.superpositionDetailsButtonBaseColorProperty,
      iconFill: QBSColors.superpositionDetailsButtonIconColorProperty,
      accessibleName: QuantumBoundStatesFluent.a11y.superpositionDetailsButton.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.superpositionDetailsButton.accessibleHelpTextStringProperty,
      accessibleContextResponse: QuantumBoundStatesFluent.a11y.superpositionDetailsButton.accessibleContextResponseStringProperty
    }, providedOptions );

    super( options );
  }
}

quantumBoundStates.register( 'SuperpositionDetailsButton', SuperpositionDetailsButton );