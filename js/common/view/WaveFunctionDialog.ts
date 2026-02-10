// Copyright 2026, University of Colorado Boulder

/**
 * WaveFunctionDialog is a dialog that displays the expanded wave function.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { combineOptions } from '../../../../phet-core/js/optionize.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Dialog, { DialogOptions } from '../../../../sun/js/Dialog.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import Potential from '../model/potentials/Potential.js';
import QBSConstants from '../QBSConstants.js';

export default class WaveFunctionDialog extends Dialog {

  public constructor( potential: Potential ) {

    const options = combineOptions<DialogOptions>( {}, QBSConstants.DIALOG_OPTIONS, {
      accessibleName: QuantumBoundStatesFluent.a11y.waveFunctionDialog.accessibleNameStringProperty
    } );

    //TODO Create function from potential.
    const content = new RichText( QuantumBoundStatesFluent.waveFunctionButtonLabelStringProperty, {
      font: QBSConstants.CONTROL_FONT
    } );

    super( content, options );
  }
}

quantumBoundStates.register( 'WaveFunctionDialog', WaveFunctionDialog );