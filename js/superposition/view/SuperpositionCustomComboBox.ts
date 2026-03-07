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

    const range = superpositionCustomProperty.range;

    const richTextOptions = {
      font: QBSConstants.CONTROL_FONT,
      maxWidth: 120
    };

    //TODO These items are temporary. Info needs to come from a richer data type and be localized.
    let index = range.min;
    const items: ComboBoxItem<number>[] = [
      {
        value: index++,
        tandemName: `custom${index}Item`,
        createNode: () => new RichText( QuantumBoundStatesFluent.custom1StringProperty, richTextOptions )
      },
      {
        value: index++,
        tandemName: `custom${index}Item`,
        createNode: () => new RichText( QuantumBoundStatesFluent.custom2StringProperty, richTextOptions )
      },
      {
        value: index++,
        tandemName: `custom${index}Item`,
        createNode: () => new RichText( QuantumBoundStatesFluent.custom3StringProperty, richTextOptions )
      },
      {
        value: index++,
        tandemName: `custom${index}Item`,
        createNode: () => new RichText( QuantumBoundStatesFluent.custom4StringProperty, richTextOptions )
      },
      {
        value: index++,
        tandemName: `custom${index}Item`,
        createNode: () => new RichText( QuantumBoundStatesFluent.custom5StringProperty, richTextOptions )
      }
    ];

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