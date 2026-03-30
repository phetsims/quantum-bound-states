// Copyright 2026, University of Colorado Boulder

/**
 * WaveFunctionDetailsDialog is a dialog that displays the expanded wave function.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { combineOptions } from '../../../../phet-core/js/optionize.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Dialog, { DialogOptions } from '../../../../sun/js/Dialog.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSConstants from '../QBSConstants.js';

export default class WaveFunctionDetailsDialog extends Dialog {

  public constructor() {

    const titleNode = new Text( QuantumBoundStatesFluent.waveFunctionDialogTitleStringProperty, {
      font: QBSConstants.TITLE_FONT
    } );

    //TODO Create dialog content.
    const content = new RichText( 'Under Construction', {
      font: QBSConstants.CONTROL_FONT
    } );

    const options = combineOptions<DialogOptions>( {}, QBSConstants.DIALOG_OPTIONS, {
      title: titleNode
    } );

    super( content, options );
  }
}
