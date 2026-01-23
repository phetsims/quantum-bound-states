// Copyright 2026, University of Colorado Boulder

/**
 * MagnifierToolCheckbox is the checkbox for making the Magnifier Tool visible.
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

export default class MagnifierToolCheckbox extends Checkbox {

  public constructor( magnifierToolVisibleProperty: Property<boolean>, tandem: Tandem ) {

    const text = new RichText( QuantumBoundStatesFluent.magnifierToolStringProperty, {
      font: QBSConstants.CONTROL_FONT,
      maxWidth: 150,
      tandem: tandem.createTandem( 'text' )
    } );

    super( magnifierToolVisibleProperty, text, combineOptions<CheckboxOptions>(
      {}, QBSConstants.CHECKBOX_OPTIONS, {
        isDisposable: false,
        accessibleHelpText: QuantumBoundStatesFluent.a11y.magnifierToolCheckbox.accessibleHelpTextStringProperty,
        accessibleContextResponseChecked: QuantumBoundStatesFluent.a11y.magnifierToolCheckbox.accessibleContextResponseCheckedStringProperty,
        accessibleContextResponseUnchecked: QuantumBoundStatesFluent.a11y.magnifierToolCheckbox.accessibleContextResponseUncheckedStringProperty,
        phetioDisplayOnlyPropertyInstrumented: true,
        tandem: tandem
      } ) );
  }
}

quantumBoundStates.register( 'MagnifierToolCheckbox', MagnifierToolCheckbox );