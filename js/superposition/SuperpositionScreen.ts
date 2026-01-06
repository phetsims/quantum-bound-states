// Copyright 2025, University of Colorado Boulder

/**
 * SuperpositionScreen is the 'Superposition' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import Tandem from '../../../tandem/js/Tandem.js';
import QBSColors from '../common/QBSColors.js';
import QBSKeyboardHelpContent from '../common/view/QBSKeyboardHelpContent.js';
import quantumBoundStates from '../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../QuantumBoundStatesFluent.js';
import SuperpositionModel from './model/SuperpositionModel.js';
import SuperpositionScreenView from './view/SuperpositionScreenView.js';

export default class SuperpositionScreen extends Screen<SuperpositionModel, SuperpositionScreenView> {

  public constructor( tandem: Tandem ) {

    const options: ScreenOptions = {
      name: QuantumBoundStatesFluent.screen.superpositionStringProperty,
      backgroundColorProperty: QBSColors.screenBackgroundColorProperty,
      createKeyboardHelpNode: () => new QBSKeyboardHelpContent(),
      screenButtonsHelpText: QuantumBoundStatesFluent.a11y.superpositionScreen.screenButtonsHelpTextStringProperty,
      tandem: tandem
    };

    super(
      () => new SuperpositionModel( tandem.createTandem( 'model' ) ),
      model => new SuperpositionScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

quantumBoundStates.register( 'SuperpositionScreen', SuperpositionScreen );