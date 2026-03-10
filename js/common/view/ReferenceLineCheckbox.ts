// Copyright 2026, University of Colorado Boulder

/**
 * ReferenceLineCheckbox is the checkbox for making the Reference Line visible.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Checkbox, { CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSColors from '../QBSColors.js';
import QBSConstants from '../QBSConstants.js';

export default class ReferenceLineCheckbox extends Checkbox {

  public constructor( referenceLineVisibleProperty: Property<boolean>, tandem: Tandem ) {

    const text = new RichText( QuantumBoundStatesFluent.referenceLineStringProperty, {
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
      accessibleHelpText: QuantumBoundStatesFluent.a11y.referenceLineCheckbox.accessibleHelpTextStringProperty,
      accessibleContextResponseChecked: QuantumBoundStatesFluent.a11y.referenceLineCheckbox.accessibleContextResponseCheckedStringProperty,
      accessibleContextResponseUnchecked: QuantumBoundStatesFluent.a11y.referenceLineCheckbox.accessibleContextResponseUncheckedStringProperty,
      tandem: tandem
    } );

    super( referenceLineVisibleProperty, content, options );
  }
}

/**
 * Creates the icon for the ReferenceLineCheckbox.
 */
function createIcon(): Node {

  const verticalLine = new Line( 0, 0, 0, 6, {
    stroke: QBSColors.referenceLineStrokeProperty
  } );

  const handleNode = new ShadedSphereNode( QBSConstants.HANDLE_DIAMETER, {
    mainColor: QBSColors.referenceLineHandleColorProperty
  } );

  return new VBox( {
    children: [ verticalLine, handleNode ]
  } );
}

quantumBoundStates.register( 'ReferenceLineCheckbox', ReferenceLineCheckbox );