// Copyright 2026, University of Colorado Boulder

/**
 * WaveFunctionPartsCheckboxGroup is a group of checkboxes for controlling the visibility of components (parts)
 * of the wave function.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import VBox, { VBoxOptions } from '../../../../scenery/js/layout/nodes/VBox.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import WaveFunctionGraph from '../model/WaveFunctionGraph.js';
import ImaginaryPartCheckbox from './ImaginaryPartCheckbox.js';
import MagnitudeCheckbox from './MagnitudeCheckbox.js';
import PhaseCheckbox from './PhaseCheckbox.js';
import RealPartCheckbox from './RealPartCheckbox.js';

type SelfOptions = {

  // For disabling individual checkboxes. We cannot simply disable the entire group because aria-disabled needs to
  // be correct for each checkbox.
  checkboxesEnabledProperty: TReadOnlyProperty<boolean>;
};

type WaveFunctionComponentsCheckboxGroupOptions = SelfOptions &
  PickOptional<VBoxOptions, 'layoutOptions'> & PickRequired<VBoxOptions, 'tandem'>;

export default class WaveFunctionPartsCheckboxGroup extends VBox {

  public constructor( waveFunctionGraph: WaveFunctionGraph,
                      providedOptions: WaveFunctionComponentsCheckboxGroupOptions ) {

    const options = optionize<WaveFunctionComponentsCheckboxGroupOptions, SelfOptions, VBoxOptions>()( {

      // VBoxOptions
      isDisposable: false,
      spacing: 10,
      align: 'left',
      stretch: true,
      accessibleHeading: QuantumBoundStatesFluent.a11y.waveFunctionParts.accessibleHeadingStringProperty
    }, providedOptions );

    // Real Part
    const realPartCheckbox = new RealPartCheckbox( waveFunctionGraph.realPartVisibleProperty, {
      enabledProperty: options.checkboxesEnabledProperty,
      tandem: options.tandem.createTandem( 'realPartCheckbox' )
    } );

    // Imaginary Part
    const imaginaryPartCheckbox = new ImaginaryPartCheckbox( waveFunctionGraph.imaginaryPartVisibleProperty, {
      enabledProperty: options.checkboxesEnabledProperty,
      tandem: options.tandem.createTandem( 'imaginaryPartCheckbox' )
    } );

    // Magnitude
    const magnitudeCheckbox = new MagnitudeCheckbox( waveFunctionGraph.magnitudeVisibleProperty, {
      enabledProperty: options.checkboxesEnabledProperty,
      tandem: options.tandem.createTandem( 'magnitudeCheckbox' )
    } );

    // Phase
    const phaseCheckbox = new PhaseCheckbox( waveFunctionGraph.phaseVisibleProperty, {
      layoutOptions: {
        leftMargin: 25 // indent below magnitudeCheckbox
      },
      enabledProperty: DerivedProperty.and( [ waveFunctionGraph.magnitudeVisibleProperty, options.checkboxesEnabledProperty ] ),
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
