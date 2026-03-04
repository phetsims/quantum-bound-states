// Copyright 2026, University of Colorado Boulder

/**
 * ProbabilityDensityDetailsDialog is a dialog that displays the expanded probability density equation.
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

export default class ProbabilityDensityDetailsDialog extends Dialog {

  public constructor( potential: Potential ) {

    const titleNode = new Text( QuantumBoundStatesFluent.probabilityDensityDialogTitleStringProperty, {
      font: QBSConstants.TITLE_FONT
    } );

    const contentStringProperty = new StringProperty( '|Ψ(x,t)|<sup>2</sup> = TODO.expandedFunction' ); //TODO
    const content = new RichText( contentStringProperty, {
      font: QBSConstants.CONTROL_FONT
    } );

    const options = combineOptions<DialogOptions>( {}, QBSConstants.DIALOG_OPTIONS, {
      title: titleNode,
      accessibleName: QuantumBoundStatesFluent.a11y.probabilityDensityDetailsDialog.accessibleNameStringProperty
    } );

    super( content, options );
  }
}

quantumBoundStates.register( 'ProbabilityDensityDetailsDialog', ProbabilityDensityDetailsDialog );