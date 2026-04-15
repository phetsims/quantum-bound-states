// Copyright 2026, University of Colorado Boulder

/**
 * ConfigurePoschlTellerDialog is a dialog for configuring a Morse potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { combineOptions } from '../../../../../phet-core/js/optionize.js';
import VBox, { VBoxOptions } from '../../../../../scenery/js/layout/nodes/VBox.js';
import MorsePotential from '../../model/potentials/MorsePotential.js';
import QBSConstants from '../../QBSConstants.js';
import ConfigureQuantumPotentialDialog from './ConfigureQuantumPotentialDialog.js';
import WellDepthControl from './WellDepthControl.js';
import WellWidthControl from './WellWidthControl.js';

export default class ConfigureMorseDialog extends ConfigureQuantumPotentialDialog {

  public constructor( potential: MorsePotential ) {

    const children = [
      new WellWidthControl( potential.wellWidthProperty ),
      new WellDepthControl( potential.wellDepthProperty )
    ];

    //TODO Conditionally add spacing control

    const content = new VBox( combineOptions<VBoxOptions>( {}, QBSConstants.VBOX_OPTIONS, {
      children: children
    } ) );

    super( 'Morse', content );
  }
}