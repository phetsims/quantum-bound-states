// Copyright 2026, University of Colorado Boulder

/**
 * PhaseCheckbox is the checkbox used to show/hide the phase component of the wave function.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import { EmptySelfOptions, optionize4 } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import SpectrumNode from '../../../../scenery-phet/js/SpectrumNode.js';
import VisibleColor from '../../../../scenery-phet/js/VisibleColor.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import TColor from '../../../../scenery/js/util/TColor.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSPreferences from '../model/QBSPreferences.js';
import QBSConstants from '../QBSConstants.js';
import WaveFunctionPartsCheckbox, { WaveFunctionPartsCheckboxOptions } from './WaveFunctionPartsCheckbox.js';

type SelfOptions = EmptySelfOptions;

type PhaseCheckboxOptions = SelfOptions &
  PickRequired<WaveFunctionPartsCheckboxOptions, 'tandem' | 'enabledProperty' | 'layoutOptions'>;

export default class PhaseCheckbox extends WaveFunctionPartsCheckbox {

  public constructor( phaseVisibleProperty: Property<boolean>, providedOptions: PhaseCheckboxOptions ) {

    const options = optionize4<PhaseCheckboxOptions, SelfOptions,
      StrictOmit<WaveFunctionPartsCheckboxOptions, 'tandem' | 'enabledProperty' | 'layoutOptions'>>()(
      {}, QBSConstants.CHECKBOX_OPTIONS, {
        createContent: createContent,
        stringProperty: QuantumBoundStatesFluent.phaseStringProperty,
        visibleProperty: QBSPreferences.phaseCheckboxVisibleProperty,
        accessibleHelpText: QuantumBoundStatesFluent.a11y.phaseCheckbox.accessibleHelpTextStringProperty,
        accessibleContextResponseChecked: QuantumBoundStatesFluent.a11y.phaseCheckbox.accessibleContextResponseCheckedStringProperty,
        accessibleContextResponseUnchecked: QuantumBoundStatesFluent.a11y.phaseCheckbox.accessibleContextResponseUncheckedStringProperty
      }, providedOptions );

    super( phaseVisibleProperty, options );
  }
}

/**
 * Creates the content for the PhaseCheckbox: a horizontal spectrum of visible wavelengths, with '0' at the left
 * end and '2π' at the right end.
 */
function createContent( stringProperty: TReadOnlyProperty<string>, strokeProperty: TReadOnlyProperty<TColor> ): Node {

  const phaseText = new Text( stringProperty, {
    font: QBSConstants.CONTROL_FONT,
    maxWidth: 60
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
