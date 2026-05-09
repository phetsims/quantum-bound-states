// Copyright 2026, University of Colorado Boulder

/**
 * ConfigureFiniteSquareDialog is a dialog for configuring a Finite Square potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Node from '../../../../../scenery/js/nodes/Node.js';
import FiniteSquarePotential from '../../model/potentials/FiniteSquarePotential.js';
import QBSTime from '../../model/QBSTime.js';
import ConfigureQuantumPotentialDialog from './ConfigureQuantumPotentialDialog.js';
import SeparationControl from './SeparationControl.js';
import WellDepthControl from './WellDepthControl.js';
import WellWidthControl from './WellWidthControl.js';
import XOffsetControl from './XOffsetControl.js';
import YOffsetControl from './YOffsetControl.js';

export default class ConfigureFiniteSquareDialog extends ConfigureQuantumPotentialDialog {

  public constructor( potential: FiniteSquarePotential, time: QBSTime ) {

    const controls: Node[] = [
      new WellWidthControl( potential.wellWidthProperty, time ),
      new WellDepthControl( potential.wellDepthProperty, time )
    ];

    if ( potential.numberOfWellsProperty.value > 1 ) {
      controls.push( new SeparationControl( potential.separationProperty, time ) );
    }

    if ( potential.xOffsetProperty.range.getLength() > 0 ) {
      controls.push( new XOffsetControl( potential.xOffsetProperty, time ) );
    }

    if ( potential.yOffsetProperty.range.getLength() > 0 ) {
      controls.push( new YOffsetControl( potential.yOffsetProperty, time ) );
    }

    super( 'Finite Square', controls );
  }
}