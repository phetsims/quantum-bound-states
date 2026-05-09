// Copyright 2026, University of Colorado Boulder

/**
 * ConfigureInfiniteStepDialog is a dialog for configuring an Infinite Step potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import InfiniteStepPotential from '../../model/potentials/InfiniteStepPotential.js';
import QBSTime from '../../model/QBSTime.js';
import ConfigureQuantumPotentialDialog from './ConfigureQuantumPotentialDialog.js';
import StepHeightControl from './StepHeightControl.js';
import WellWidthControl from './WellWidthControl.js';
import XOffsetControl from './XOffsetControl.js';
import YOffsetControl from './YOffsetControl.js';

export default class ConfigureInfiniteStepDialog extends ConfigureQuantumPotentialDialog {

  public constructor( potential: InfiniteStepPotential, time: QBSTime ) {

    const controls = [
      new WellWidthControl( potential.wellWidthProperty, time ),
      new StepHeightControl( potential.stepHeightProperty, time )
    ];

    if ( potential.xOffsetProperty.range.getLength() > 0 ) {
      controls.push( new XOffsetControl( potential.xOffsetProperty, time ) );
    }

    if ( potential.yOffsetProperty.range.getLength() > 0 ) {
      controls.push( new YOffsetControl( potential.yOffsetProperty, time ) );
    }

    super( 'Infinite Step', controls );
  }
}