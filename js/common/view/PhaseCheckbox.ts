// Copyright 2026, University of Colorado Boulder

/**
 * PhaseCheckbox is the checkbox used to show/hide the phase component of the wave function.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import { EmptySelfOptions, optionize4 } from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import SpectrumNode from '../../../../scenery-phet/js/SpectrumNode.js';
import VisibleColor from '../../../../scenery-phet/js/VisibleColor.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSPreferences from '../model/QBSPreferences.js';
import QBSConstants from '../QBSConstants.js';

type SelfOptions = EmptySelfOptions;

type PhaseCheckboxOptions = SelfOptions &
  PickOptional<CheckboxOptions, 'layoutOptions' | 'visibleProperty' | 'enabledProperty'> &
  PickRequired<CheckboxOptions, 'tandem'>;

export default class PhaseCheckbox extends Checkbox {

  public constructor( phaseVisibleProperty: Property<boolean>, providedOptions: PhaseCheckboxOptions ) {

    const options = optionize4<PhaseCheckboxOptions, SelfOptions, CheckboxOptions>()( {}, QBSConstants.CHECKBOX_OPTIONS, {
      visibleProperty: QBSPreferences.phaseCheckboxVisibleProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.phaseCheckbox.accessibleHelpTextStringProperty,
      accessibleContextResponseChecked: QuantumBoundStatesFluent.a11y.phaseCheckbox.accessibleContextResponseCheckedStringProperty,
      accessibleContextResponseUnchecked: QuantumBoundStatesFluent.a11y.phaseCheckbox.accessibleContextResponseUncheckedStringProperty
    }, providedOptions );

    super( phaseVisibleProperty, createPhaseIcon(), options );
  }
}

/**
 * Creates the icon for the Phase checkbox.
 */
function createPhaseIcon(): Node {

  const phaseText = new Text( QuantumBoundStatesFluent.phaseStringProperty, {
    font: QBSConstants.CONTROL_FONT,
    maxWidth: 80
  } );

  const zeroNode = new Text( '0', {
    font: QBSConstants.CONTROL_FONT
  } );

  const spectrumNode = new SpectrumNode( {
    size: new Dimension2( 40, 0.75 * zeroNode.height ),
    minValue: VisibleColor.MIN_WAVELENGTH,
    maxValue: VisibleColor.MAX_WAVELENGTH,
    valueToColor: VisibleColor.wavelengthToColor
  } );

  const twoPiNode = new Text( '2\u03C0', {
    font: QBSConstants.CONTROL_FONT
  } );

  return new HBox( {
    spacing: 10,
    children: [
      phaseText,
      new HBox( {
        spacing: 3,
        children: [ zeroNode, spectrumNode, twoPiNode ]
      } )
    ]
  } );
}

quantumBoundStates.register( 'PhaseCheckbox', PhaseCheckbox );