// Copyright 2026, University of Colorado Boulder

/**
 * SuperpositionCustomComboBox is the combo box for selecting a custom superposition state configuration.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import ComboBox, { ComboBoxItem } from '../../../../sun/js/ComboBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSConstants from '../../common/QBSConstants.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';

export default class SuperpositionCustomComboBox extends ComboBox<number> {

  public constructor( superpositionCustomProperty: NumberProperty, listboxParent: Node, tandem: Tandem ) {

    const richTextOptions = {
      font: QBSConstants.CONTROL_FONT,
      maxWidth: 250
    };

    //TODO These items are temporary. Info needs to come from a richer data type and be localized.
    const range = superpositionCustomProperty.range;
    let index = range.min;
    const items: ComboBoxItem<number>[] = [];
    for ( let i = range.min; i <= range.max; i++ ) {
      items.push( {
        value: index++,
        accessibleName: ' c psi 1 plus c psi 2',
        tandemName: `preset${index}Item`,
        createNode: () => new RichText( `Custom ${i}`, richTextOptions )
      } );
    }

    super( superpositionCustomProperty, items, listboxParent, {
      xMargin: 10,
      yMargin: 6,
      accessibleName: QuantumBoundStatesFluent.a11y.superpositionPresetComboBox.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.superpositionPresetComboBox.accessibleHelpTextStringProperty,
      accessibleContextResponse: QuantumBoundStatesFluent.a11y.superpositionPresetComboBox.accessibleContextResponseStringProperty,
      tandem: tandem
    } );
  }
}

quantumBoundStates.register( 'SuperpositionCustomComboBox', SuperpositionCustomComboBox );