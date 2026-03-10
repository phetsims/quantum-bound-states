// Copyright 2026, University of Colorado Boulder

/**
 * TwoWellsControlPanel is the control panel that is specific to the 'Two Wells' screen,
 * positioned to the right of the 'Energy' diagram.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSConstants from '../../common/QBSConstants.js';
import EnergyLevelControl from '../../common/view/EnergyLevelControl.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';

export class TwoWellsControlPanel extends Panel {

  public constructor( energyLevelProperty: NumberProperty, tandem: Tandem ) {

    const titleText = new Text( QuantumBoundStatesFluent.energyDiagramStringProperty, {
      font: QBSConstants.TITLE_FONT,
      maxWidth: 200,
      tandem: tandem.createTandem( 'titleText' ),
      phetioVisiblePropertyInstrumented: true,
      visiblePropertyOptions: { phetioFeatured: true }
    } );

    const content = new VBox( {
      align: 'left',
      spacing: 10,
      children: [
        titleText,
        new EnergyLevelControl( energyLevelProperty, tandem.createTandem( 'energyLevelControl' ) )
      ]
    } );

    const options = combineOptions<PanelOptions>( {}, QBSConstants.PANEL_OPTIONS, {
      isDisposable: false,
      accessibleHeading: QuantumBoundStatesFluent.a11y.energyDiagramControls.accessibleHeadingStringProperty,
      tandem: tandem
    } );

    super( content, options );
  }
}

quantumBoundStates.register( 'TwoWellsControlPanel', TwoWellsControlPanel );