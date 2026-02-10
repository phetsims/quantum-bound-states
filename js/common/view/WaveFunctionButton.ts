// Copyright 2026, University of Colorado Boulder

/**
 * WaveFunctionButton is the push button that appears in the top-right corner of the 'Wave Function' graph.
 * Pushing this button opens a dialog that displays the equation for the wave function.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../../../sun/js/buttons/RectangularPushButton.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSConstants from '../QBSConstants.js';

type SelfOptions = EmptySelfOptions;

type WaveFunctionButtonButtonOptions = SelfOptions & PickRequired<RectangularPushButtonOptions, 'listener' | 'tandem'>;

export default class WaveFunctionButton extends RectangularPushButton {

  public constructor( providedOptions: WaveFunctionButtonButtonOptions ) {

    const labelText = new RichText( QuantumBoundStatesFluent.waveFunctionButtonLabelStringProperty, {
      font: QBSConstants.CONTROL_FONT
    } );

    const options = optionize<WaveFunctionButtonButtonOptions, SelfOptions, RectangularPushButtonOptions>()( {

      // RectangularPushButtonOptions
      isDisposable: false,
      content: labelText,
      accessibleName: QuantumBoundStatesFluent.a11y.waveFunctionButton.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.waveFunctionButton.accessibleHelpTextStringProperty,
      accessibleContextResponse: QuantumBoundStatesFluent.a11y.waveFunctionButton.accessibleContextResponseStringProperty
    }, providedOptions );

    super( options );
  }
}

quantumBoundStates.register( 'WaveFunctionButton', WaveFunctionButton );