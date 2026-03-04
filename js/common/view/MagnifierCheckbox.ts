// Copyright 2026, University of Colorado Boulder

/**
 * MagnifierCheckbox is the checkbox for making the Magnifier visible.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSConstants from '../QBSConstants.js';

export default class MagnifierCheckbox extends Checkbox {

  public constructor( magnifierVisibleProperty: Property<boolean>, tandem: Tandem ) {

    const text = new RichText( QuantumBoundStatesFluent.magnifierStringProperty, {
      font: QBSConstants.CONTROL_FONT,
      maxWidth: 150,
      tandem: tandem.createTandem( 'text' )
    } );

    super( magnifierVisibleProperty, text, combineOptions<CheckboxOptions>(
      {}, QBSConstants.CHECKBOX_OPTIONS, {
        isDisposable: false,
        accessibleHelpText: QuantumBoundStatesFluent.a11y.magnifierCheckbox.accessibleHelpTextStringProperty,
        accessibleContextResponseChecked: QuantumBoundStatesFluent.a11y.magnifierCheckbox.accessibleContextResponseCheckedStringProperty,
        accessibleContextResponseUnchecked: QuantumBoundStatesFluent.a11y.magnifierCheckbox.accessibleContextResponseUncheckedStringProperty,
        phetioDisplayOnlyPropertyInstrumented: true,
        tandem: tandem
      } ) );
  }
}

quantumBoundStates.register( 'MagnifierCheckbox', MagnifierCheckbox );