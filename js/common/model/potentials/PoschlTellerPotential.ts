// Copyright 2026, University of Colorado Boulder

//TODO Rename to 'Anharmonic Oscillator'?
/**
 * PoschlTellerPotential is a Pöschl-Teller potential.
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

export type PoschlTellerPotentialOptions = SelfOptions &
  Pick<QuantumPotentialOptions, 'numberOfWellsProperty' | 'tandem'>;

export default class PoschlTellerPotential extends QuantumPotential {

  private readonly electricFieldProperty: ReadOnlyProperty<number>;

  public constructor( providedOptions: PoschlTellerPotentialOptions ) {

    const options = optionize<PoschlTellerPotentialOptions,
      StrictOmit<SelfOptions, 'electricFieldProperty'>, QuantumPotentialOptions>()( {

      // QuantumPotentialOptions
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.poschlTellerStringProperty,
      tandemPrefix: 'poschlTellerPotential' //TODO rename to 'anharmonicOscillatorPotential'?
    }, providedOptions );

    super( options );

    // Do not trigger notification when electricFieldProperty changes, because it is owned by the top-level model.
    this.electricFieldProperty = options.electricFieldProperty;
  }

  /**
   * Gets the potential energy (eV) at a specified x-coordinate (nm).
   */
  public getPotentialEnergyAt( x: number ): number {
    return 0; //TODO implement getPotentialEnergyAt: N wells, electricField, yOffset, xOffset, wellWidth, wellDepth, spacing?
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