// Copyright 2026, University of Colorado Boulder

/**
 * CoulombPotential is a quantum potential composed of 1 Coulomb well.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Range from '../../../../../dot/js/Range.js';
import Shape from '../../../../../kite/js/Shape.js';
import affirm from '../../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize, { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Path from '../../../../../scenery/js/nodes/Path.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import QBSColors from '../../QBSColors.js';
import QBSConstants from '../../QBSConstants.js';
import QuantumPotential, { QuantumPotentialOptions } from './QuantumPotential.js';

// getPotentialEnergyAt handles an electric field, but it is not currently used in the sim.
const ELECTRIC_FIELD = 0; // V/nm

type SelfOptions = EmptySelfOptions;

export type CoulombPotentialOptions = SelfOptions &
  Pick<QuantumPotentialOptions, 'numberOfWellsProperty' | 'electricFieldProperty' | 'yOffsetRange' | 'tandem'>;

export default class CoulombPotential extends QuantumPotential {

  public constructor( providedOptions: CoulombPotentialOptions ) {

    const options = optionize<CoulombPotentialOptions, SelfOptions, QuantumPotentialOptions>()( {

      // SelfOptions
      energyAxisRange: new Range( -20.5, 0.5 ),

      // QuantumPotentialOptions
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.coulombStringProperty,
      tandemPrefix: 'coulombPotential'
    }, providedOptions );

    super( options );
  }

  /**
   * Gets the potential energy (eV) at a specified x-coordinate (nm).
   */
  public override getPotentialEnergyAt( x: number ): number {
    affirm( this.numberOfWellsProperty.value === 1, 'CoulombPotential does not support multiple wells.' );
    affirm( this.electricFieldProperty.value === 0, 'CoulombPotential does not support electric field.' );

    // This algorithm handles multiple wells, but we only have 1 well in the current implementation.
    const n = 1; // number of wells
    const spacing = 0; // because n = 1

    const xOffset = this.xOffset;
    const yOffset = this.yOffsetProperty.value;

    // From BSCoulomb1DPotential.java
    let energy = 0;
    for ( let i = 1; i <= n; i++ ) {
      const xi = spacing * ( i - ( ( n + 1 ) / 2.0 ) );
      let deltaEnergy = -QBSConstants.KE2 / Math.abs( ( x - xOffset ) - xi );
      const BIG_NEGATIVE = -1E10; //TODO
      if ( deltaEnergy < BIG_NEGATIVE ) {
        deltaEnergy = BIG_NEGATIVE;
      }
      energy += deltaEnergy;
    }

    // Apply electric field.
    energy += ( ELECTRIC_FIELD * x );

    return yOffset + energy;
  }

  public override toString(): string {
    return `${this.tandemPrefix}[ ` +
           `numberOfWells=${this.numberOfWellsProperty.value} ` +
           `electricField=${this.electricFieldProperty.value} ` +
           `yOffset=${this.yOffsetProperty.value} ` +
           ']';
  }

  public override getMinPotentialEnergy(): number {
    return this.energyAxisRange.min + this.yOffsetProperty.value; // bottom of the y-axis range
  }

  public override getMaxPotentialEnergy(): number {
    return this.yOffsetProperty.value; // top of the potential
  }

  public override createIcon(): Node {

    // Shape ported from BSWellComboBox.java, values determined empirically.
    const shape = new Shape()
      .moveTo( 0, 4 )
      .quadraticCurveTo( 8, 5, 7, 16 )
      .moveTo( 10, 16 )
      .quadraticCurveTo( 11, 5, 17, 4 );

    return new Path( shape, {
      stroke: QBSColors.potentialEnergyColorProperty,
      lineWidth: QBSConstants.POTENTIAL_ICON_LINE_WIDTH
    } );
  }
}
