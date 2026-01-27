// Copyright 2026, University of Colorado Boulder

/**
 * OneWellControlPanel is the main control panel for the 'One Well' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { combineOptions } from '../../../../phet-core/js/optionize.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSConstants from '../../common/QBSConstants.js';
import quantumBoundStates from '../../quantumBoundStates.js';

export default class OneWellControlPanel extends Panel {

  public constructor( tandem: Tandem ) {

    const options = combineOptions<PanelOptions>( {
      isDisposable: false,
      tandem: tandem
    }, QBSConstants.PANEL_OPTIONS );

    const energyLevelSpinner = new Text( 'Energy Level', {
      tandem: tandem.createTandem( 'energyLevelSpinner' )
    } );

    const content = new VBox( {
      align: 'left',
      spacing: 5,
      children: [
        energyLevelSpinner
      ]
    } );

    super( content, options );
  }
}

quantumBoundStates.register( 'OneWellControlPanel', OneWellControlPanel );