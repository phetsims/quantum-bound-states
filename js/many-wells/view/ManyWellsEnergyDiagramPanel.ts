// Copyright 2026, University of Colorado Boulder

/**
 * ManyWellsEnergyDiagramPanel is the Energy Diagram panel that is specific to the 'Many Wells' screen,
 * positioned to the right of the 'Energy' diagram.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import HSeparator from '../../../../scenery/js/layout/nodes/HSeparator.js';
import VBox, { VBoxOptions } from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumPotential from '../../common/model/potentials/QuantumPotential.js';
import QBSTime from '../../common/model/QBSTime.js';
import QBSColors from '../../common/QBSColors.js';
import QBSConstants from '../../common/QBSConstants.js';
import EnergyLevelControl from '../../common/view/EnergyLevelControl.js';
import PotentialComboBox from '../../common/view/PotentialComboBox.js';
import QuantumStateGraphPanel from '../../common/view/QuantumStateGraphPanel.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import ElectricFieldControl from './ElectricFieldControl.js';
import NumberOfWellsControl from './NumberOfWellsControl.js';

export class ManyWellsEnergyDiagramPanel extends Panel {

  public constructor( listboxParent: Node,
                      potentialProperty: Property<QuantumPotential>,
                      numberOfWellsProperty: NumberProperty,
                      electricFieldProperty: NumberProperty,
                      energyLevelIndexProperty: NumberProperty,
                      time: QBSTime,
                      tandem: Tandem ) {

    const energyDiagramText = new Text( QuantumBoundStatesFluent.energyDiagramStringProperty, {
      font: QBSConstants.TITLE_FONT,
      maxWidth: 200,
      tandem: tandem.createTandem( 'energyDiagramText' ),
      phetioVisiblePropertyInstrumented: true,
      visiblePropertyOptions: { phetioFeatured: true }
    } );

    const content = new VBox( combineOptions<VBoxOptions>( {}, QBSConstants.VBOX_OPTIONS, {
      children: [
        energyDiagramText,
        new PotentialComboBox( potentialProperty, listboxParent, tandem.createTandem( 'potentialComboBox' ) ),
        new NumberOfWellsControl( numberOfWellsProperty, time, tandem.createTandem( 'numberOfWellsControl' ) ),
        new ElectricFieldControl( electricFieldProperty, time, tandem.createTandem( 'electricFieldControl' ) ),
        new HSeparator( { stroke: QBSColors.separatorStrokeProperty } ),
        new EnergyLevelControl( energyLevelIndexProperty, time, tandem.createTandem( 'energyLevelControl' ) )
      ]
    } ) );

    const options = combineOptions<PanelOptions>( {}, QBSConstants.PANEL_OPTIONS, {
      isDisposable: false,
      minWidth: QuantumStateGraphPanel.FIXED_WIDTH,
      maxWidth: QuantumStateGraphPanel.FIXED_WIDTH,
      accessibleHeading: QuantumBoundStatesFluent.a11y.energyDiagramControls.accessibleHeadingStringProperty,
      tandem: tandem
    } );

    super( content, options );
  }
}
