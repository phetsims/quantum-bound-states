// Copyright 2026, University of Colorado Boulder

/**
 * ConfigureAnharmonicOscillatorDialog is a dialog with controls for configuring an Anharmonic Oscillator potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { combineOptions } from '../../../../../phet-core/js/optionize.js';
import VBox, { VBoxOptions } from '../../../../../scenery/js/layout/nodes/VBox.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import MorsePotential from '../../model/potentials/MorsePotential.js';
import QBSConstants from '../../QBSConstants.js';
import ConfigureQuantumPotentialDialog from './ConfigureQuantumPotentialDialog.js';

export default class ConfigureMorseDialog extends ConfigureQuantumPotentialDialog {

  public constructor( potential: MorsePotential ) {

    const content = new VBox( combineOptions<VBoxOptions>( {}, QBSConstants.VBOX_OPTIONS, {
      children: [
        new Text( 'Under Construction', {
          font: QBSConstants.CONTROL_FONT
        } )
      ]
    } ) );

    super( 'Morse', content );
  }
}