// Copyright 2026, University of Colorado Boulder

/**
 * ConfigureInfiniteStepDialog is a dialog with controls for configuring an Infinite Step potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { combineOptions } from '../../../../../phet-core/js/optionize.js';
import VBox, { VBoxOptions } from '../../../../../scenery/js/layout/nodes/VBox.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import Dialog from '../../../../../sun/js/Dialog.js';
import InfiniteStepPotential from '../../model/potentials/InfiniteStepPotential.js';
import QBSConstants from '../../QBSConstants.js';
import StepHeightControl from './StepHeightControl.js';
import WellWidthControl from './WellWidthControl.js';

export default class ConfigureInfiniteStepDialog extends Dialog {

  public constructor( potential: InfiniteStepPotential ) {

    const content = new VBox( combineOptions<VBoxOptions>( {}, QBSConstants.VBOX_OPTIONS, {
      children: [
        new WellWidthControl( potential.wellWidthProperty ),
        new StepHeightControl( potential.stepHeightProperty )
      ]
    } ) );

    super( content, {
      title: new Text( 'Infinite Step', {
        font: QBSConstants.TITLE_FONT,
        maxWidth: 300
      } ),
      ySpacing: 15
    } );
  }
}