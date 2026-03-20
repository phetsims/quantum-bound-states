// Copyright 2025-2026, University of Colorado Boulder

/**
 * TwoWellsScreen is the 'Two Wells' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import Tandem from '../../../tandem/js/Tandem.js';
import QBSColors from '../common/QBSColors.js';
import FiniteSquareWellsIcon from '../common/view/FiniteSquareWellsIcon.js';
import QBSKeyboardHelpContent from '../common/view/QBSKeyboardHelpContent.js';
import QuantumBoundStatesFluent from '../QuantumBoundStatesFluent.js';
import TwoWellsModel from './model/TwoWellsModel.js';
import TwoWellsScreenView from './view/TwoWellsScreenView.js';

export default class TwoWellsScreen extends Screen<TwoWellsModel, TwoWellsScreenView> {

  public constructor( tandem: Tandem ) {

    const options: ScreenOptions = {
      name: QuantumBoundStatesFluent.screen.twoWellsStringProperty,
      backgroundColorProperty: QBSColors.screenBackgroundColorProperty,
      homeScreenIcon: createScreenIcon(),
      createKeyboardHelpNode: () => new QBSKeyboardHelpContent(),
      screenButtonsHelpText: QuantumBoundStatesFluent.a11y.screens.twoWellsScreen.screenButtonsHelpTextStringProperty,
      tandem: tandem
    };

    super(
      () => new TwoWellsModel( tandem.createTandem( 'model' ) ),
      model => new TwoWellsScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

/**
 * Creates the icon for this screen.
 */
function createScreenIcon(): ScreenIcon {
  return new ScreenIcon( new FiniteSquareWellsIcon( {
    numberOfWells: 2,
    wellWidth: 15,
    wellDepth: 30,
    wellSpacing: 10,
    edgeLength: 8,
    lineWidth: 3
  } ), {
    maxIconWidthProportion: 0.85,
    maxIconHeightProportion: 0.85,
    fill: QBSColors.screenBackgroundColorProperty
  } );
}
