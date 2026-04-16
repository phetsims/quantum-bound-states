// Copyright 2026, University of Colorado Boulder

/**
 * ConfigureInfiniteStepDialog is a dialog for configuring an Infinite Step potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { combineOptions } from '../../../../../phet-core/js/optionize.js';
import VBox, { VBoxOptions } from '../../../../../scenery/js/layout/nodes/VBox.js';
import InfiniteStepPotential from '../../model/potentials/InfiniteStepPotential.js';
import QBSConstants from '../../QBSConstants.js';
import ConfigureQuantumPotentialDialog from './ConfigureQuantumPotentialDialog.js';
import StepHeightControl from './StepHeightControl.js';
import WellWidthControl from './WellWidthControl.js';
import YOffsetControl from './YOffsetControl.js';

export default class ConfigureInfiniteStepDialog extends ConfigureQuantumPotentialDialog {

  public constructor( potential: InfiniteStepPotential ) {

    const children = [
      new WellWidthControl( potential.wellWidthProperty ),
      new StepHeightControl( potential.stepHeightProperty )
    ];

    if ( potential.yOffsetProperty.range.getLength() > 0 ) {
      children.push( new YOffsetControl( potential.yOffsetProperty ) );
    }

    const content = new VBox( combineOptions<VBoxOptions>( {}, QBSConstants.VBOX_OPTIONS, {
      children: children
    } ) );

    super( 'Infinite Step', content );
  }
}