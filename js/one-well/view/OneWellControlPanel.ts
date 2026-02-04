// Copyright 2026, University of Colorado Boulder

/**
 * OneWellControlPanel is the main control panel for the 'One Well' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { combineOptions } from '../../../../phet-core/js/optionize.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSConstants from '../../common/QBSConstants.js';
import WaveFunctionComponentsCheckboxGroup from '../../common/view/WaveFunctionComponentsCheckboxGroup.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import OneWellModel from '../model/OneWellModel.js';

export default class OneWellControlPanel extends Panel {

  public constructor( model: OneWellModel, tandem: Tandem ) {

    const options = combineOptions<PanelOptions>( {
      isDisposable: false,
      tandem: tandem
    }, QBSConstants.PANEL_OPTIONS );

    const checkboxGroup = new WaveFunctionComponentsCheckboxGroup(
      model.realPartVisibleProperty,
      model.imaginaryPartVisibleProperty,
      model.magnitudeVisibleProperty,
      model.phaseVisibleProperty,
      tandem.createTandem( 'checkboxGroup' )
    );

    const content = new VBox( {
      align: 'left',
      spacing: 5,
      children: [
        checkboxGroup
      ]
    } );

    super( content, options );
  }
}

quantumBoundStates.register( 'OneWellControlPanel', OneWellControlPanel );