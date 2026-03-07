// Copyright 2026, University of Colorado Boulder

/**
 * AverageProbabilityDensityOfBandDetailsDialog is a dialog that displays the expanded 'Average Probability Density
 * of Band' equation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { combineOptions } from '../../../../phet-core/js/optionize.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Dialog, { DialogOptions } from '../../../../sun/js/Dialog.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSConstants from '../QBSConstants.js';

export default class AverageProbabilityDensityOfBandDetailsDialog extends Dialog {

  public constructor() {

    const titleNode = new RichText( QuantumBoundStatesFluent.averageProbabilityDensityOfBandDialogTitleStringProperty, {
      font: QBSConstants.TITLE_FONT
    } );

    //TODO
    const content = new RichText( 'Under Construction', {
      font: QBSConstants.CONTROL_FONT
    } );

    const options = combineOptions<DialogOptions>( {}, QBSConstants.DIALOG_OPTIONS, {
      title: titleNode
    } );

    super( content, options );
  }
}

quantumBoundStates.register( 'AverageProbabilityDensityOfBandDetailsDialog', AverageProbabilityDensityOfBandDetailsDialog );