// Copyright 2026, University of Colorado Boulder

/**
 * ConfigureAsymmetricTriangleDialog is a dialog for configuring an Asymmetric Triangle potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Node from '../../../../../scenery/js/nodes/Node.js';
import AsymmetricTrianglePotential from '../../model/potentials/AsymmetricTrianglePotential.js';
import QBSTime from '../../model/QBSTime.js';
import ConfigureQuantumPotentialDialog from './ConfigureQuantumPotentialDialog.js';
import WellDepthControl from './WellDepthControl.js';
import WellWidthControl from './WellWidthControl.js';
import XOffsetControl from './XOffsetControl.js';
import YOffsetControl from './YOffsetControl.js';

export default class ConfigureAsymmetricTriangleDialog extends ConfigureQuantumPotentialDialog {

  public constructor( potential: AsymmetricTrianglePotential, time: QBSTime ) {

    const controls: Node[] = [
      new WellWidthControl( potential.wellWidthProperty, time ),
      new WellDepthControl( potential.wellDepthProperty, time )
    ];

    if ( potential.xOffsetProperty.range.getLength() > 0 ) {
      controls.push( new XOffsetControl( potential.xOffsetProperty, time ) );
    }

    if ( potential.yOffsetProperty.range.getLength() > 0 ) {
      controls.push( new YOffsetControl( potential.yOffsetProperty, time ) );
    }

    super( 'Asymmetric Triangle', controls );
  }
}