// Copyright 2026, University of Colorado Boulder

/**
 * ConfigurePoschlTellerDialog is a dialog for configuring a Pöschl-Teller potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PoschlTellerPotential from '../../model/potentials/PoschlTellerPotential.js';
import QBSTime from '../../model/QBSTime.js';
import ConfigurePotentialDialog from './ConfigurePotentialDialog.js';

export default class ConfigurePoschlTellerDialog extends ConfigurePotentialDialog {

  public constructor( potential: PoschlTellerPotential, time: QBSTime ) {
    super( 'Pöschl-Teller', potential, time, {
      wellDepthProperty: potential.wellDepthProperty,
      spacingProperty: potential.spacingProperty
    } );
  }
}