// Copyright 2026, University of Colorado Boulder

/**
 * CoulombPotential is a quantum potential composed of 1 Coulomb well.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Range from '../../../../../dot/js/Range.js';
import Shape from '../../../../../kite/js/Shape.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Path from '../../../../../scenery/js/nodes/Path.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import QBSColors from '../../QBSColors.js';
import QBSConstants from '../../QBSConstants.js';
import Potential from './Potential.js';

const ENERGY_AXIS_RANGE = new Range( -15.5, 5.5 );

export default class CoulombPotential extends Potential {

  //TODO Temporary constants, same as initial state of Java version.
  private readonly numberOfWells = 1;
  private readonly yOffset = 0; //TODO Java [-15,5] eV, bottom of well
  private readonly centerX = 0; //TODO Constant 0 nm in Java
  private readonly electricField = 0; //TODO Java [-1,1] V/nm

  public constructor( tandem: Tandem ) {
    super( {
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.coulombStringProperty,
      tandemPrefix: 'coulombPotential',
      tandem: tandem,
      phetioDocumentation: 'A quantum potential with one Coulomb well.'
    } );
  }

  /**
   * Gets the potential energy (eV) at a specified x-coordinate (nm).
   */
  public override getPotentialEnergyAt( x: number ): number {

    const n = this.numberOfWells; //TODO not needed?
    const spacing = 0; //TODO
    const yOffset = this.yOffset;
    const centerX = this.centerX;

    // From BSCoulomb1DPotential.java
    let energy = 0;
    for ( let i = 1; i <= n; i++ ) {
      const xi = spacing * ( i - ( ( n + 1 ) / 2.0 ) );
      let deltaEnergy = -QBSConstants.KE2 / Math.abs( ( x - centerX ) - xi );
      const BIG_NEGATIVE = -1E10; //TODO
      if ( deltaEnergy < BIG_NEGATIVE ) {
        deltaEnergy = BIG_NEGATIVE;
      }
      energy += deltaEnergy;
    }

    // Apply electric field.
    energy += ( this.electricField * x );

    return yOffset + energy;
  }

  /**
   * Gets the range of the energy axis (y-axis).
   */
  public override getEnergyAxisRange(): Range {
    return ENERGY_AXIS_RANGE;
  }

  public override getMinPotentialEnergy(): number {
    return this.getEnergyAxisRange().min; //TODO incorrect
  }

  public override getMaxPotentialEnergy(): number {
    return this.getEnergyAxisRange().max; //TODO incorrect
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
