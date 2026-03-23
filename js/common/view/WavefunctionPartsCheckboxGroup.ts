// Copyright 2026, University of Colorado Boulder

/**
 * WavefunctionPartsCheckboxGroup is a group of checkboxes for controlling the visibility of various
 * components of the wavefunction.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import VBox, { VBoxOptions } from '../../../../scenery/js/layout/nodes/VBox.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSPreferences from '../model/QBSPreferences.js';
import WavefunctionGraph from '../model/WavefunctionGraph.js';
import ImaginaryPartCheckbox from './ImaginaryPartCheckbox.js';
import MagnitudeCheckbox from './MagnitudeCheckbox.js';
import PhaseCheckbox from './PhaseCheckbox.js';
import RealPartCheckbox from './RealPartCheckbox.js';

type SelfOptions = EmptySelfOptions;

type WaveFunctionComponentsCheckboxGroupOptions = SelfOptions &
  PickOptional<VBoxOptions, 'layoutOptions' | 'enabledProperty'> &
  PickRequired<VBoxOptions, 'tandem'>;

export default class WavefunctionPartsCheckboxGroup extends VBox {

  public constructor( wavefunctionGraph: WavefunctionGraph,
                      providedOptions: WaveFunctionComponentsCheckboxGroupOptions ) {

    const options = optionize<WaveFunctionComponentsCheckboxGroupOptions, SelfOptions, VBoxOptions>()( {

      // VBoxOptions
      isDisposable: false,
      spacing: 10,
      align: 'left',
      stretch: true,
      accessibleHeading: QuantumBoundStatesFluent.a11y.wavefunctionParts.accessibleHeadingStringProperty
    }, providedOptions );

    // Real Part
    const realPartCheckbox = new RealPartCheckbox( wavefunctionGraph.realPartVisibleProperty, options.tandem.createTandem( 'realPartCheckbox' ) );

    // Imaginary Part
    const imaginaryPartCheckbox = new ImaginaryPartCheckbox( wavefunctionGraph.imaginaryPartVisibleProperty, options.tandem.createTandem( 'imaginaryPartCheckbox' ) );

    // Magnitude
    const magnitudeCheckbox = new MagnitudeCheckbox( wavefunctionGraph.magnitudeVisibleProperty, options.tandem.createTandem( 'magnitudeCheckbox' ) );

    // Phase
    const phaseCheckbox = new PhaseCheckbox( wavefunctionGraph.phaseVisibleProperty, {
      layoutOptions: {
        leftMargin: 25 // indent below magnitudeCheckbox
      },
      visibleProperty: QBSPreferences.phaseCheckboxVisibleProperty,
      enabledProperty: wavefunctionGraph.magnitudeVisibleProperty,
      tandem: options.tandem.createTandem( 'phaseCheckbox' )
    } );

    options.children = [
      realPartCheckbox,
      imaginaryPartCheckbox,
      magnitudeCheckbox,
      phaseCheckbox
    ];

    super( options );
  }
}
