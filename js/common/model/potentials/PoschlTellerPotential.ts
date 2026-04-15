// Copyright 2026, University of Colorado Boulder

//TODO Rename to 'Anharmonic Oscillator'?
/**
 * PoschlTellerPotential is a Pöschl-Teller potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import QBSColors from '../../QBSColors.js';
import QBSConstants from '../../QBSConstants.js';
import QuantumPotential, { QuantumPotentialOptions } from './QuantumPotential.js';

type SelfOptions = EmptySelfOptions;

export type PoschlTellerPotentialOptions = SelfOptions &
  Pick<QuantumPotentialOptions, 'numberOfWellsProperty' | 'electricFieldProperty' | 'tandem'>;

export default class PoschlTellerPotential extends QuantumPotential {

  public constructor( providedOptions: PoschlTellerPotentialOptions ) {

    const options = optionize<PoschlTellerPotentialOptions, SelfOptions, QuantumPotentialOptions>()( {

      // QuantumPotentialOptions
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.poschlTellerStringProperty,
      tandemPrefix: 'poschlTellerPotential' //TODO rename to 'anharmonicOscillatorPotential'?
    }, providedOptions );

    super( options );
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