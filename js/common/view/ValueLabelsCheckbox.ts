// Copyright 2026, University of Colorado Boulder

/**
 * ValueLabelsCheckbox is the checkbox used to show/hide value labels on drag handles.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSConstants from '../QBSConstants.js';

export default class ValueLabelsCheckbox extends Checkbox {

  public constructor( valueLabelsVisibleProperty: Property<boolean>, tandem: Tandem ) {

    const options = combineOptions<CheckboxOptions>( {
      accessibleHelpText: QuantumBoundStatesFluent.a11y.valueLabelsCheckbox.accessibleHelpTextStringProperty,
      accessibleContextResponseChecked: QuantumBoundStatesFluent.a11y.valueLabelsCheckbox.accessibleContextResponseCheckedStringProperty,
      accessibleContextResponseUnchecked: QuantumBoundStatesFluent.a11y.valueLabelsCheckbox.accessibleContextResponseUncheckedStringProperty,
      tandem: tandem.createTandem( 'showValuesCheckbox' )
    }, QBSConstants.CHECKBOX_OPTIONS );

    const content = new Text( QuantumBoundStatesFluent.valueLabelsStringProperty, {
      font: QBSConstants.CONTROL_FONT,
      maxWidth: 150
    } );

    super( valueLabelsVisibleProperty, content, options );
  }
}

quantumBoundStates.register( 'ValueLabelsCheckbox', ValueLabelsCheckbox );