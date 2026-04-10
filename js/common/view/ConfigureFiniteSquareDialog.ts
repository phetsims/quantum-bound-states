// Copyright 2026, University of Colorado Boulder

/**
 * ConfigureFiniteSquareDialog is a dialog that allows the user to configure the Finite Square potential.
 * This is for debugging purposes, and not part of the public UI.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { combineOptions } from '../../../../phet-core/js/optionize.js';
import VBox, { VBoxOptions } from '../../../../scenery/js/layout/nodes/VBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Dialog from '../../../../sun/js/Dialog.js';
import FiniteSquarePotential from '../model/potentials/FiniteSquarePotential.js';
import QBSConstants from '../QBSConstants.js';
import WellDepthControl from './WellDepthControl.js';
import WellWidthControl from './WellWidthControl.js';

export default class ConfigureFiniteSquareDialog extends Dialog {

  public constructor( potential: FiniteSquarePotential ) {

    const content = new VBox( combineOptions<VBoxOptions>( {}, QBSConstants.VBOX_OPTIONS, {
      children: [
        new WellWidthControl( potential.wellWidthProperty ),
        new WellDepthControl( potential.wellDepthProperty )
      ]
    } ) );

    super( content, {
      title: new Text( 'Finite Square', {
        font: QBSConstants.TITLE_FONT,
        maxWidth: 300
      } ),
      ySpacing: 15
    } );
  }
}