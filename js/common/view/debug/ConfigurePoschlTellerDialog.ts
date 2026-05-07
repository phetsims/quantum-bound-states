// Copyright 2026, University of Colorado Boulder

/**
 * ConfigurePoschlTellerDialog is a dialog for configuring a Pöschl-Teller potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { combineOptions } from '../../../../../phet-core/js/optionize.js';
import VBox, { VBoxOptions } from '../../../../../scenery/js/layout/nodes/VBox.js';
import PoschlTellerPotential from '../../model/potentials/PoschlTellerPotential.js';
import QBSTime from '../../model/QBSTime.js';
import QBSConstants from '../../QBSConstants.js';
import ConfigureQuantumPotentialDialog from './ConfigureQuantumPotentialDialog.js';
import SpacingControl from './SpacingControl.js';
import WellDepthControl from './WellDepthControl.js';
import WellWidthControl from './WellWidthControl.js';
import XOffsetControl from './XOffsetControl.js';
import YOffsetControl from './YOffsetControl.js';

export default class ConfigurePoschlTellerDialog extends ConfigureQuantumPotentialDialog {

  public constructor( potential: PoschlTellerPotential, time: QBSTime ) {

    const children = [
      new WellWidthControl( potential.wellWidthProperty, time ),
      new WellDepthControl( potential.wellDepthProperty, time )
    ];

    if ( potential.numberOfWellsProperty.value > 1 ) {
      children.push( new SpacingControl( potential.spacingProperty, time ) );
    }

    if ( potential.xOffsetProperty.range.getLength() > 0 ) {
      children.push( new XOffsetControl( potential.xOffsetProperty, time ) );
    }

    if ( potential.yOffsetProperty.range.getLength() > 0 ) {
      children.push( new YOffsetControl( potential.yOffsetProperty, time ) );
    }

    const content = new VBox( combineOptions<VBoxOptions>( {}, QBSConstants.VBOX_OPTIONS, {
      children: children
    } ) );

    super( 'Pöschl-Teller', content );
  }
}