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
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';

export default class SuperpositionPresetComboBox extends ComboBox<number> {

  public constructor( superpositionPresetProperty: NumberProperty, listboxParent: Node, alignGroup: AlignGroup, tandem: Tandem ) {

    const richTextOptions = {
      font: QBSConstants.CONTROL_FONT,
      maxWidth: 120
    };

    const alignBoxOptions: AlignBoxOptions = {
      xAlign: 'left'
    };

    //TODO These items are temporary. Info needs to come from a richer data type and be localized.
    let index = superpositionPresetProperty.range.min;
    const items: ComboBoxItem<number>[] = [
      {
        value: index++,
        accessibleName: QuantumBoundStatesFluent.a11y.superpositionPresets.preset1.accessibleNameStringProperty,
        tandemName: `preset${index}Item`,
        createNode: () => alignGroup.createBox( new RichText( 'cΨ<sub>1</sub> + cΨ<sub>2</sub>', richTextOptions ), alignBoxOptions )
      },
      {
        value: index++,
        accessibleName: QuantumBoundStatesFluent.a11y.superpositionPresets.preset2.accessibleNameStringProperty,
        tandemName: `preset${index}Item`,
        createNode: () => alignGroup.createBox( new RichText( 'cΨ<sub>1</sub> + cΨ<sub>3</sub>', richTextOptions ), alignBoxOptions )
      },
      {
        value: index++,
        accessibleName: QuantumBoundStatesFluent.a11y.superpositionPresets.preset3.accessibleNameStringProperty,
        tandemName: `preset${index}Item`,
        createNode: () => alignGroup.createBox( new RichText( 'cΨ<sub>1</sub> - cΨ<sub>2</sub>', richTextOptions ), alignBoxOptions )
      },
      {
        value: index++,
        accessibleName: QuantumBoundStatesFluent.a11y.superpositionPresets.preset4.accessibleNameStringProperty,
        tandemName: `preset${index}Item`,
        createNode: () => alignGroup.createBox( new RichText( 'cΨ<sub>1</sub> + cΨ<sub>2</sub> + cΨ<sub>3</sub>', richTextOptions ), alignBoxOptions )
      },
      {
        value: index++,
        tandemName: `preset${index}Item`,
        // accessibleName is discoverable from text label.
        createNode: () => alignGroup.createBox( new RichText( QuantumBoundStatesFluent.localizedParticleStringProperty, richTextOptions ), alignBoxOptions )
      }
    ];

    super( superpositionPresetProperty, items, listboxParent, {
      xMargin: 10,
      yMargin: 6,
      accessibleName: QuantumBoundStatesFluent.a11y.superpositionPresetComboBox.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.superpositionPresetComboBox.accessibleHelpTextStringProperty,
      accessibleContextResponse: QuantumBoundStatesFluent.a11y.superpositionPresetComboBox.accessibleContextResponseStringProperty,
      tandem: tandem
    } );
  }
}

quantumBoundStates.register( 'SuperpositionPresetComboBox', SuperpositionPresetComboBox );