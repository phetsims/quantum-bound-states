// Copyright 2026, University of Colorado Boulder

/**
 * OneWellControlPanel is the control panel that is specific to the 'One Well' screen,
 * positioned to the right of the 'Energy' diagram.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import VBox, { VBoxOptions } from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumPotential from '../../common/model/potentials/QuantumPotential.js';
import QBSConstants from '../../common/QBSConstants.js';
import EnergyLevelControl from '../../common/view/EnergyLevelControl.js';
import PotentialComboBox from '../../common/view/PotentialComboBox.js';
import QuantumStateGraphControlPanel from '../../common/view/QuantumStateGraphControlPanel.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import ElectronMassesControl from './ElectronMassesControl.js';

export class OneWellControlPanel extends Panel {

  public constructor( listboxParent: Node,
                      energyLevelProperty: NumberProperty,
                      electronMassesProperty: NumberProperty,
                      potentialProperty: Property<QuantumPotential>,
                      tandem: Tandem ) {

    const titleText = new Text( QuantumBoundStatesFluent.energyDiagramStringProperty, {
      font: QBSConstants.TITLE_FONT,
      maxWidth: 200,
      tandem: tandem.createTandem( 'titleText' ),
      phetioVisiblePropertyInstrumented: true,
      visiblePropertyOptions: { phetioFeatured: true }
    } );

    const content = new VBox( combineOptions<VBoxOptions>( {}, QBSConstants.VBOX_OPTIONS, {
      children: [
        titleText,
        new PotentialComboBox( potentialProperty, listboxParent, tandem.createTandem( 'potentialComboBox' ) ),
        new ElectronMassesControl( electronMassesProperty, tandem.createTandem( 'electronMassesControl' ) ),
        new EnergyLevelControl( energyLevelProperty, tandem.createTandem( 'energyLevelControl' ) )
      ]
    } ) );

    const options = combineOptions<PanelOptions>( {}, QBSConstants.PANEL_OPTIONS, {
      isDisposable: false,
      minWidth: QuantumStateGraphControlPanel.FIXED_WIDTH,
      maxWidth: QuantumStateGraphControlPanel.FIXED_WIDTH,
      accessibleHeading: QuantumBoundStatesFluent.a11y.energyDiagramControls.accessibleHeadingStringProperty,
      tandem: tandem
    } );

    super( content, options );
  }
}
