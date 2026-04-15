// Copyright 2026, University of Colorado Boulder

/**
 * ConfigureCoulombDialog is a dialog for configuring a Coulomb potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { combineOptions } from '../../../../../phet-core/js/optionize.js';
import VBox, { VBoxOptions } from '../../../../../scenery/js/layout/nodes/VBox.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import CoulombPotential from '../../model/potentials/CoulombPotential.js';
import QBSConstants from '../../QBSConstants.js';
import ConfigureQuantumPotentialDialog from './ConfigureQuantumPotentialDialog.js';

export default class ConfigureCoulombDialog extends ConfigureQuantumPotentialDialog {

  public constructor( potential: CoulombPotential ) {

    const content = new VBox( combineOptions<VBoxOptions>( {}, QBSConstants.VBOX_OPTIONS, {
      children: [
        new Text( 'Nothing to configure', {
          font: QBSConstants.CONTROL_FONT
        } )
      ]
    } ) );

    super( 'Coulomb', content );
  }
}