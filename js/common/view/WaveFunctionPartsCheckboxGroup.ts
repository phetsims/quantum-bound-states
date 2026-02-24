// Copyright 2026, University of Colorado Boulder

/**
 * WaveFunctionPartsCheckboxGroup is a group of checkboxes for controlling the visibility of various
 * components of the wave function.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import VBox, { VBoxOptions } from '../../../../scenery/js/layout/nodes/VBox.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSPreferences from '../model/QBSPreferences.js';
import ImaginaryPartCheckbox from './ImaginaryPartCheckbox.js';
import MagnitudeCheckbox from './MagnitudeCheckbox.js';
import PhaseCheckbox from './PhaseCheckbox.js';
import RealPartCheckbox from './RealPartCheckbox.js';

type SelfOptions = EmptySelfOptions;

type WaveFunctionComponentsCheckboxGroupOptions = SelfOptions &
  PickOptional<VBoxOptions, 'layoutOptions' | 'enabledProperty'> &
  PickRequired<VBoxOptions, 'tandem'>;

export default class WaveFunctionPartsCheckboxGroup extends VBox {

  public constructor( realPartVisibleProperty: Property<boolean>,
                      imaginaryPartVisibleProperty: Property<boolean>,
                      magnitudeVisibleProperty: Property<boolean>,
                      phaseVisibleProperty: Property<boolean>,
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
    const realPartCheckbox = new RealPartCheckbox( realPartVisibleProperty, options.tandem.createTandem( 'realPartCheckbox' ) );

    // Imaginary Part
    const imaginaryPartCheckbox = new ImaginaryPartCheckbox( imaginaryPartVisibleProperty, options.tandem.createTandem( 'imaginaryPartCheckbox' ) );

    // Magnitude
    const magnitudeCheckbox = new MagnitudeCheckbox( magnitudeVisibleProperty, options.tandem.createTandem( 'magnitudeCheckbox' ) );

    // Phase
    const phaseCheckbox = new PhaseCheckbox( phaseVisibleProperty, {
      layoutOptions: {
        leftMargin: 25 // indent below magnitudeCheckbox
      },
      visibleProperty: QBSPreferences.phaseCheckboxVisibleProperty,
      enabledProperty: magnitudeVisibleProperty,
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

quantumBoundStates.register( 'WaveFunctionPartsCheckboxGroup', WaveFunctionPartsCheckboxGroup );