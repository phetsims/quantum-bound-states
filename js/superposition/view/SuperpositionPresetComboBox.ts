// Copyright 2026, University of Colorado Boulder

/**
 * SuperpositionPresetComboBox is the combo box for selecting a preset superposition state configuration.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import { AlignBoxOptions } from '../../../../scenery/js/layout/nodes/AlignBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import ComboBox, { ComboBoxItem } from '../../../../sun/js/ComboBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSConstants from '../../common/QBSConstants.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';

export default class SuperpositionPresetComboBox extends ComboBox<number> {

  public constructor( superpositionPresetProperty: NumberProperty,
                      listboxParent: Node,
                      alignGroup: AlignGroup,
                      tandem: Tandem ) {

    const richTextOptions = {
      font: QBSConstants.CONTROL_FONT,
      maxWidth: 120
    };

    const alignBoxOptions: AlignBoxOptions = {
      xAlign: 'left'
    };

    //TODO These items are temporary. Info needs to come from a richer data type.
    let index = superpositionPresetProperty.range.min;
    const items: ComboBoxItem<number>[] = [
      {
        value: index++,
        accessibleName: QuantumBoundStatesFluent.a11y.superpositionCustomComboBox.preset1.accessibleNameStringProperty,
        tandemName: `preset${index}Item`,
        createNode: () => alignGroup.createBox(
          new RichText( QuantumBoundStatesFluent.superpositionConfigurations.preset1StringProperty, richTextOptions ),
          alignBoxOptions )
      },
      {
        value: index++,
        accessibleName: QuantumBoundStatesFluent.a11y.superpositionCustomComboBox.preset2.accessibleNameStringProperty,
        tandemName: `preset${index}Item`,
        createNode: () => alignGroup.createBox(
          new RichText( QuantumBoundStatesFluent.superpositionConfigurations.preset2StringProperty, richTextOptions ),
          alignBoxOptions )
      },
      {
        value: index++,
        accessibleName: QuantumBoundStatesFluent.a11y.superpositionCustomComboBox.preset3.accessibleNameStringProperty,
        tandemName: `preset${index}Item`,
        createNode: () => alignGroup.createBox(
          new RichText( QuantumBoundStatesFluent.superpositionConfigurations.preset3StringProperty, richTextOptions ),
          alignBoxOptions )
      },
      {
        value: index++,
        accessibleName: QuantumBoundStatesFluent.a11y.superpositionCustomComboBox.preset4.accessibleNameStringProperty,
        tandemName: `preset${index}Item`,
        createNode: () => alignGroup.createBox(
          new RichText( QuantumBoundStatesFluent.superpositionConfigurations.preset4StringProperty, richTextOptions ),
          alignBoxOptions )
      },
      {
        value: index++,
        tandemName: `preset${index}Item`,
        // accessibleName is discoverable from visual string.
        createNode: () => alignGroup.createBox(
          new RichText( QuantumBoundStatesFluent.superpositionConfigurations.preset5StringProperty, richTextOptions ),
          alignBoxOptions )
      }
    ];

    super( superpositionPresetProperty, items, listboxParent, {
      xMargin: 10,
      yMargin: 6,
      accessibleName: QuantumBoundStatesFluent.a11y.superpositionPresetComboBox.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.superpositionPresetComboBox.accessibleHelpTextStringProperty,
      tandem: tandem
    } );
  }
}
