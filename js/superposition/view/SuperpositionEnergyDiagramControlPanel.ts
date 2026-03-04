// Copyright 2026, University of Colorado Boulder

/**
 * SuperpositionEnergyDiagramControlPanel contains controls related to what is shown in the Energy diagram
 * for the 'Superposition' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSConstants from '../../common/QBSConstants.js';
import ValuesCheckbox from '../../common/view/ValuesCheckbox.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';

export class SuperpositionEnergyDiagramControlPanel extends Panel {

  public constructor( valuesVisibleProperty: Property<boolean>,
                      tandem: Tandem ) {

    const titleText = new Text( QuantumBoundStatesFluent.energyDiagramStringProperty, {
      font: QBSConstants.TITLE_FONT,
      maxWidth: 200,
      tandem: tandem.createTandem( 'titleText' ),
      phetioVisiblePropertyInstrumented: true,
      visiblePropertyOptions: { phetioFeatured: true }
    } );

    const valuesCheckbox = new ValuesCheckbox( valuesVisibleProperty, tandem.createTandem( 'valuesCheckbox' ) );

    //TODO presetCustomSwitch

    //TODO superpositionComboBox + eyeToggleButton

    const content = new VBox( {
      align: 'left',
      spacing: 10,
      children: [
        titleText,
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

quantumBoundStates.register( 'SuperpositionEnergyDiagramControlPanel', SuperpositionEnergyDiagramControlPanel );