// Copyright 2026, University of Colorado Boulder

/**
 * PotentialComboBox is the combo box for selecting a potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import Property from '../../../../axon/js/Property.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ComboBox, { ComboBoxItem } from '../../../../sun/js/ComboBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import Potential from '../model/potentials/Potential.js';
import QBSConstants from '../QBSConstants.js';

export default class PotentialComboBox extends ComboBox<Potential> {

  public constructor( potentialProperty: Property<Potential>, listboxParent: Node, tandem: Tandem ) {

    affirm( potentialProperty.validValues, 'potentialProperty.validValues must be defined.' );
    const potentials = potentialProperty.validValues;

    // To make all Text labels have the same effective size, so that icons will appear right-justified.
    const textAlignGroup = new AlignGroup();

    // To make all icons have the same effective size so that they can be horizontally centered.
    const iconAlignGroup = new AlignGroup();

    const items: ComboBoxItem<Potential>[] = potentials.map( potential => {
      return {
        value: potential,
        accessibleName: potential.accessibleNameProperty,
        tandemName: `${potential.tandemPrefix}Item`,
        createNode: () => createItemNode( potential, textAlignGroup, iconAlignGroup )
      };
    } );

    super( potentialProperty, items, listboxParent, {
      xMargin: 10,
      yMargin: 6,
      accessibleName: QuantumBoundStatesFluent.a11y.potentialComboBox.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.potentialComboBox.accessibleHelpTextStringProperty,
      accessibleContextResponse: QuantumBoundStatesFluent.a11y.potentialComboBox.accessibleContextResponse.createProperty( {
        accessibleName: new DerivedStringProperty( [ potentialProperty ], potential => potential.accessibleNameProperty.value )
      } ),
      tandem: tandem
    } );
  }
}

/**
 * Creates the Node for an item in the combo box. ComboBox unfortunately lacks support for scenery dynamic layout,
 * so AlignGroups are used to ensure that text labels are left-justified, and icons are right-justified and horizontally
 * entered on each other.
 */
function createItemNode( potential: Potential, textAlignGroup: AlignGroup, iconAlignGroup: AlignGroup ): Node {

  const text = textAlignGroup.createBox( new Text( potential.visualNameProperty, {
    font: QBSConstants.CONTROL_FONT,
    maxWidth: 250
  } ), {
    xAlign: 'left'
  } );

  const icon = iconAlignGroup.createBox( potential.createIcon(), {
    xAlign: 'center'
  } );

  return new HBox( {
    children: [ text, icon ],
    spacing: 5,
    layoutOptions: {
      stretch: true
    }
  } );
}
