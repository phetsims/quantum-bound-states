// Copyright 2025, University of Colorado Boulder

/**
 * TwoWellsScreen is the 'Two Wells' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import Tandem from '../../../tandem/js/Tandem.js';
import QBSColors from '../common/QBSColors.js';
import QBSKeyboardHelpContent from '../common/view/QBSKeyboardHelpContent.js';
import quantumBoundStates from '../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../QuantumBoundStatesFluent.js';
import TwoWellsModel from './model/TwoWellsModel.js';
import TwoWellsScreenView from './view/TwoWellsScreenView.js';

export default class TwoWellsScreen extends Screen<TwoWellsModel, TwoWellsScreenView> {

  public constructor( tandem: Tandem ) {

    const options: ScreenOptions = {
      name: QuantumBoundStatesFluent.screen.twoWellsStringProperty,
      backgroundColorProperty: QBSColors.screenBackgroundColorProperty,
      createKeyboardHelpNode: () => new QBSKeyboardHelpContent(),
      screenButtonsHelpText: QuantumBoundStatesFluent.a11y.twoWellsScreen.screenButtonsHelpTextStringProperty,
      tandem: tandem
    };

    super(
      () => new TwoWellsModel( tandem.createTandem( 'model' ) ),
      model => new TwoWellsScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

quantumBoundStates.register( 'TwoWellsScreen', TwoWellsScreen );