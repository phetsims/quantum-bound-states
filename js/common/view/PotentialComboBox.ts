// Copyright 2026, University of Colorado Boulder

/**
 * PotentialComboBox is the combo box for selecting a potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ComboBox, { ComboBoxItem } from '../../../../sun/js/ComboBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import Potential from '../model/potentials/Potential.js';
import QBSConstants from '../QBSConstants.js';

export default class PotentialComboBox extends ComboBox<Potential> {

  public constructor( potentialProperty: Property<Potential>, listboxParent: Node, tandem: Tandem ) {

    affirm( potentialProperty.validValues, 'potentialProperty.validValues must be defined.' );
    const potentials = potentialProperty.validValues;

    const items: ComboBoxItem<Potential>[] = potentials.map( potential => {
      return {
        value: potential,
        tandemName: `${potential.tandemPrefix}Item`,
        //TODO Add icon
        createNode: () => new Text( potential.visualNameProperty, {
          font: QBSConstants.CONTROL_FONT,
          maxWidth: 200
        } )
      };
    } );

    super( potentialProperty, items, listboxParent, {
      xMargin: 10,
      yMargin: 6,
      tandem: tandem
    } );
  }
}

quantumBoundStates.register( 'PotentialComboBox', PotentialComboBox );