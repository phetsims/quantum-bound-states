// Copyright 2026, University of Colorado Boulder

/**
 * NumerovIntegrator integrates the Schrödinger equation using the Numerov method.
 * Uses the higher-order Numerov formula with O(h^6) error.
 *
 * The Numerov formula is:
 * ψ_(j+1) = [(2 - 10f_j)ψ_j - (1+f_(j-1))ψ_(j-1)] / (1+f_(j+1))
 * where f_j = (h²/12) k²(x_j) and k²(x) = 2m(E - V(x))/ℏ²
 *
 * **Forward integration** (increasing grid index j): start from x_min, use the recurrence above to
 * obtain ψ at larger x. **Backward integration** (decreasing j): start from x_max, use the
 * algebraically equivalent recurrence solved for ψ_(j-1) so ψ is filled toward smaller x.
 *
 * See https://arxiv.org/abs/2203.15262 or similar references for details.
 *
 * @author Martin Veillette
 */

import affirm from '../../../../../perennial-alias/js/browser-and-node/affirm.js';
import NumerovSolver from './NumerovSolver.js';
import XGrid from './XGrid.js';

const RESCALE_TRIGGER = 1e100;
const RESCALE_TARGET = 1e50;
const MAX_FORBIDDEN_SEED_EXPONENT = 50;

export default class NumerovIntegrator {

  private readonly mass: number;

  /**
   * @param mass - Particle mass in electron masses
   */
  public constructor( mass: number ) {
    this.mass = mass;
  }

  /**
   * Integrate the Schrödinger equation using Numerov, sweeping **forward in x** (left → right):
   * grid indices j = 0,1,…,N-1 correspond to increasing x, and ψ is stepped from x_min toward x_max.
   *
   * @param E - Energy eigenvalue to test (eV)
   * @param V - Potential energy array (eV) corresponding to xGrid points
   * @param xGrid - grid of x-coordinates with uniform spacing (nm)
   * @returns Wave function array
   */
  public integrate( E: number, V: number[], xGrid: XGrid ): number[] {
    const N = xGrid.numberOfPoints;
    const dx = xGrid.dx;

    // Validate that V array matches grid length
    affirm( V.length === N, `V.length (${V.length}) must equal grid.getLength() (${N})` );

    // Initialize the wave function array
    const psi = new Array( N ).fill( 0 );

    // Calculate k²(x) and Numerov factors
    const k2 = this.calculateK2( E, V );
    const f = this.calculateNumerovFactors( k2, dx );

    // ψ = 0 at x_min; seed ψ₁, then Numerov sweep with increasing index (x_min → x_max).
    this.setBoundaryConditions( psi, k2, dx, N, 'left' );
    this.integrateForwardOnGrid( psi, f );

    return psi;
  }

  /**
   * Set ψ = 0 at one domain end and seed the first interior point from that end.
   * Uses domain size L = N·dx only for scale (not assuming symmetry or a match location).
   *
   * @param psi - Wave function array (modified in place)
   * @param k2 - Array of k² values
   * @param dx - Grid spacing
   * @param N - Number of grid points
   * @param end - 'left': ψ₀=0, seed ψ₁; 'right': ψ_{N-1}=0, seed ψ_{N-2}
   */
  private setBoundaryConditions(
    psi: number[],
    k2: number[],
    dx: number,
    N: number,
    end: 'left' | 'right'
  ): void {
    const L = N * dx;
    const psiScale = 1 / ( N * Math.sqrt( L ) );

    if ( end === 'left' ) {
      psi[ 0 ] = 0;
      const i = 1;
      if ( k2[ i ] >= 0 ) {
        psi[ i ] = psiScale * Math.sin( Math.sqrt( k2[ i ] ) * dx );
      }
      else {
        // Clamp the exponent so steep repulsive walls like Morse do not underflow the seed to zero.
        const kappa = Math.sqrt( Math.abs( k2[ i ] ) );
        psi[ i ] = psiScale * Math.exp( -Math.min( kappa * dx, MAX_FORBIDDEN_SEED_EXPONENT ) );
      }
    }
    else {
      psi[ N - 1 ] = 0;
      const i = N - 2;
      if ( k2[ i ] >= 0 ) {
        psi[ i ] = psiScale * Math.sin( Math.sqrt( k2[ i ] ) * dx );
      }
      else {
        const kappa = Math.sqrt( Math.abs( k2[ i ] ) );
        psi[ i ] = psiScale * Math.exp( -Math.min( kappa * dx, MAX_FORBIDDEN_SEED_EXPONENT ) );
      }
    }
  }

  /**
   * Integrate using Numerov, sweeping **backward in x** (right → left): grid indices decrease
   * from the high-x end, equivalent to the forward recurrence solved for ψ_(j-1):
   * ψ_(j-1) = [(2 - 10f_j)ψ_j - (1 + f_(j+1))ψ_(j+1)] / (1 + f_(j-1)).
   *
   * Boundary: ψ(x_max) = 0 with ψ(x_{N-2}) seeded like the forward case at the opposite end.
   * Used in the matching method to limit blow-up in the right-side classically forbidden region.
   *
   * @param E - Energy eigenvalue to test (eV)
   * @param V - Potential energy array (eV)
   * @param xGrid - grid of x-coordinates with uniform spacing (nm)
   * @returns ψ at all grid points in left-to-right order (filled from x_max inward)
   */
  public integrateBackward( E: number, V: number[], xGrid: XGrid ): number[] {
    const N = xGrid.numberOfPoints;
    const dx = xGrid.dx;

    affirm( V.length === N, `V.length (${V.length}) must equal grid.getLength() (${N})` );

    const psi = new Array( N ).fill( 0 );
    const k2 = this.calculateK2( E, V );
    const f = this.calculateNumerovFactors( k2, dx );

    // ψ = 0 at x_max; seed ψ_{N-2}, then Numerov sweep with decreasing index (x_max → x_min).
    this.setBoundaryConditions( psi, k2, dx, N, 'right' );
    this.integrateBackwardOnGrid( psi, f );

    return psi;
  }

