// Copyright 2026, University of Colorado Boulder

/**
 * ImaginaryPartCheckbox is the checkbox used to show/hide the imaginary part of the wavefunction.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSColors from '../QBSColors.js';
import WaveFunctionPartsCheckbox from './WaveFunctionPartsCheckbox.js';

export default class ImaginaryPartCheckbox extends WaveFunctionPartsCheckbox {

  public constructor( imaginaryPartVisibleProperty: Property<boolean>, tandem: Tandem ) {
    super( imaginaryPartVisibleProperty, {
      stringProperty: QuantumBoundStatesFluent.imaginaryPartStringProperty,
      strokeProperty: QBSColors.imaginaryPartStrokeProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.imaginaryPartCheckbox.accessibleHelpTextStringProperty,
      accessibleContextResponseChecked: QuantumBoundStatesFluent.a11y.imaginaryPartCheckbox.accessibleContextResponseCheckedStringProperty,
      accessibleContextResponseUnchecked: QuantumBoundStatesFluent.a11y.imaginaryPartCheckbox.accessibleContextResponseUncheckedStringProperty,
      tandem: tandem
    } );
  }
}
