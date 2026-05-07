// Copyright 2026, University of Colorado Boulder

/**
 * ConfigureCoulombDialog is a dialog for configuring a Coulomb potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { combineOptions } from '../../../../../phet-core/js/optionize.js';
import VBox, { VBoxOptions } from '../../../../../scenery/js/layout/nodes/VBox.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import CoulombPotential from '../../model/potentials/CoulombPotential.js';
import QBSTime from '../../model/QBSTime.js';
import QBSConstants from '../../QBSConstants.js';
import ConfigureQuantumPotentialDialog from './ConfigureQuantumPotentialDialog.js';
import XOffsetControl from './XOffsetControl.js';
import YOffsetControl from './YOffsetControl.js';

export default class ConfigureCoulombDialog extends ConfigureQuantumPotentialDialog {

  public constructor( potential: CoulombPotential, time: QBSTime ) {

    const children = [];

    if ( potential.xOffsetProperty.range.getLength() > 0 ) {
      children.push( new XOffsetControl( potential.xOffsetProperty, time ) );
    }

    if ( potential.yOffsetProperty.range.getLength() > 0 ) {
      children.push( new YOffsetControl( potential.yOffsetProperty, time ) );
    }

    if ( children.length === 0 ) {
      children.push( new Text( 'Nothing to configure', {
        font: QBSConstants.CONTROL_FONT
      } ) );
    }

    const content = new VBox( combineOptions<VBoxOptions>( {}, QBSConstants.VBOX_OPTIONS, {
      children: children
    } ) );

    super( 'Coulomb', content );
  }
}