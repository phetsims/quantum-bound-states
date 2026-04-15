// Copyright 2026, University of Colorado Boulder

/**
 * ConfigurePoschlTellerDialog is a dialog configuring a Pöschl-Teller potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { combineOptions } from '../../../../../phet-core/js/optionize.js';
import VBox, { VBoxOptions } from '../../../../../scenery/js/layout/nodes/VBox.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import PoschlTellerPotential from '../../model/potentials/PoschlTellerPotential.js';
import QBSConstants from '../../QBSConstants.js';
import ConfigureQuantumPotentialDialog from './ConfigureQuantumPotentialDialog.js';

export default class ConfigurePoschlTellerDialog extends ConfigureQuantumPotentialDialog {

  public constructor( potential: PoschlTellerPotential ) {

    const content = new VBox( combineOptions<VBoxOptions>( {}, QBSConstants.VBOX_OPTIONS, {
      children: [
        new Text( 'Under Construction', {
          font: QBSConstants.CONTROL_FONT
        } )
      ]
    } ) );

    super( 'Pöschl-Teller', content );
  }
}