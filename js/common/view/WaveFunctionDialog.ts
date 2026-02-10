// Copyright 2026, University of Colorado Boulder

/**
 * WaveFunctionDialog is a dialog that displays the expanded wave function.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { combineOptions } from '../../../../phet-core/js/optionize.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Dialog, { DialogOptions } from '../../../../sun/js/Dialog.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSConstants from '../QBSConstants.js';

export default class WaveFunctionDialog extends Dialog {

  public constructor( tandem: Tandem ) {

    const options = combineOptions<DialogOptions>( {}, QBSConstants.DIALOG_OPTIONS, {
      accessibleName: QuantumBoundStatesFluent.a11y.waveFunctionDialog.accessibleNameStringProperty,
      tandem: tandem
    } );

    //TODO Dynamically update content as the wave function changes.
    const content = new RichText( QuantumBoundStatesFluent.waveFunctionButtonLabelStringProperty, {
      font: QBSConstants.CONTROL_FONT
    } );

    super( content, options );
  }
}

quantumBoundStates.register( 'WaveFunctionDialog', WaveFunctionDialog );