// Copyright 2026, University of Colorado Boulder

/**
 * SuperpositionCustomComboBox is the combo box for selecting a custom superposition state configuration.
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
import CustomSuperpositionConfiguration from '../model/CustomSuperpositionConfiguration.js';

export default class SuperpositionCustomComboBox extends ComboBox<CustomSuperpositionConfiguration> {

  public constructor( superpositionCustomProperty: Property<CustomSuperpositionConfiguration>,
                      listboxParent: Node,
                      alignGroup: AlignGroup,
                      tandem: Tandem ) {

    const validValues = superpositionCustomProperty.validValues;
    affirm( validValues );

    const richTextOptions = {
      font: QBSConstants.CONTROL_FONT,
      maxWidth: 120
    };

    // We sadly must resort to using an AlignGroup + AlignBox to make this combo box and SuperpositionPresetComboBox
    // be the same size. ComboBox apparently does not support dynamic layout.
    const alignBoxOptions: AlignBoxOptions = {
      xAlign: 'left'
    };

    const items: ComboBoxItem<CustomSuperpositionConfiguration>[] = superpositionCustomProperty.validValues.map( superpositionCustom => {
      return {
        value: superpositionCustom,
        accessibleName: superpositionCustom.nameProperty,
        createNode: () => alignGroup.createBox( new RichText( superpositionCustom.nameProperty, richTextOptions ), alignBoxOptions ),
        tandemName: `${superpositionCustom.tandemPrefix}Item`
      };
    } );

    super( superpositionCustomProperty, items, listboxParent, {
      isDisposable: false,
      xMargin: 10,
      yMargin: 6,
      accessibleName: QuantumBoundStatesFluent.a11y.superpositionCustomComboBox.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.superpositionCustomComboBox.accessibleHelpTextStringProperty,
      tandem: tandem
    } );
  }
}
