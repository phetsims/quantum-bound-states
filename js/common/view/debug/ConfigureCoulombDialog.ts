// Copyright 2026, University of Colorado Boulder

/**
 * ConfigureCoulombDialog is a dialog for configuring a Coulomb potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Node from '../../../../../scenery/js/nodes/Node.js';
import CoulombPotential from '../../model/potentials/CoulombPotential.js';
import QBSTime from '../../model/QBSTime.js';
import ConfigureQuantumPotentialDialog from './ConfigureQuantumPotentialDialog.js';
import WellWidthControl from './WellWidthControl.js';
import XOffsetControl from './XOffsetControl.js';
import YOffsetControl from './YOffsetControl.js';

export default class ConfigureCoulombDialog extends ConfigureQuantumPotentialDialog {

  public constructor( potential: CoulombPotential, time: QBSTime ) {

    const controls: Node[] = [
      new WellWidthControl( potential.wellWidthProperty, time )
    ];

    if ( potential.xOffsetProperty.range.getLength() > 0 ) {
      controls.push( new XOffsetControl( potential.xOffsetProperty, time ) );
    }

    if ( potential.yOffsetProperty.range.getLength() > 0 ) {
      controls.push( new YOffsetControl( potential.yOffsetProperty, time ) );
    }

    super( 'Coulomb', controls );
  }
}