// Copyright 2026, University of Colorado Boulder

/**
 * ToolsCheckboxGroup is a group of checkboxes for controlling the visibility of tools.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import MagnifierToolCheckbox from './MagnifierToolCheckbox.js';
import ReferenceLineCheckbox from './ReferenceLineCheckbox.js';

export default class ToolsCheckboxGroup extends VBox {

  public constructor( referenceLineVisibleProperty: Property<boolean>,
                      magnifierToolVisibleProperty: Property<boolean>,
                      tandem: Tandem ) {

    const magnifierToolCheckbox = new MagnifierToolCheckbox( referenceLineVisibleProperty, tandem.createTandem( 'magnifierToolCheckbox' ) );

    const referenceLineCheckbox = new ReferenceLineCheckbox( magnifierToolVisibleProperty, tandem.createTandem( 'referenceLineCheckbox' ) );

    super( {
      isDisposable: false,
      children: [ magnifierToolCheckbox, referenceLineCheckbox ],
      spacing: 6,
      align: 'left',
      tandem: tandem
    } );
  }
}

quantumBoundStates.register( 'ToolsCheckboxGroup', ToolsCheckboxGroup );