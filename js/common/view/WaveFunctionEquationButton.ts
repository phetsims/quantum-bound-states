// Copyright 2026, University of Colorado Boulder

/**
 * WaveFunctionEquationButton is the push button that appears in the top-right corner of the 'Wave Function' graph.
 * Pushing this button opens a dialog that displays the equation for the wave function.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import RichText from '../../../../scenery/js/nodes/RichText.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSConstants from '../QBSConstants.js';

export default class WaveFunctionEquationButton extends RectangularPushButton {

  public constructor( tandem: Tandem ) {

    const labelText = new RichText( QuantumBoundStatesFluent.waveFunctionEquationButtonLabelStringProperty, {
      font: QBSConstants.CONTROL_FONT
    } );

    super( {
      content: labelText,
      accessibleName: QuantumBoundStatesFluent.a11y.waveFunctionEquationButton.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.waveFunctionEquationButton.accessibleHelpTextStringProperty,
      accessibleContextResponse: QuantumBoundStatesFluent.a11y.waveFunctionEquationButton.accessibleContextResponseStringProperty,
      tandem: tandem
    } );
  }
}

quantumBoundStates.register( 'WaveFunctionEquationButton', WaveFunctionEquationButton );