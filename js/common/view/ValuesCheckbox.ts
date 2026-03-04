// Copyright 2026, University of Colorado Boulder

/**
 * ValuesCheckbox is the checkbox used to show/hide values on drag handles and energy lines.
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

export default class ValuesCheckbox extends Checkbox {

  public constructor( valuesVisibleProperty: Property<boolean>, tandem: Tandem ) {

    const options = combineOptions<CheckboxOptions>( {
      accessibleHelpText: QuantumBoundStatesFluent.a11y.valuesCheckbox.accessibleHelpTextStringProperty,
      accessibleContextResponseChecked: QuantumBoundStatesFluent.a11y.valuesCheckbox.accessibleContextResponseCheckedStringProperty,
      accessibleContextResponseUnchecked: QuantumBoundStatesFluent.a11y.valuesCheckbox.accessibleContextResponseUncheckedStringProperty,
      tandem: tandem.createTandem( 'showValuesCheckbox' )
    }, QBSConstants.CHECKBOX_OPTIONS );

    const content = new Text( QuantumBoundStatesFluent.valuesStringProperty, {
      font: QBSConstants.CONTROL_FONT,
      maxWidth: 150
    } );

    super( valuesVisibleProperty, content, options );
  }
}

quantumBoundStates.register( 'ValuesCheckbox', ValuesCheckbox );