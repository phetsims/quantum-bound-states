// Copyright 2026, University of Colorado Boulder

/**
 * ConfigureHarmonicOscillatorDialog is a dialog for configuring a Harmonic Oscillator potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { combineOptions } from '../../../../../phet-core/js/optionize.js';
import VBox, { VBoxOptions } from '../../../../../scenery/js/layout/nodes/VBox.js';
import HarmonicOscillatorPotential from '../../model/potentials/HarmonicOscillatorPotential.js';
import QBSTime from '../../model/QBSTime.js';
import QBSConstants from '../../QBSConstants.js';
import ConfigureQuantumPotentialDialog from './ConfigureQuantumPotentialDialog.js';
import WellWidthControl from './WellWidthControl.js';
import XOffsetControl from './XOffsetControl.js';
import YOffsetControl from './YOffsetControl.js';

export default class ConfigureHarmonicOscillatorDialog extends ConfigureQuantumPotentialDialog {

  public constructor( potential: HarmonicOscillatorPotential, time: QBSTime ) {

    const children = [
      new WellWidthControl( potential.wellWidthProperty, time )
    ];

    if ( potential.xOffsetProperty.range.getLength() > 0 ) {
      children.push( new XOffsetControl( potential.xOffsetProperty, time ) );
    }

    if ( potential.yOffsetProperty.range.getLength() > 0 ) {
      children.push( new YOffsetControl( potential.yOffsetProperty, time ) );
    }

    const content = new VBox( combineOptions<VBoxOptions>( {}, QBSConstants.VBOX_OPTIONS, {
      children: children
    } ) );

    super( 'Harmonic Oscillator', content );
  }
}