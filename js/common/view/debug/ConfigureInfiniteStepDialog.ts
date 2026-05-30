// Copyright 2026, University of Colorado Boulder

/**
 * ConfigureInfiniteStepDialog is a dialog for configuring an Infinite Step potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import InfiniteStepPotential from '../../model/potentials/InfiniteStepPotential.js';
import QBSTime from '../../model/QBSTime.js';
import ConfigureQuantumPotentialDialog from './ConfigureQuantumPotentialDialog.js';

export default class ConfigureInfiniteStepDialog extends ConfigureQuantumPotentialDialog {

  public constructor( potential: InfiniteStepPotential, time: QBSTime ) {

    super( 'Infinite Step', time, {
      xOffsetProperty: potential.xOffsetProperty,
      yOffsetProperty: potential.yOffsetProperty,
      wellWidthProperty: potential.wellWidthProperty,
      stepHeightProperty: potential.stepHeightProperty
    } );
  }
}