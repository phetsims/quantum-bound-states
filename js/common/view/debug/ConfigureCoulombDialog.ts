// Copyright 2026, University of Colorado Boulder

/**
 * ConfigureCoulombDialog is a dialog for configuring a Coulomb potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import CoulombPotential from '../../model/potentials/CoulombPotential.js';
import QBSTime from '../../model/QBSTime.js';
import ConfigurePotentialDialog from './ConfigurePotentialDialog.js';

export default class ConfigureCoulombDialog extends ConfigurePotentialDialog {

  public constructor( potential: CoulombPotential, time: QBSTime ) {

    super( 'Coulomb', time, {
      xOffsetProperty: potential.xOffsetProperty,
      yOffsetProperty: potential.yOffsetProperty,
      wellWidthProperty: potential.wellWidthProperty
    } );
  }
}