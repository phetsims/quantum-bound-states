// Copyright 2026, University of Colorado Boulder

/**
 * SuperpositionCustomComboBox is the combo box for selecting a custom superposition state configuration.
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

export default class SuperpositionCustomComboBox extends ComboBox<number> {

  public constructor( superpositionCustomProperty: NumberProperty,
                      listboxParent: Node,
                      alignGroup: AlignGroup,
                      tandem: Tandem ) {

    const range = superpositionCustomProperty.range;

    const richTextOptions = {
      font: QBSConstants.CONTROL_FONT,
      maxWidth: 120
    };

    // We sadly must resort to using an AlignGroup + AlignBox to make this combo box and SuperpositionPresetComboBox
    // be the same size. ComboBox apparently does not support dynamic layout.
    const alignBoxOptions: AlignBoxOptions = {
      xAlign: 'left'
    };

    //TODO These items are temporary. Info needs to come from a richer data type and be localized.
    let index = range.min;
    const items: ComboBoxItem<number>[] = [
      {
        value: index++,
        tandemName: `custom${index}Item`,
        createNode: () => alignGroup.createBox(
          new RichText( QuantumBoundStatesFluent.superpositionConfigurations.custom1StringProperty, richTextOptions ),
          alignBoxOptions )
      },
      {
        value: index++,
        tandemName: `custom${index}Item`,
        createNode: () => alignGroup.createBox(
          new RichText( QuantumBoundStatesFluent.superpositionConfigurations.custom2StringProperty, richTextOptions ),
          alignBoxOptions )
      },
      {
        value: index++,
        tandemName: `custom${index}Item`,
        createNode: () => alignGroup.createBox(
          new RichText( QuantumBoundStatesFluent.superpositionConfigurations.custom3StringProperty, richTextOptions ),
          alignBoxOptions )
      },
      {
        value: index++,
        tandemName: `custom${index}Item`,
        createNode: () => alignGroup.createBox(
          new RichText( QuantumBoundStatesFluent.superpositionConfigurations.custom4StringProperty, richTextOptions ),
          alignBoxOptions )
      },
      {
        value: index++,
        tandemName: `custom${index}Item`,
        createNode: () => alignGroup.createBox(
          new RichText( QuantumBoundStatesFluent.superpositionConfigurations.custom5StringProperty, richTextOptions ),
          alignBoxOptions )
      }
    ];

    super( superpositionCustomProperty, items, listboxParent, {
      xMargin: 10,
      yMargin: 6,
      accessibleName: QuantumBoundStatesFluent.a11y.superpositionCustomComboBox.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.superpositionCustomComboBox.accessibleHelpTextStringProperty,
      tandem: tandem
    } );
  }
}
