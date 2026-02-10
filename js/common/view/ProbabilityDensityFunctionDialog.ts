// Copyright 2026, University of Colorado Boulder

/**
 * ProbabilityDensityFunctionDialog is a dialog that displays the expanded probability density equation.
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

export default class ProbabilityDensityFunctionDialog extends Dialog {

  public constructor( potential: Potential ) {

    const options = combineOptions<DialogOptions>( {}, QBSConstants.DIALOG_OPTIONS, {
      accessibleName: QuantumBoundStatesFluent.a11y.probabilityDensityFunctionDialog.accessibleNameStringProperty
    } );

    //TODO Create function from potential.
    const content = new RichText( QuantumBoundStatesFluent.probabilityDensityFunctionButtonLabelStringProperty, {
      font: QBSConstants.CONTROL_FONT
    } );

    super( content, options );
  }
}

quantumBoundStates.register( 'ProbabilityDensityFunctionDialog', ProbabilityDensityFunctionDialog );