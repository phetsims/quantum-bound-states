// Copyright 2026, University of Colorado Boulder

/**
 * ConfigureFiniteSquareDialog is a dialog with controls for configuring a Finite Square potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { combineOptions } from '../../../../../phet-core/js/optionize.js';
import VBox, { VBoxOptions } from '../../../../../scenery/js/layout/nodes/VBox.js';
import FiniteSquarePotential from '../../model/potentials/FiniteSquarePotential.js';
import QBSConstants from '../../QBSConstants.js';
import ConfigureQuantumPotentialDialog from './ConfigureQuantumPotentialDialog.js';
import SeparationControl from './SeparationControl.js';
import WellDepthControl from './WellDepthControl.js';
import WellWidthControl from './WellWidthControl.js';

export default class ConfigureFiniteSquareDialog extends ConfigureQuantumPotentialDialog {

  public constructor( potential: FiniteSquarePotential ) {

    const children = [
      new WellWidthControl( potential.wellWidthProperty ),
      new WellDepthControl( potential.wellDepthProperty )
    ];

    // If there is more than one well, add a control for the separation between the walls of adjacent wells.
    if ( potential.numberOfWellsProperty.value > 1 ) {
      children.push( new SeparationControl( potential.separationProperty ) );
    }

    const content = new VBox( combineOptions<VBoxOptions>( {}, QBSConstants.VBOX_OPTIONS, {
      children: children
    } ) );

    super( 'Finite Square', content );
  }
}