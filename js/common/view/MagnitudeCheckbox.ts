// Copyright 2026, University of Colorado Boulder

/**
 * MagnitudeCheckbox is the checkbox used to show/hide the magnitude of the wavefunction.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSColors from '../QBSColors.js';
import WavefunctionPartsCheckbox from './WavefunctionPartsCheckbox.js';

export default class MagnitudeCheckbox extends WavefunctionPartsCheckbox {

  public constructor( imaginaryPartVisibleProperty: Property<boolean>, tandem: Tandem ) {
    super( imaginaryPartVisibleProperty, {
      stringProperty: QuantumBoundStatesFluent.magnitudeStringProperty,
      strokeProperty: QBSColors.magnitudeStrokeProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.magnitudeCheckbox.accessibleHelpTextStringProperty,
      accessibleContextResponseChecked: QuantumBoundStatesFluent.a11y.magnitudeCheckbox.accessibleContextResponseCheckedStringProperty,
      accessibleContextResponseUnchecked: QuantumBoundStatesFluent.a11y.magnitudeCheckbox.accessibleContextResponseUncheckedStringProperty,
      tandem: tandem
    } );
  }
}
