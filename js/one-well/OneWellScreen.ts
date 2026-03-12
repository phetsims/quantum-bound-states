// Copyright 2025-2026, University of Colorado Boulder

/**
 * OneWellScreen is the 'One Well' screen.
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
import OneWellModel from './model/OneWellModel.js';
import OneWellScreenView from './view/OneWellScreenView.js';

export default class OneWellScreen extends Screen<OneWellModel, OneWellScreenView> {

  public constructor( tandem: Tandem ) {

    const options: ScreenOptions = {
      name: QuantumBoundStatesFluent.screen.oneWellStringProperty,
      backgroundColorProperty: QBSColors.screenBackgroundColorProperty,
      homeScreenIcon: createScreenIcon(),
      createKeyboardHelpNode: () => new QBSKeyboardHelpContent(),
      screenButtonsHelpText: QuantumBoundStatesFluent.a11y.screens.oneWellScreen.screenButtonsHelpTextStringProperty,
      tandem: tandem
    };

    super(
      () => new OneWellModel( tandem.createTandem( 'model' ) ),
      model => new OneWellScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

/**
 * Creates the icon for this screen.
 */
function createScreenIcon(): ScreenIcon {
  return new ScreenIcon( new FiniteSquareWellsIcon( {
    numberOfWells: 1,
    wellWidth: 30,
    wellDepth: 30,
    lineWidth: 3
  } ), {
    maxIconWidthProportion: 0.85,
    maxIconHeightProportion: 0.85,
    fill: QBSColors.screenBackgroundColorProperty
  } );
}


quantumBoundStates.register( 'OneWellScreen', OneWellScreen );