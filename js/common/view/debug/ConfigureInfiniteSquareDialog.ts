// Copyright 2026, University of Colorado Boulder

/**
 * ConfigureFiniteSquareDialog is a dialog for configuring an Infinite Square potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import InfiniteSquarePotential from '../../model/potentials/InfiniteSquarePotential.js';
import QBSTime from '../../model/QBSTime.js';
import ConfigureQuantumPotentialDialog from './ConfigureQuantumPotentialDialog.js';

export default class ConfigureInfiniteSquareDialog extends ConfigureQuantumPotentialDialog {

  public constructor( potential: InfiniteSquarePotential, time: QBSTime ) {

    super( 'Infinite Square', time, {
      xOffsetProperty: potential.xOffsetProperty,
      yOffsetProperty: potential.yOffsetProperty,
      wellWidthProperty: potential.wellWidthProperty
    } );
  }
}