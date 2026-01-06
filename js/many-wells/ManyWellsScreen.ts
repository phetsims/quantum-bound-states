// Copyright 2025, University of Colorado Boulder

/**
 * ManyWellsScreen is the 'Many Wells' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import Tandem from '../../../tandem/js/Tandem.js';
import QBSColors from '../common/QBSColors.js';
import QBSKeyboardHelpContent from '../common/view/QBSKeyboardHelpContent.js';
import quantumBoundStates from '../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../QuantumBoundStatesFluent.js';
import QuantumBoundStatesStrings from '../QuantumBoundStatesStrings.js';
import ManyWellsModel from './model/ManyWellsModel.js';
import ManyWellsScreenView from './view/ManyWellsScreenView.js';

export default class ManyWellsScreen extends Screen<ManyWellsModel, ManyWellsScreenView> {

  public constructor( tandem: Tandem ) {

    const options: ScreenOptions = {
      name: QuantumBoundStatesStrings.screen.manyWellsStringProperty,
      backgroundColorProperty: QBSColors.screenBackgroundColorProperty,
      createKeyboardHelpNode: () => new QBSKeyboardHelpContent(),
      screenButtonsHelpText: QuantumBoundStatesFluent.a11y.manyWellsScreen.screenButtonsHelpTextStringProperty,
      tandem: tandem
    };

    super(
      () => new ManyWellsModel( tandem.createTandem( 'model' ) ),
      model => new ManyWellsScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

quantumBoundStates.register( 'ManyWellsScreen', ManyWellsScreen );