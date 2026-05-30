// Copyright 2026, University of Colorado Boulder

/**
 * ConfigureHarmonicOscillatorDialog is a dialog for configuring a Harmonic Oscillator potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import HarmonicOscillatorPotential from '../../model/potentials/HarmonicOscillatorPotential.js';
import QBSTime from '../../model/QBSTime.js';
import ConfigureQuantumPotentialDialog from './ConfigureQuantumPotentialDialog.js';

export default class ConfigureHarmonicOscillatorDialog extends ConfigureQuantumPotentialDialog {

  public constructor( potential: HarmonicOscillatorPotential, time: QBSTime ) {

    super( 'Harmonic Oscillator', time, {
      xOffsetProperty: potential.xOffsetProperty,
      yOffsetProperty: potential.yOffsetProperty,
      wellWidthProperty: potential.wellWidthProperty
    } );
  }
}