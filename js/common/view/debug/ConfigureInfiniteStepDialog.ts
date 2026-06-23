// Copyright 2026, University of Colorado Boulder

/**
 * ConfigureInfiniteStepDialog is a dialog for configuring an Infinite Step potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import InfiniteStepPotential from '../../model/potentials/InfiniteStepPotential.js';
import QBSTime from '../../model/QBSTime.js';
import ConfigurePotentialDialog from './ConfigurePotentialDialog.js';

export default class ConfigureInfiniteStepDialog extends ConfigurePotentialDialog {

  public constructor( potential: InfiniteStepPotential, time: QBSTime ) {
    super( 'Infinite Step', potential, time, {
      stepHeightProperty: potential.stepHeightProperty
    } );
  }
}