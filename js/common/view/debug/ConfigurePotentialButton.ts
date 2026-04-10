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
import Image from '../../../../../scenery/js/nodes/Image.js';
import ButtonNode from '../../../../../sun/js/buttons/ButtonNode.js';
import RoundPushButton, { RoundPushButtonOptions } from '../../../../../sun/js/buttons/RoundPushButton.js';
import Dialog from '../../../../../sun/js/Dialog.js';
import AnharmonicOscillatorPotential from '../../model/potentials/AnharmonicOscillatorPotential.js';
import AsymmetricTrianglePotential from '../../model/potentials/AsymmetricTrianglePotential.js';
import CoulombPotential from '../../model/potentials/CoulombPotential.js';
import FiniteSquarePotential from '../../model/potentials/FiniteSquarePotential.js';
import HarmonicOscillatorPotential from '../../model/potentials/HarmonicOscillatorPotential.js';
import InfiniteSquarePotential from '../../model/potentials/InfiniteSquarePotential.js';
import InfiniteStepPotential from '../../model/potentials/InfiniteStepPotential.js';
import QuantumPotential from '../../model/potentials/QuantumPotential.js';
import ConfigureFiniteSquareDialog from './ConfigureFiniteSquareDialog.js';
import ConfigureInfiniteSquareDialog from './ConfigureInfiniteSquareDialog.js';
import ConfigureInfiniteStepDialog from './ConfigureInfiniteStepDialog.js';
import ConfigureUnderConstructionDialog from './ConfigureUnderConstructionDialog.js';

export default class ConfigurePotentialButton extends RoundPushButton {

  private readonly potentialProperty: TReadOnlyProperty<QuantumPotential>;

  public constructor( potentialProperty: TReadOnlyProperty<QuantumPotential> ) {

    const options: RoundPushButtonOptions = {
      content: new Image( preferencesIconOnWhite_png, {
        scale: 0.15,
        pickable: false
      } ),
      buttonAppearanceStrategy: ButtonNode.FlatAppearanceStrategy,
      baseColor: 'rgb( 255, 100, 100 )',
      xMargin: 3,
      yMargin: 3,
      listener: () => this.openDialog()
    };

    super( options );

    this.potentialProperty = potentialProperty;
  }

  /**
   * Opens a dialog that is specific to the type of potential that is selected.
   */
  private openDialog(): void {
    const potential = this.potentialProperty.value;
    let dialog: Dialog | undefined;
    if ( potential instanceof AnharmonicOscillatorPotential ) {
      dialog = new ConfigureUnderConstructionDialog( 'Anharmonic Oscillator' ); //TODO
    }
    else if ( potential instanceof AsymmetricTrianglePotential ) {
      dialog = new ConfigureUnderConstructionDialog( 'Asymmetric Triangle' ); //TODO
    }
    else if ( potential instanceof CoulombPotential ) {
      dialog = new ConfigureUnderConstructionDialog( 'Coulomb' ); //TODO
    }
    else if ( potential instanceof FiniteSquarePotential ) {
      dialog = new ConfigureFiniteSquareDialog( potential );
    }
    else if ( potential instanceof HarmonicOscillatorPotential ) {
      dialog = new ConfigureUnderConstructionDialog( 'Harmonic Oscillator' ); //TODO
    }
    else if ( potential instanceof InfiniteSquarePotential ) {
      dialog = new ConfigureInfiniteSquareDialog( potential );
    }
    else if ( potential instanceof InfiniteStepPotential ) {
      dialog = new ConfigureInfiniteStepDialog( potential );
    }

    dialog && dialog.show();
  }
}