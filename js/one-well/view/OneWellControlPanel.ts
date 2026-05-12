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
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox, { VBoxOptions } from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumPotential from '../../common/model/potentials/QuantumPotential.js';
import QBSTime from '../../common/model/QBSTime.js';
import QBSConstants from '../../common/QBSConstants.js';
import EnergyLevelControl from '../../common/view/EnergyLevelControl.js';
import PotentialComboBox from '../../common/view/PotentialComboBox.js';
import QuantumStateGraphControlPanel from '../../common/view/QuantumStateGraphControlPanel.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import AdjustEnergyOffsetCheckbox from './AdjustEnergyOffsetCheckbox.js';
import ElectronMassesControl from './ElectronMassesControl.js';
import ResetEnergyOffsetButton from './ResetEnergyOffsetButton.js';

export class OneWellControlPanel extends Panel {

  public constructor( listboxParent: Node,
                      potentialProperty: Property<QuantumPotential>,
                      electronMassesProperty: NumberProperty,
                      energyLevelProperty: NumberProperty,
                      energyOffsetDragHandleVisibleProperty: Property<boolean>,
                      time: QBSTime,
                      tandem: Tandem ) {

    const titleText = new Text( QuantumBoundStatesFluent.energyDiagramStringProperty, {
      font: QBSConstants.TITLE_FONT,
      maxWidth: 200,
      tandem: tandem.createTandem( 'titleText' ),
      phetioVisiblePropertyInstrumented: true,
      visiblePropertyOptions: { phetioFeatured: true }
    } );

    const content = new VBox( combineOptions<VBoxOptions>( {}, QBSConstants.VBOX_OPTIONS, {
      spacing: 12, // Add more spacing for this screen.
      children: [
        titleText,
        new PotentialComboBox( potentialProperty, listboxParent, tandem.createTandem( 'potentialComboBox' ) ),
        new ElectronMassesControl( electronMassesProperty, time, tandem.createTandem( 'electronMassesControl' ) ),
        new EnergyLevelControl( energyLevelProperty, time, tandem.createTandem( 'energyLevelControl' ) ),
        new HBox( {
          spacing: 12,
          children: [
            new AdjustEnergyOffsetCheckbox( energyOffsetDragHandleVisibleProperty, tandem.createTandem( 'adjustEnergyOffsetCheckbox' ) ),
            new ResetEnergyOffsetButton( potentialProperty, tandem.createTandem( 'resetEnergyOffsetButton' ) )
          ]
        } )
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
