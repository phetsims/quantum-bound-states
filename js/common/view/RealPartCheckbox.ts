// Copyright 2026, University of Colorado Boulder

/**
 * RealPartCheckbox is the checkboxes used to show/hide the real part of the wave function.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSColors from '../QBSColors.js';
import WaveFunctionPartsCheckbox from './WaveFunctionPartsCheckbox.js';

export default class RealPartCheckbox extends WaveFunctionPartsCheckbox {

  public constructor( realPartVisibleProperty: Property<boolean>, tandem: Tandem ) {
    super( realPartVisibleProperty, {
      stringProperty: QuantumBoundStatesFluent.realPartStringProperty,
      strokeProperty: QBSColors.realPartStrokeProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.realPartCheckbox.accessibleHelpTextStringProperty,
      accessibleContextResponseChecked: QuantumBoundStatesFluent.a11y.realPartCheckbox.accessibleContextResponseCheckedStringProperty,
      accessibleContextResponseUnchecked: QuantumBoundStatesFluent.a11y.realPartCheckbox.accessibleContextResponseUncheckedStringProperty,
      tandem: tandem
    } );
  }
}

quantumBoundStates.register( 'RealPartCheckbox', RealPartCheckbox );