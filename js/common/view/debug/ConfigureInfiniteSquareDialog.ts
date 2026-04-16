// Copyright 2026, University of Colorado Boulder

/**
 * ConfigureFiniteSquareDialog is a dialog for configuring an Infinite Square potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { combineOptions } from '../../../../../phet-core/js/optionize.js';
import VBox, { VBoxOptions } from '../../../../../scenery/js/layout/nodes/VBox.js';
import InfiniteSquarePotential from '../../model/potentials/InfiniteSquarePotential.js';
import QBSConstants from '../../QBSConstants.js';
import ConfigureQuantumPotentialDialog from './ConfigureQuantumPotentialDialog.js';
import WellWidthControl from './WellWidthControl.js';
import YOffsetControl from './YOffsetControl.js';

export default class ConfigureInfiniteSquareDialog extends ConfigureQuantumPotentialDialog {

  public constructor( potential: InfiniteSquarePotential ) {

    const children = [
      new WellWidthControl( potential.wellWidthProperty )
    ];

    if ( potential.yOffsetProperty.range.getLength() > 0 ) {
      children.push( new YOffsetControl( potential.yOffsetProperty ) );
    }

    const content = new VBox( combineOptions<VBoxOptions>( {}, QBSConstants.VBOX_OPTIONS, {
      children: children
    } ) );

    super( 'Infinite Square', content );
  }
}