// Copyright 2026, University of Colorado Boulder

/**
 * RealPartCheckbox is the checkbox used to show/hide the real part of the wave function.
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

type RealPartCheckboxOptions = SelfOptions & PickRequired<WaveFunctionPartsCheckboxOptions, 'tandem' | 'enabledProperty'>;

export default class RealPartCheckbox extends WaveFunctionPartsCheckbox {

  public constructor( realPartVisibleProperty: Property<boolean>, providedOptions: RealPartCheckboxOptions ) {

    const options = optionize<RealPartCheckboxOptions, SelfOptions, WaveFunctionPartsCheckboxOptions>()( {
      stringProperty: QuantumBoundStatesFluent.realPartStringProperty,
      strokeProperty: QBSColors.realPartStrokeProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.realPartCheckbox.accessibleHelpTextStringProperty,
      accessibleContextResponseChecked: QuantumBoundStatesFluent.a11y.realPartCheckbox.accessibleContextResponseCheckedStringProperty,
      accessibleContextResponseUnchecked: QuantumBoundStatesFluent.a11y.realPartCheckbox.accessibleContextResponseUncheckedStringProperty
    }, providedOptions );

    super( realPartVisibleProperty, options );
  }
}
