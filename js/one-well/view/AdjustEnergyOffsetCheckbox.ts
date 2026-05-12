// Copyright 2026, University of Colorado Boulder

/**
 * AdjustOffsetCheckbox is a checkbox that allows the user to show and hide the drag handle for adjusting
 * the energy offset of the selected potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSConstants from '../../common/QBSConstants.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';

export default class AdjustEnergyOffsetCheckbox extends Checkbox {

  public constructor( energyOffsetDragHandleVisibleProperty: Property<boolean>, tandem: Tandem ) {

    const text = new Text( QuantumBoundStatesFluent.adjustEnergyOffsetStringProperty, {
      font: QBSConstants.CONTROL_FONT,
      maxWidth: 150
    } );

    super( energyOffsetDragHandleVisibleProperty, text, combineOptions<CheckboxOptions>( {}, QBSConstants.CHECKBOX_OPTIONS, {
      accessibleHelpText: QuantumBoundStatesFluent.a11y.adjustEnergyOffsetCheckbox.accessibleHelpTextStringProperty,
      accessibleContextResponseChecked: QuantumBoundStatesFluent.a11y.adjustEnergyOffsetCheckbox.accessibleContextResponseCheckedStringProperty,
      accessibleContextResponseUnchecked: QuantumBoundStatesFluent.a11y.adjustEnergyOffsetCheckbox.accessibleContextResponseUncheckedStringProperty,
      tandem: tandem
    } ) );
  }
}