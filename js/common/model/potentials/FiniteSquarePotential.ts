// Copyright 2026, University of Colorado Boulder

/**
 * FiniteSquarePotential is a quantum potential composed of 1 finite square well.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import affirm from '../../../../../perennial-alias/js/browser-and-node/affirm.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import FiniteSquareWellsIcon from '../../view/FiniteSquareWellsIcon.js'; // eslint-disable-line phet/no-view-imported-from-model
import Potential from './Potential.js';

export default class FiniteSquarePotential extends Potential {

  //TODO Temporary constants, same as initial state of Java version.
  private readonly numberOfWells = 1;
  private readonly wellWidth = 1; //TODO Java: [0.1,6] nm and named 'width'
  private readonly wellDepth = 10; //TODO Java: [0,20] eV and named 'height'
  private readonly yOffset = 0; //TODO Java [-5,15] eV, bottom of well
  private readonly centerX = 0; //TODO Constant 0 nm in Java
  private readonly separation = 0; //TODO Java [0.05,0.7] nm, distance between walls of adjacent wells
  private readonly electricField = 0; //TODO Java [-1,1] V/nm

  public constructor( tandem: Tandem ) {
    super( {
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.finiteSquareStringProperty,
      tandemPrefix: 'finiteSquarePotential',
      tandem: tandem,
      phetioDocumentation: 'A quantum potential with one finite square well.'
    } );
  }

  /**
   * Gets the potential energy (y-value) at a specified x-coordinate.
   */
  public override getPotentialEnergyAt( x: number ): number {

    const n = this.numberOfWells;
    const wellWidth = this.wellWidth;
    const yOffset = this.yOffset;
    const centerX = this.centerX;
    const s = wellWidth + this.separation; // spacing between well centers

    let pe = yOffset + this.wellDepth;

    // From BSSquarePotential.java
    for ( let i = 1; i <= n; i++ ) {
      const xi = s * ( i - ( ( n + 1 ) / 2 ) );
      if ( ( ( x - centerX ) >= xi - ( wellWidth / 2 ) ) && ( ( x - centerX ) <= xi + ( wellWidth / 2 ) ) ) {
        pe = yOffset;
        break;
      }
    }

    // Apply electric field.
    pe += ( this.electricField * x );

    affirm( pe < 100000 );
    return pe;
  }

  public override getMinPotentialEnergy(): number {
    return this.yOffset;
  }

  public override getMaxPotentialEnergy(): number {
    return this.yOffset + this.wellDepth;
  }

  /**
   * Creates the icon for this potential.
   */
  public override createIcon(): Node {
    return new FiniteSquareWellsIcon( {
      numberOfWells: 1,
      wellWidth: 12,
      wellDepth: 12,
      edgeLength: 8,
      lineWidth: 2
    } );
  }
}