  /**
   * One Numerov step **backward** along the grid (decreasing j): ψ_(j-1) from ψ_j and ψ_(j+1).
   * ψ_(j-1) = [(2 - 10f_j)ψ_j - (1 + f_(j+1))ψ_(j+1)] / (1 + f_(j-1))
   */
  private numerovStepBackward(
    psi_j: number,
    psi_jPlus1: number,
    f_jMinus1: number,
    f_j: number,
    f_jPlus1: number
  ): number {
    return ( ( 2 - 10 * f_j ) * psi_j - ( 1 + f_jPlus1 ) * psi_jPlus1 ) / ( 1 + f_jMinus1 );
  }

  /**
   * Apply the Numerov recurrence **forward in x**: for j = 1,…,N-2 compute ψ_(j+1) from ψ_j and ψ_(j-1).
   * Requires left-end boundary already set (ψ₀, ψ₁) via setBoundaryConditions(…, 'left').
   */
  private integrateForwardOnGrid( psi: number[], f: number[] ): void {
    const N = psi.length;

    for ( let j = 1; j < N - 1; j++ ) {
      psi[ j + 1 ] = this.numerovStepForward( psi[ j ], psi[ j - 1 ], f[ j ], f[ j - 1 ], f[ j + 1 ] );

      if ( Math.abs( psi[ j + 1 ] ) > RESCALE_TRIGGER ) {
        this.rescaleWaveFunction( psi, 0, j + 1, RESCALE_TARGET / Math.abs( psi[ j + 1 ] ) );
      }
    }
  }

  /**
   * Apply the Numerov recurrence **backward in x**: for j = N-2,…,1 compute ψ_(j-1) from ψ_j and ψ_(j+1).
   * Requires right-end boundary already set (ψ_{N-1}, ψ_{N-2}) via setBoundaryConditions(…, 'right').
   */
  private integrateBackwardOnGrid( psi: number[], f: number[] ): void {
    const N = psi.length;

    for ( let j = N - 2; j > 0; j-- ) {
      psi[ j - 1 ] = this.numerovStepBackward( psi[ j ], psi[ j + 1 ], f[ j - 1 ], f[ j ], f[ j + 1 ] );

      if ( Math.abs( psi[ j - 1 ] ) > RESCALE_TRIGGER ) {
        this.rescaleWaveFunction( psi, j - 1, N - 1, RESCALE_TARGET / Math.abs( psi[ j - 1 ] ) );
      }
    }
  }

  /**
   * Calculate k²(x) = 2m(E - V(x))/ℏ² for all grid points.
   *
   * @param E - Energy eigenvalue (eV)
   * @param V - Potential energy array (eV)
   * @returns Array of k² values
   */
  private calculateK2( E: number, V: number[] ): number[] {
    return V.map( v => ( 2 * this.mass * ( E - v ) ) / ( NumerovSolver.HBAR * NumerovSolver.HBAR ) );
  }

  /**
   * Calculate Numerov factors f_j = (h²/12) * k²(x_j) for all grid points.
   *
   * @param k2 - Array of k² values
   * @param dx - Grid spacing (meters)
   * @returns Array of Numerov factors
   */
  private calculateNumerovFactors( k2: number[], dx: number ): number[] {
    const factor = ( dx * dx ) / 12;
    return k2.map( k => factor * k );
  }

  /**
   * One Numerov step **forward** along the grid (increasing j).
   * ψ_(j+1) = [(2 - 10f_j)ψ_j - (1+f_(j-1))ψ_(j-1)] / (1+f_(j+1))
   *
   * @param psi_j - Wave function at current point
   * @param psi_jMinus1 - Wave function at previous point
   * @param f_j - Numerov factor at current point
   * @param f_jMinus1 - Numerov factor at previous point
   * @param f_jPlus1 - Numerov factor at next point
   * @returns Wave function at next point (larger index / larger x)
   */
  private numerovStepForward(
    psi_j: number,
    psi_jMinus1: number,
    f_j: number,
    f_jMinus1: number,
    f_jPlus1: number
  ): number {
    const numerator = ( 2 - 10 * f_j ) * psi_j - ( 1 + f_jMinus1 ) * psi_jMinus1;
    const denominator = 1 + f_jPlus1;
    return numerator / denominator;
  }

  /**
   * Rescale part of the wave function in place.
   * Multiplying a left or right integration by a positive constant preserves Wronskian sign and
   * stitched wave-function shape, while preventing intermediate overflow.
   */
  private rescaleWaveFunction( psi: number[], startIndex: number, endIndex: number, scale: number ): void {
    for ( let k = startIndex; k <= endIndex; k++ ) {
      psi[ k ] *= scale;
    }
  }
}
