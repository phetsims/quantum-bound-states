// Copyright 2026, University of Colorado Boulder

/**
 * SuperpositionInfoButton is the button that opens the dialog for viewing a preset superposition configuration.
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

export default class SuperpositionInfoButton extends InfoButton {

  public constructor( providedOptions: SuperpositionInfoButtonOptions ) {

    const options = optionize<SuperpositionInfoButtonOptions, SelfOptions, InfoButtonOptions>()( {

      // InfoButtonOptions
      scale: 0.5,
      baseColor: QBSColors.superpositionInfoButtonColorProperty,
      accessibleName: QuantumBoundStatesFluent.a11y.superpositionInfoButton.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.superpositionInfoButton.accessibleHelpTextStringProperty,
      accessibleContextResponse: QuantumBoundStatesFluent.a11y.superpositionInfoButton.accessibleContextResponseStringProperty
    }, providedOptions );

    super( options );
  }
}

quantumBoundStates.register( 'SuperpositionInfoButton', SuperpositionInfoButton );