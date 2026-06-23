// Copyright 2026, University of Colorado Boulder

/**
 * ConfigureFiniteSquareDialog is a dialog for configuring a Finite Square potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import FiniteSquarePotential from '../../model/potentials/FiniteSquarePotential.js';
import QBSTime from '../../model/QBSTime.js';
import ConfigurePotentialDialog from './ConfigurePotentialDialog.js';

export default class ConfigureFiniteSquareDialog extends ConfigurePotentialDialog {

  public constructor( potential: FiniteSquarePotential, time: QBSTime ) {

    super( 'Finite Square', time, {
      xOffsetProperty: potential.xOffsetProperty,
      yOffsetProperty: potential.yOffsetProperty,
      wellWidthProperty: potential.wellWidthProperty,
      wellWidthDecimalPlaces: potential.wellWidthDecimalPlaces,
      wellDepthProperty: potential.wellDepthProperty,
      separationProperty: potential.separationProperty
    } );
  }
}