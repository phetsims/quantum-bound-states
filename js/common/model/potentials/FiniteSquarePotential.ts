// Copyright 2026, University of Colorado Boulder

/**
 * FiniteSquarePotential is a quantum potential composed of 1 finite square well.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Node from '../../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import FiniteSquareWellsIcon from '../../view/FiniteSquareWellsIcon.js'; // eslint-disable-line phet/no-view-imported-from-model
import Potential from './Potential.js';

export default class FiniteSquarePotential extends Potential {

  //TODO Temporary constants, same as initial state of Java version.
  // Some of these should be Properties or ES5 setters.
  private readonly numberOfWells = 1;
  private readonly wellWidth = 1; //TODO Java: [0.1,6] nm and named 'width'
  private readonly wellDepth = 10; //TODO Java: [0,20] eV and named 'height'
  private readonly offset = 0; //TODO Java [-5,15] eV, bottom of well. Varies by well type - some put the offset at the top of the well, others at the bottom.
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
   * Gets the potential energy (y-value) at a specified x-coordinate, in nm.
   */
  public override getPotentialEnergyAt( x: number ): number {

    const n = this.numberOfWells;
    const w = this.wellWidth;
    const offset = this.offset;
    const centerX = this.centerX;
    const s = w + this.separation; // spacing between well centers

    let pe = offset + this.wellDepth;

    // From BSSquarePotential.java
    for ( let i = 1; i <= n; i++ ) {
      const xi = s * ( i - ( ( n + 1 ) / 2 ) );
      if ( ( ( x - centerX ) >= xi - ( w / 2 ) ) && ( ( x - centerX ) <= xi + ( w / 2 ) ) ) {
        pe = offset;
        break;
      }
    }

    // Apply electric field.
    pe += ( this.electricField * x );

    return pe;
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

quantumBoundStates.register( 'FiniteSquarePotential', FiniteSquarePotential );