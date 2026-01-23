// Copyright 2026, University of Colorado Boulder

/**
 * ReferenceLineCheckbox is the checkbox labeled 'Reference Line', for making the reference line visible.
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

    const icon = createIcon();

    const text = new RichText( QuantumBoundStatesFluent.referenceLineStringProperty, {
      font: QBSConstants.CONTROL_FONT,
      maxWidth: 100,
      tandem: tandem.createTandem( 'text' )
    } );

    const box = new HBox( {
      children: [ icon, text ],
      spacing: 8
    } );

    super( referenceLineVisibleProperty, box, combineOptions<CheckboxOptions>(
      {}, QBSConstants.CHECKBOX_OPTIONS, {
        isDisposable: false,
        accessibleHelpText: QuantumBoundStatesFluent.a11y.referenceLineCheckbox.accessibleHelpTextStringProperty,
        accessibleContextResponseChecked: QuantumBoundStatesFluent.a11y.referenceLineCheckbox.accessibleContextResponseCheckedStringProperty,
        accessibleContextResponseUnchecked: QuantumBoundStatesFluent.a11y.referenceLineCheckbox.accessibleContextResponseUncheckedStringProperty,
        phetioDisplayOnlyPropertyInstrumented: true,
        tandem: tandem
      } ) );
  }
}

/**
 * Creates the icon for the ReferenceLineCheckbox.
 */
function createIcon(): Node {

  const verticalLine = new Line( 0, 0, 0, 11, {
    stroke: QBSColors.referenceLineStrokeProperty
  } );

  const handleNode = new ShadedSphereNode( 18, {
    mainColor: QBSColors.referenceLineHandleColorProperty
  } );

  return new VBox( {
    children: [ verticalLine, handleNode ]
  } );
}

quantumBoundStates.register( 'ReferenceLineCheckbox', ReferenceLineCheckbox );