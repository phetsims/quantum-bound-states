// Copyright 2026, University of Colorado Boulder

/**
 * ToolsPanel is a group of checkboxes for controlling the visibility of tools.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import { AlignBoxOptions } from '../../../../scenery/js/layout/nodes/AlignBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import QBSColors from '../QBSColors.js';
import QBSConstants from '../QBSConstants.js';
import MagnifierCheckbox from './MagnifierCheckbox.js';
import ReferenceLineCheckbox from './ReferenceLineCheckbox.js';
import ValuesCheckbox from './ValuesCheckbox.js';

export default class ToolsPanel extends Panel {

  public constructor( valuesVisibleProperty: Property<boolean>,
                      referenceLineVisibleProperty: Property<boolean>,
                      magnifierToolVisibleProperty: Property<boolean>,
                      tandem: Tandem ) {

    const options = combineOptions<PanelOptions>( {}, QBSConstants.PANEL_OPTIONS, {
      isDisposable: false,
      xMargin: 0,
      yMargin: 0,
      fill: QBSColors.toolsPanelFillProperty,
      stroke: QBSColors.toolsPanelStrokeProperty,
      accessibleHeading: QuantumBoundStatesFluent.a11y.toolControls.accessibleHeadingStringProperty,
      tandem: tandem,
      phetioVisiblePropertyInstrumented: true
    } );

    // To make all checkboxes have the same effective size.
    const alignGroup = new AlignGroup();
    const alignBoxOptions: AlignBoxOptions = {
      xAlign: 'left'
    };

    const valuesCheckbox = new ValuesCheckbox( valuesVisibleProperty, tandem.createTandem( 'valuesCheckbox' ) );

    const magnifierCheckbox = new MagnifierCheckbox( referenceLineVisibleProperty, tandem.createTandem( 'magnifierCheckbox' ) );

    const referenceLineCheckbox = new ReferenceLineCheckbox( magnifierToolVisibleProperty, tandem.createTandem( 'referenceLineCheckbox' ) );

    const content = new VBox( {
      children: [
        alignGroup.createBox( valuesCheckbox, alignBoxOptions ),
        alignGroup.createBox( magnifierCheckbox, alignBoxOptions ),
        alignGroup.createBox( referenceLineCheckbox, alignBoxOptions )
      ],
      spacing: 4,
      align: 'left'
    } );

    super( content, options );
  }
}

quantumBoundStates.register( 'ToolsPanel', ToolsPanel );