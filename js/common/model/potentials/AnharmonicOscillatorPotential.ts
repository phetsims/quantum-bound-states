// Copyright 2026, University of Colorado Boulder

/**
 * AnharmonicOscillatorPotential is a quantum potential based on Pöschl-Teller.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ReadOnlyProperty from '../../../../../axon/js/ReadOnlyProperty.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../../phet-core/js/types/StrictOmit.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import QBSColors from '../../QBSColors.js';
import QBSConstants from '../../QBSConstants.js';
import QuantumPotential, { QuantumPotentialOptions } from './QuantumPotential.js';

type SelfOptions = {
  electricFieldProperty: ReadOnlyProperty<number>;
};

export type AnharmonicOscillatorPotentialOptions = SelfOptions &
  Pick<QuantumPotentialOptions, 'numberOfWellsProperty' | 'tandem'>;

export default class AnharmonicOscillatorPotential extends QuantumPotential {

  private readonly electricFieldProperty: ReadOnlyProperty<number>;

  public constructor( providedOptions: AnharmonicOscillatorPotentialOptions ) {

    const options = optionize<AnharmonicOscillatorPotentialOptions,
      StrictOmit<SelfOptions, 'electricFieldProperty'>, QuantumPotentialOptions>()( {

      // QuantumPotentialOptions
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.anharmonicOscillatorStringProperty,
      tandemPrefix: 'anharmonicOscillatorPotential'
    }, providedOptions );

    super( options );

    // Do not trigger notification when electricFieldProperty changes, because it is owned by the top-level model.
    this.electricFieldProperty = options.electricFieldProperty;
  }

  /**
   * Gets the potential energy (eV) at a specified x-coordinate (nm).
   */
  public getPotentialEnergyAt( x: number ): number {
    return 0; //TODO implement getPotentialEnergyAt
  }

  /**
   * Gets the index of the ground state.
   */
  public override getGroundStateIndex(): number {
    return 0;
  }

  public override getMinPotentialEnergy(): number {
    return this.getEnergyAxisRange().min; //TODO incorrect
  }

  public override getMaxPotentialEnergy(): number {
    return this.getEnergyAxisRange().max; //TODO incorrect
  }

  /**
   * Creates the icon for this potential.
   */
  public override createIcon(): Node {
    //TODO icon for Poschl-Teller potential
    return new Text( '?', {
      fill: QBSColors.potentialEnergyColorProperty,
      font: QBSConstants.CONTROL_FONT
    } );
  }
}