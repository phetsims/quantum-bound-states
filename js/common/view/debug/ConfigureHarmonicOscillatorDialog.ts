// Copyright 2026, University of Colorado Boulder

/**
 * ConfigureHarmonicOscillatorDialog is a dialog for configuring a Harmonic Oscillator potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import HarmonicOscillatorPotential from '../../model/potentials/HarmonicOscillatorPotential.js';
import QBSTime from '../../model/QBSTime.js';
import ConfigurePotentialDialog from './ConfigurePotentialDialog.js';

export default class ConfigureHarmonicOscillatorDialog extends ConfigurePotentialDialog {

  public constructor( potential: HarmonicOscillatorPotential, time: QBSTime ) {
    super( 'Harmonic Oscillator', potential, time );
  }
}