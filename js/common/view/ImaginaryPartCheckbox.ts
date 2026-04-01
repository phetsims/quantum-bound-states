// Copyright 2026, University of Colorado Boulder

/**
 * ImaginaryPartCheckbox is the checkbox used to show/hide the imaginary part of the wave function.
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

type ImaginaryPartCheckboxOptions = SelfOptions & PickRequired<WaveFunctionPartsCheckboxOptions, 'tandem' | 'enabledProperty'>;

export default class ImaginaryPartCheckbox extends WaveFunctionPartsCheckbox {

  public constructor( imaginaryPartVisibleProperty: Property<boolean>, providedOptions: ImaginaryPartCheckboxOptions ) {

    const options = optionize<ImaginaryPartCheckboxOptions, SelfOptions, WaveFunctionPartsCheckboxOptions>()( {
      stringProperty: QuantumBoundStatesFluent.imaginaryPartStringProperty,
      strokeProperty: QBSColors.imaginaryPartStrokeProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.imaginaryPartCheckbox.accessibleHelpTextStringProperty,
      accessibleContextResponseChecked: QuantumBoundStatesFluent.a11y.imaginaryPartCheckbox.accessibleContextResponseCheckedStringProperty,
      accessibleContextResponseUnchecked: QuantumBoundStatesFluent.a11y.imaginaryPartCheckbox.accessibleContextResponseUncheckedStringProperty
    }, providedOptions );

    super( imaginaryPartVisibleProperty, options );
  }
}
