// Copyright 2026, University of Colorado Boulder

/**
 * MagnitudeCheckbox is the checkbox used to show/hide the magnitude of the wave function.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSColors from '../QBSColors.js';
import WaveFunctionPartsCheckbox from './WaveFunctionPartsCheckbox.js';

export default class MagnitudeCheckbox extends WaveFunctionPartsCheckbox {

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

quantumBoundStates.register( 'MagnitudeCheckbox', MagnitudeCheckbox );