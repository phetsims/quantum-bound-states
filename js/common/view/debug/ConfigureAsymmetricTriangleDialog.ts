// Copyright 2026, University of Colorado Boulder

/**
 * ConfigureAsymmetricTriangleDialog is a dialog for configuring an Asymmetric Triangle potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { combineOptions } from '../../../../../phet-core/js/optionize.js';
import VBox, { VBoxOptions } from '../../../../../scenery/js/layout/nodes/VBox.js';
import AsymmetricTrianglePotential from '../../model/potentials/AsymmetricTrianglePotential.js';
import QBSConstants from '../../QBSConstants.js';
import ConfigureQuantumPotentialDialog from './ConfigureQuantumPotentialDialog.js';
import WellDepthControl from './WellDepthControl.js';
import WellWidthControl from './WellWidthControl.js';
import YOffsetControl from './YOffsetControl.js';

export default class ConfigureAsymmetricTriangleDialog extends ConfigureQuantumPotentialDialog {

  public constructor( potential: AsymmetricTrianglePotential ) {

    const children = [
      new WellWidthControl( potential.wellWidthProperty ),
      new WellDepthControl( potential.wellDepthProperty )
    ];

    if ( potential.yOffsetProperty.range.getLength() > 0 ) {
      children.push( new YOffsetControl( potential.yOffsetProperty ) );
    }

    const content = new VBox( combineOptions<VBoxOptions>( {}, QBSConstants.VBOX_OPTIONS, {
      children: children
    } ) );

    super( 'Asymmetric Triangle', content );
  }
}