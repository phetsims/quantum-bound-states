// Copyright 2026, University of Colorado Boulder

/**
 * ManyWellsEnergyDiagramControlPanel contains controls related to what is shown in the Energy diagram
 * for the 'Many Wells' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSConstants from '../../common/QBSConstants.js';
import EnergyLevelControl from '../../common/view/EnergyLevelControl.js';
import ValuesCheckbox from '../../common/view/ValuesCheckbox.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';

export class ManyWellsEnergyDiagramControlPanel extends Panel {

  public constructor( energyLevelProperty: NumberProperty,
                      valueLabelsVisibleProperty: Property<boolean>,
                      tandem: Tandem ) {

    const titleText = new Text( QuantumBoundStatesFluent.energyDiagramStringProperty, {
      font: QBSConstants.TITLE_FONT,
      maxWidth: 200,
      tandem: tandem.createTandem( 'titleText' ),
      phetioVisiblePropertyInstrumented: true,
      visiblePropertyOptions: { phetioFeatured: true }
    } );

    const energyLevelControl = new EnergyLevelControl( energyLevelProperty, tandem.createTandem( 'energyLevelControl' ) );

    const valuesCheckbox = new ValuesCheckbox( valueLabelsVisibleProperty, tandem.createTandem( 'valuesCheckbox' ) );

    //TODO numberOfWellsNumberControl

    //TODO electricFieldNumberControl

    const content = new VBox( {
      align: 'left',
      spacing: 10,
      children: [
        titleText,
        energyLevelControl,
        valuesCheckbox
      ]
    } );

    const options = combineOptions<PanelOptions>( {
      isDisposable: false,
      accessibleHeading: QuantumBoundStatesFluent.a11y.energyDiagramControls.accessibleHeadingStringProperty,
      tandem: tandem
    }, QBSConstants.PANEL_OPTIONS );

    super( content, options );
  }
}

quantumBoundStates.register( 'ManyWellsEnergyDiagramControlPanel', ManyWellsEnergyDiagramControlPanel );