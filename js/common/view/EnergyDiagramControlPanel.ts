// Copyright 2026, University of Colorado Boulder

/**
 * EnergyDiagramControlPanel is the base class for all controls panels that are related to the Energy diagram.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { combineOptions } from '../../../../phet-core/js/optionize.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSConstants from '../../common/QBSConstants.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';

export class EnergyDiagramControlPanel extends Panel {

  protected constructor( controls: Node[], tandem: Tandem ) {

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
        ...controls
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

quantumBoundStates.register( 'EnergyDiagramControlPanel', EnergyDiagramControlPanel );