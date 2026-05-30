// Copyright 2026, University of Colorado Boulder

/**
 * ConfigurePoschlTellerDialog is a dialog for configuring a Morse potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import MorsePotential from '../../model/potentials/MorsePotential.js';
import QBSTime from '../../model/QBSTime.js';
import ConfigureQuantumPotentialDialog from './ConfigureQuantumPotentialDialog.js';

export default class ConfigureMorseDialog extends ConfigureQuantumPotentialDialog {

  public constructor( potential: MorsePotential, time: QBSTime ) {

    super( 'Morse', time, {
      xOffsetProperty: potential.xOffsetProperty,
      yOffsetProperty: potential.yOffsetProperty,
      wellWidthProperty: potential.wellWidthProperty,
      wellDepthProperty: potential.wellDepthProperty
    } );
  }
}