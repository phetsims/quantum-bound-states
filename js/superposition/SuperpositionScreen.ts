// Copyright 2025-2026, University of Colorado Boulder

/**
 * SuperpositionScreen is the 'Superposition' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import Text from '../../../scenery/js/nodes/Text.js';
import Tandem from '../../../tandem/js/Tandem.js';
import QBSColors from '../common/QBSColors.js';
import QBSKeyboardHelpContent from '../common/view/QBSKeyboardHelpContent.js';
import QuantumBoundStatesFluent from '../QuantumBoundStatesFluent.js';
import SuperpositionModel from './model/SuperpositionModel.js';
import SuperpositionScreenView from './view/SuperpositionScreenView.js';

export default class SuperpositionScreen extends Screen<SuperpositionModel, SuperpositionScreenView> {

  public constructor( tandem: Tandem ) {

    const options: ScreenOptions = {
      name: QuantumBoundStatesFluent.screen.superpositionStringProperty,
      backgroundColorProperty: QBSColors.screenBackgroundColorProperty,
      homeScreenIcon: createScreenIcon(),
      createKeyboardHelpNode: () => new QBSKeyboardHelpContent(),
      screenButtonsHelpText: QuantumBoundStatesFluent.a11y.screens.superpositionScreen.screenButtonsHelpTextStringProperty,
      tandem: tandem
    };

    super(
      () => new SuperpositionModel( tandem.createTandem( 'model' ) ),
      model => new SuperpositionScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

/**
 * Creates the icon for this screen.
 */
function createScreenIcon(): ScreenIcon {

  const iconNode = new Text( '?' ); //TODO icon for this screen

  return new ScreenIcon( iconNode, {
    maxIconWidthProportion: 0.85,
    maxIconHeightProportion: 0.85,
    fill: QBSColors.screenBackgroundColorProperty
  } );
}

