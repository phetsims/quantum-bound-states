// Copyright 2026, University of Colorado Boulder

/**
 * SuperpositionPresetComboBox is the combo box for selecting a preset superposition state.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import { AlignBoxOptions } from '../../../../scenery/js/layout/nodes/AlignBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import ComboBox, { ComboBoxItem } from '../../../../sun/js/ComboBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSConstants from '../../common/QBSConstants.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import CustomSuperpositionState from '../model/CustomSuperpositionState.js';
import PresetSuperpositionState from '../model/PresetSuperpositionState.js';

export default class SuperpositionPresetComboBox extends ComboBox<PresetSuperpositionState> {

  public constructor( superpositionPresetProperty: Property<PresetSuperpositionState>,
                      listboxParent: Node,
                      alignGroup: AlignGroup,
                      tandem: Tandem ) {

    const validValues = superpositionPresetProperty.validValues;
    affirm( validValues, 'superpositionPresetProperty.validValues' );

    const richTextOptions = {
      font: QBSConstants.CONTROL_FONT,
      maxWidth: 120
    };

    const alignBoxOptions: AlignBoxOptions = {
      xAlign: 'left'
    };

    const items: ComboBoxItem<CustomSuperpositionState>[] = superpositionPresetProperty.validValues.map( superpositionPreset => {
      return {
        value: superpositionPreset,
        createNode: () => alignGroup.createBox( new RichText( superpositionPreset.visualNameProperty, richTextOptions ), alignBoxOptions ),
        accessibleName: superpositionPreset.accessibleNameProperty,
        tandemName: `${superpositionPreset.tandem.name}Item`
      };
    } );

    super( superpositionPresetProperty, items, listboxParent, {
      isDisposable: false,
      xMargin: 10,
      yMargin: 6,
      accessibleName: QuantumBoundStatesFluent.a11y.superpositionPresetComboBox.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.superpositionPresetComboBox.accessibleHelpTextStringProperty,
      tandem: tandem
    } );
  }
}
