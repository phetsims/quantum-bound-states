// Copyright 2026, University of Colorado Boulder

/**
 * RealPartCheckbox is the checkbox used to show/hide the real part of the wavefunction.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSColors from '../QBSColors.js';
import WavefunctionPartsCheckbox from './WavefunctionPartsCheckbox.js';

export default class RealPartCheckbox extends WavefunctionPartsCheckbox {

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
