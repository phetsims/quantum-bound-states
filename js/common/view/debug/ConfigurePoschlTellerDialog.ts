// Copyright 2026, University of Colorado Boulder

/**
 * ConfigurePoschlTellerDialog is a dialog for configuring a Pöschl-Teller potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Node from '../../../../../scenery/js/nodes/Node.js';
import PoschlTellerPotential from '../../model/potentials/PoschlTellerPotential.js';
import QBSTime from '../../model/QBSTime.js';
import ConfigureQuantumPotentialDialog from './ConfigureQuantumPotentialDialog.js';
import SpacingControl from './SpacingControl.js';
import WellDepthControl from './WellDepthControl.js';
import WellWidthControl from './WellWidthControl.js';
import XOffsetControl from './XOffsetControl.js';
import YOffsetControl from './YOffsetControl.js';

export default class ConfigurePoschlTellerDialog extends ConfigureQuantumPotentialDialog {

  public constructor( potential: PoschlTellerPotential, time: QBSTime ) {

    const controls: Node[] = [];

    if ( potential.wellWidthProperty.range.getLength() > 0 ) {
      controls.push( new WellWidthControl( potential.wellWidthProperty, time ) );
    }

    if ( potential.wellDepthProperty.range.getLength() > 0 ) {
      controls.push( new WellDepthControl( potential.wellDepthProperty, time ) );
    }

    if ( potential.numberOfWellsProperty.value > 1 ) {
      controls.push( new SpacingControl( potential.spacingProperty, time ) );
    }

    if ( potential.xOffsetProperty.range.getLength() > 0 ) {
      controls.push( new XOffsetControl( potential.xOffsetProperty, time ) );
    }

    if ( potential.yOffsetProperty.range.getLength() > 0 ) {
      controls.push( new YOffsetControl( potential.yOffsetProperty, time ) );
    }

    super( 'Pöschl-Teller', controls );
  }
}