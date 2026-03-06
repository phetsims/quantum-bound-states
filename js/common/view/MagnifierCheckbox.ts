// Copyright 2026, University of Colorado Boulder

/**
 * MagnifierCheckbox is the checkbox for making the Magnifier visible.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import ProbeNode, { ProbeNodeOptions } from '../../../../scenery-phet/js/ProbeNode.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
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

    const icon = createIcon();

    const content = new HBox( {
      children: [ text, icon ],
      spacing: 8
    } );

    const options = combineOptions<CheckboxOptions>( {}, QBSConstants.CHECKBOX_OPTIONS, {
      isDisposable: false,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.magnifierCheckbox.accessibleHelpTextStringProperty,
      accessibleContextResponseChecked: QuantumBoundStatesFluent.a11y.magnifierCheckbox.accessibleContextResponseCheckedStringProperty,
      accessibleContextResponseUnchecked: QuantumBoundStatesFluent.a11y.magnifierCheckbox.accessibleContextResponseUncheckedStringProperty,
      tandem: tandem
    } );

    super( magnifierVisibleProperty, content, options );
  }
}

/**
 * Creates the icon for the MagnifierCheckbox.
 */
function createIcon(): Node {
  return new ProbeNode( combineOptions<ProbeNodeOptions>( {}, QBSConstants.PROBE_NODE_OPTIONS, {
    scale: 0.4
  } ) );
}

quantumBoundStates.register( 'MagnifierCheckbox', MagnifierCheckbox );