// Copyright 2026, University of Colorado Boulder

/**
 * ConfigureHarmonicOscillatorDialog is a dialog for configuring a Harmonic Oscillator potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { combineOptions } from '../../../../../phet-core/js/optionize.js';
import VBox, { VBoxOptions } from '../../../../../scenery/js/layout/nodes/VBox.js';
import HarmonicOscillatorPotential from '../../model/potentials/HarmonicOscillatorPotential.js';
import QBSConstants from '../../QBSConstants.js';
import ConfigureQuantumPotentialDialog from './ConfigureQuantumPotentialDialog.js';
import WellWidthControl from './WellWidthControl.js';

export default class ConfigureHarmonicOscillatorDialog extends ConfigureQuantumPotentialDialog {

  public constructor( potential: HarmonicOscillatorPotential ) {

    const content = new VBox( combineOptions<VBoxOptions>( {}, QBSConstants.VBOX_OPTIONS, {
      children: [
        new WellWidthControl( potential.wellWidthProperty )
      ]
    } ) );

    super( 'Harmonic Oscillator', content );
  }
}