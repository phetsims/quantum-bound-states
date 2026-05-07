// Copyright 2026, University of Colorado Boulder

/**
 * ConfigurePotentialButton opens a dialog for configuring the selected potential.
 * This is for debugging purposes, and not part of the public UI.
 * Run with ?dev to see this button above the Energy Diagram.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import preferencesIconOnWhite_png from '../../../../../joist/images/preferencesIconOnWhite_png.js';
import affirm from '../../../../../perennial-alias/js/browser-and-node/affirm.js';
import Image from '../../../../../scenery/js/nodes/Image.js';
import ButtonNode from '../../../../../sun/js/buttons/ButtonNode.js';
import RoundPushButton, { RoundPushButtonOptions } from '../../../../../sun/js/buttons/RoundPushButton.js';
import Dialog from '../../../../../sun/js/Dialog.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import AsymmetricTrianglePotential from '../../model/potentials/AsymmetricTrianglePotential.js';
import CoulombPotential from '../../model/potentials/CoulombPotential.js';
import FiniteSquarePotential from '../../model/potentials/FiniteSquarePotential.js';
import HarmonicOscillatorPotential from '../../model/potentials/HarmonicOscillatorPotential.js';
import InfiniteSquarePotential from '../../model/potentials/InfiniteSquarePotential.js';
import InfiniteStepPotential from '../../model/potentials/InfiniteStepPotential.js';
import MorsePotential from '../../model/potentials/MorsePotential.js';
import PoschlTellerPotential from '../../model/potentials/PoschlTellerPotential.js';
import QuantumPotential from '../../model/potentials/QuantumPotential.js';
import QBSTime from '../../model/QBSTime.js';
import ConfigureAsymmetricTriangleDialog from './ConfigureAsymmetricTriangleDialog.js';
import ConfigureCoulombDialog from './ConfigureCoulombDialog.js';
import ConfigureFiniteSquareDialog from './ConfigureFiniteSquareDialog.js';
import ConfigureHarmonicOscillatorDialog from './ConfigureHarmonicOscillatorDialog.js';
import ConfigureInfiniteSquareDialog from './ConfigureInfiniteSquareDialog.js';
import ConfigureInfiniteStepDialog from './ConfigureInfiniteStepDialog.js';
import ConfigureMorseDialog from './ConfigureMorseDialog.js';
import ConfigurePoschlTellerDialog from './ConfigurePoschlTellerDialog.js';

export default class ConfigurePotentialButton extends RoundPushButton {

  private readonly potentialProperty: TReadOnlyProperty<QuantumPotential>;
  private readonly time: QBSTime;

  public constructor( potentialProperty: TReadOnlyProperty<QuantumPotential>, time: QBSTime ) {

    const options: RoundPushButtonOptions = {
      content: new Image( preferencesIconOnWhite_png, {
        scale: 0.15,
        pickable: false
      } ),
      buttonAppearanceStrategy: ButtonNode.FlatAppearanceStrategy,
      baseColor: 'rgb( 255, 100, 100 )',
      xMargin: 3,
      yMargin: 3,
      listener: () => this.openDialog(),
      tandem: Tandem.OPT_OUT
    };

    super( options );

    this.potentialProperty = potentialProperty;
    this.time = time;
  }

  /**
   * Opens a dialog that is specific to the type of potential that is selected.
   */
  private openDialog(): void {

    const potential = this.potentialProperty.value;

    let dialog: Dialog | undefined;
    if ( potential instanceof AsymmetricTrianglePotential ) {
      dialog = new ConfigureAsymmetricTriangleDialog( potential, this.time );
    }
    else if ( potential instanceof CoulombPotential ) {
      dialog = new ConfigureCoulombDialog( potential, this.time );
    }
    else if ( potential instanceof FiniteSquarePotential ) {
      dialog = new ConfigureFiniteSquareDialog( potential, this.time );
    }
    else if ( potential instanceof HarmonicOscillatorPotential ) {
      dialog = new ConfigureHarmonicOscillatorDialog( potential, this.time );
    }
    else if ( potential instanceof InfiniteSquarePotential ) {
      dialog = new ConfigureInfiniteSquareDialog( potential, this.time );
    }
    else if ( potential instanceof InfiniteStepPotential ) {
      dialog = new ConfigureInfiniteStepDialog( potential, this.time );
    }
    else if ( potential instanceof PoschlTellerPotential ) {
      dialog = new ConfigurePoschlTellerDialog( potential, this.time );
    }
    else if ( potential instanceof MorsePotential ) {
      dialog = new ConfigureMorseDialog( potential, this.time );
    }

    affirm( dialog, `Unsupported potential type: ${potential.tandemPrefix}` );
    dialog.show();
  }
}