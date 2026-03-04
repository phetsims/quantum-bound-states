// Copyright 2026, University of Colorado Boulder

/**
 * WaveFunctionDetailsDialog is a dialog that displays the expanded wave function.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import StringProperty from '../../../../axon/js/StringProperty.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Dialog, { DialogOptions } from '../../../../sun/js/Dialog.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import Potential from '../model/potentials/Potential.js';
import QBSConstants from '../QBSConstants.js';

export default class WaveFunctionDetailsDialog extends Dialog {

  public constructor( potential: Potential ) {

    const titleNode = new Text( QuantumBoundStatesFluent.waveFunctionStringProperty, {
      font: QBSConstants.TITLE_FONT
    } );

    const contentStringProperty = new StringProperty( 'Ψ(x,t) = TODO.expandedFunction' ); //TODO
    const content = new RichText( contentStringProperty, {
      font: QBSConstants.CONTROL_FONT
    } );

    const options = combineOptions<DialogOptions>( {}, QBSConstants.DIALOG_OPTIONS, {
      title: titleNode,
      accessibleName: QuantumBoundStatesFluent.a11y.waveFunctionDialog.accessibleNameStringProperty
    } );

    super( content, options );
  }
}

quantumBoundStates.register( 'WaveFunctionDetailsDialog', WaveFunctionDetailsDialog );