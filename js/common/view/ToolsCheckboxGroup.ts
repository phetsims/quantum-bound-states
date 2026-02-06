// Copyright 2026, University of Colorado Boulder

/**
 * ToolsCheckboxGroup is a group of checkboxes for controlling the visibility of tools.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QBSConstants from '../QBSConstants.js';
import MagnifierToolCheckbox from './MagnifierToolCheckbox.js';
import ReferenceLineCheckbox from './ReferenceLineCheckbox.js';

export default class ToolsCheckboxGroup extends Panel {

  public constructor( referenceLineVisibleProperty: Property<boolean>,
                      magnifierToolVisibleProperty: Property<boolean>,
                      tandem: Tandem ) {

    const options = combineOptions<PanelOptions>( {}, QBSConstants.PANEL_OPTIONS, {
      isDisposable: false,
      stroke: null,
      fill: null,
      tandem: tandem,
      phetioVisiblePropertyInstrumented: true
    } );

    const magnifierToolCheckbox = new MagnifierToolCheckbox( referenceLineVisibleProperty, tandem.createTandem( 'magnifierToolCheckbox' ) );

    const referenceLineCheckbox = new ReferenceLineCheckbox( magnifierToolVisibleProperty, tandem.createTandem( 'referenceLineCheckbox' ) );

    const content = new VBox( {
      children: [ magnifierToolCheckbox, referenceLineCheckbox ],
      spacing: 6,
      align: 'left'
    } );

    super( content, options );
  }
}

quantumBoundStates.register( 'ToolsCheckboxGroup', ToolsCheckboxGroup );