// Copyright 2025-2026, University of Colorado Boulder

/**
 * ManyWellsScreen is the 'Many Wells' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import Tandem from '../../../tandem/js/Tandem.js';
import QBSColors from '../common/QBSColors.js';
import FiniteSquareWellsIcon from '../common/view/FiniteSquareWellsIcon.js';
import QBSKeyboardHelpContent from '../common/view/QBSKeyboardHelpContent.js';
import quantumBoundStates from '../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../QuantumBoundStatesFluent.js';
import ManyWellsModel from './model/ManyWellsModel.js';
import ManyWellsScreenView from './view/ManyWellsScreenView.js';

export default class ManyWellsScreen extends Screen<ManyWellsModel, ManyWellsScreenView> {

  public constructor( tandem: Tandem ) {

    const options: ScreenOptions = {
      name: QuantumBoundStatesFluent.screen.manyWellsStringProperty,
      backgroundColorProperty: QBSColors.screenBackgroundColorProperty,
      homeScreenIcon: createScreenIcon(),
      createKeyboardHelpNode: () => new QBSKeyboardHelpContent(),
      screenButtonsHelpText: QuantumBoundStatesFluent.a11y.screens.manyWellsScreen.screenButtonsHelpTextStringProperty,
      tandem: tandem
    };

    super(
      () => new ManyWellsModel( tandem.createTandem( 'model' ) ),
      model => new ManyWellsScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

/**
 * Creates the icon for this screen.
 */
function createScreenIcon(): ScreenIcon {
  return new ScreenIcon( new FiniteSquareWellsIcon( {
    numberOfWells: 4,
    wellWidth: 7.5,
    wellDepth: 30,
    lineWidth: 3
  } ), {
    maxIconWidthProportion: 0.85,
    maxIconHeightProportion: 0.85,
    fill: QBSColors.screenBackgroundColorProperty
  } );
}

quantumBoundStates.register( 'ManyWellsScreen', ManyWellsScreen );