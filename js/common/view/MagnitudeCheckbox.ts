// Copyright 2026, University of Colorado Boulder

/**
 * MagnitudeCheckbox is the checkbox used to show/hide the magnitude of the wave function.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSColors from '../QBSColors.js';
import WaveFunctionPartsCheckbox, { WaveFunctionPartsCheckboxOptions } from './WaveFunctionPartsCheckbox.js';

type SelfOptions = EmptySelfOptions;

type MagnitudeCheckboxOptions = SelfOptions & PickRequired<WaveFunctionPartsCheckboxOptions, 'tandem' | 'enabledProperty'>;

export default class MagnitudeCheckbox extends WaveFunctionPartsCheckbox {

  public constructor( magnitudeVisibleProperty: Property<boolean>, providedOptions: MagnitudeCheckboxOptions ) {

    const options = optionize<MagnitudeCheckboxOptions, SelfOptions, WaveFunctionPartsCheckboxOptions>()( {
      stringProperty: QuantumBoundStatesFluent.magnitudeStringProperty,
      strokeProperty: QBSColors.magnitudeStrokeProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.magnitudeCheckbox.accessibleHelpTextStringProperty,
      accessibleContextResponseChecked: QuantumBoundStatesFluent.a11y.magnitudeCheckbox.accessibleContextResponseCheckedStringProperty,
      accessibleContextResponseUnchecked: QuantumBoundStatesFluent.a11y.magnitudeCheckbox.accessibleContextResponseUncheckedStringProperty
    }, providedOptions );

    super( magnitudeVisibleProperty, options );
  }
}
