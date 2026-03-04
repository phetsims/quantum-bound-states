// Copyright 2026, University of Colorado Boulder

/**
 * OneWellEnergyDiagramControls is a subpanel that contains controls related to what is shown in the Energy diagram.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSConstants from '../../common/QBSConstants.js';
import EnergyLevelControl from '../../common/view/EnergyLevelControl.js';
import MassControl from '../../common/view/MassControl.js';
import ValueLabelsCheckbox from '../../common/view/ValueLabelsCheckbox.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';

export class OneWellEnergyDiagramControls extends VBox {

  public constructor( energyLevelProperty: NumberProperty,
                      electronMassesProperty: NumberProperty,
                      valueLabelsVisibleProperty: Property<boolean>,
                      tandem: Tandem ) {

    const titleText = new Text( QuantumBoundStatesFluent.propertiesStringProperty, {
      font: QBSConstants.TITLE_FONT,
      maxWidth: 200,
      tandem: tandem.createTandem( 'titleText' ),
      phetioVisiblePropertyInstrumented: true,
      visiblePropertyOptions: { phetioFeatured: true }
    } );

    const energyLevelControl = new EnergyLevelControl( energyLevelProperty, tandem.createTandem( 'energyLevelControl' ) );

    const massControl = new MassControl( electronMassesProperty, tandem.createTandem( 'massControl' ) );

    const valueLabelsCheckbox = new ValueLabelsCheckbox( valueLabelsVisibleProperty,
      tandem.createTandem( 'valueLabelsCheckbox' ) );

    super( {
      align: 'left',
      spacing: 10,
      children: [
        titleText,
        energyLevelControl,
        massControl,
        valueLabelsCheckbox
      ]
    } );
  }
}

quantumBoundStates.register( 'OneWellEnergyDiagramControls', OneWellEnergyDiagramControls );