// Copyright 2026, University of Colorado Boulder

/**
 * ConfigureAsymmetricTriangleDialog is a dialog for configuring an Asymmetric Triangle potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import AsymmetricTrianglePotential from '../../model/potentials/AsymmetricTrianglePotential.js';
import QBSTime from '../../model/QBSTime.js';
import ConfigureQuantumPotentialDialog from './ConfigureQuantumPotentialDialog.js';

export default class ConfigureAsymmetricTriangleDialog extends ConfigureQuantumPotentialDialog {

  public constructor( potential: AsymmetricTrianglePotential, time: QBSTime ) {

    super( 'Asymmetric Triangle', time, {
      xOffsetProperty: potential.xOffsetProperty,
      yOffsetProperty: potential.yOffsetProperty,
      wellWidthProperty: potential.wellWidthProperty,
      wellDepthProperty: potential.wellDepthProperty
    } );
  }
}