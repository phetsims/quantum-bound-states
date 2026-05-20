// Copyright 2026, University of Colorado Boulder

/**
 * Analytical solution for a single-well Asymmetric Triangle potential.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import affirm from '../../../../../../perennial-alias/js/browser-and-node/affirm.js';
import { BoundStateResult } from '../BoundStateResult.js';
import { PotentialFunction } from '../PotentialFunction.js';
import XGrid from '../XGrid.js';

// Parameters for createPotentialFunction method
type PotentialParameters = {
  numberOfWells: number;
  xOffset: number; // Horizontal position x₀ of the singularity in nm
  yOffset: number; // Constant energy shift y₀ in eV
  wellWidth: number; // Width of the well L in nm
  wellDepth: number; // Depth of the well V₀ in eV
  electricField: number; // Electric field in V/nm
};

// Parameters for solve method
type SolveParameters = {
  energyMin: number; // Minimum energy to search (eV)
  energyMax: number; // Maximum energy to search (eV)
  electronMasses: number; // Particle mass in electron masses
} & PotentialParameters;

export default class AsymmetricTriangleSolution {

  private constructor() {
    // Not intended for instantiation.
  }

  /**
   * Creates the potential function for a single-well Asymmetric Triangle potential.
   */
  public static createPotentialFunction( parameters: PotentialParameters ): PotentialFunction {

    const { numberOfWells, electricField } = parameters;
    affirm( numberOfWells === 1, 'AsymmetricTriangleSolution does not support multiple wells' );
    affirm( electricField === 0, 'AsymmetricTriangleSolution does not support electric field' );

    return ( x: number ) => {
      //TODO https://github.com/phetsims/quantum-bound-states/issues/43 Implement
      return 0;
    };
  }

  /**
   * Analytical solution for a single-well Asymmetric Triangle potential.
   */
  public static solve( xGrid: XGrid, parameters: SolveParameters ): BoundStateResult {

    const { numberOfWells, wellWidth, wellDepth, xOffset, yOffset, electricField } = parameters;
    affirm( numberOfWells === 1, 'AsymmetricTriangleSolution does not support multiple wells' );
    affirm( electricField === 0, 'AsymmetricTriangleSolution does not support electric field' );

    //TODO https://github.com/phetsims/quantum-bound-states/issues/43 Implement
    const energies: number[] = [];
    const waveFunctions: number[][] = [];

    const potentialFunction = AsymmetricTriangleSolution.createPotentialFunction( {
      numberOfWells: numberOfWells,
      xOffset: xOffset,
      yOffset: yOffset,
      wellWidth: wellWidth,
      wellDepth: wellDepth,
      electricField: electricField
    } );
    const potentials = xGrid.xCoordinates.map( x => potentialFunction( x ) );

    return {
      potentials: potentials,
      energies: energies,
      waveFunctions: waveFunctions,
      method: 'analytical'
    };
  }
}