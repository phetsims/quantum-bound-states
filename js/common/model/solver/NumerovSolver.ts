// Copyright 2026, University of Colorado Boulder

/**
 * NumerovSolver orchestrates the solution of the 1D Time-Independent Schrödinger Equation (TISE)
 * on a finite, uniformly spaced grid. It coordinates Numerov integration, node-count bracketing,
 * eigenvalue refinement, wave-function stitching, and normalization.
 *
 * Architecture:
 * - NumerovIntegrator: Handles forward and backward integration
 * - EnergyRefiner: Refines energy eigenvalues using Illinois false-position
 * - WaveFunctionNormalizer: Normalizes wave functions
 *
 * The TISE is: -ℏ²/(2m) d²ψ/dx² + V(x)ψ = Eψ
 *
 * Eigenvalues are localized by **node counting** (Sturm-Liouville oscillation theorem): the
 * forward solution ψ_L for a trial energy E has exactly k interior nodes when E_k < E < E_{k+1}
 * for the finite-grid Dirichlet problem. Bisecting on this integer node count isolates each state
 * by index, so closely spaced multi-well levels do not depend on fixed energy sampling.
 *
 * The bracket is then refined to the eigenvalue using a mismatch at the centre grid point m.
 * For **non-symmetric** potentials this is the log-derivative mismatch
 * (ψ_L'/ψ_L)|_m - (ψ_R'/ψ_R)|_m, multiplied through by ψ_L·ψ_R so it remains bounded when ψ
 * has a node at m. Each side is rescaled to its peak amplitude before forming the mismatch so the
 * magnitude is O(1) even when a trial solution grows exponentially in classically forbidden
 * regions.
 *
 * For **symmetric** potentials (V(-x) = V(x)) the Sturm-Liouville theorem guarantees that
 * eigenfunctions alternate between even (ψ(-x) = ψ(x)) and odd (ψ(-x) = -ψ(x)) with increasing
 * index n. This solver exploits that structure in two ways:
 *   1. **Mismatch** — only the forward sweep ψ_L is needed:
 *        Even states (n = 0, 2, 4, …): ψ'(0) = 0  →  slope mismatch at centre.
 *        Odd  states (n = 1, 3, 5, …): ψ(0)  = 0  →  value mismatch at centre.
 *   2. **Wave function** — ψ on [0, x_max] is the mirror image of ψ_L, giving exact symmetry in
 *        the output and halving the integration work.
 *
 * @author Martin Veillette
 */

import QBSConstants from '../../QBSConstants.js';
import { BoundStateResult } from './BoundStateResult.js';
import EnergyRefiner from './EnergyRefiner.js';
import NumerovIntegrator from './NumerovIntegrator.js';
import { PotentialFunction } from './PotentialFunction.js';
import WaveFunctionNormalizer, { NormalizationMethod } from './WaveFunctionNormalizer.js';
import XGrid from './XGrid.js';

/**
 * Configuration options for the solver.
 */
export type NumerovSolverOptions = {

  // Optional absolute tolerance for energy refinement (eV). If omitted, EnergyRefiner uses its default relative tolerance.
  energyTolerance?: number;

  // Method for normalization (default: 'trapezoidal')
  normalizationMethod?: NormalizationMethod;
};

/**
 * Result of solving for a single eigenstate by index.
 */
export type EigenstateResult = {
  energy: number;
  waveFunction: number[];
};

export default class NumerovSolver {

  // Reduced Planck constant (hbar) in natural units: √(eV⋅mₑ)⋅nm
  // Computed as: 1.054571817e-34 / (1e-9 * sqrt(9.1093837015e-31 * 1.602176634e-19))
  public static readonly HBAR = 0.2760428268035944;

  // Positive barriers above this are effectively infinite for the energy ranges in this sim.
  // Keeping them finite avoids overflow in Numerov factors for steep potentials such as Morse.
  private static readonly MAX_SOLVER_POTENTIAL_ENERGY = QBSConstants.EFFECTIVELY_INFINITE_POTENTIAL_ENERGY; // in eV

  // Relative threshold for detecting a node of psi at the matching point.
  // If |psi[m]| / max(|psi[m-1]|, |psi[m+1]|) is below this value, psi is treated as having a node
  // at m. A relative threshold is essential: the absolute amplitude of psi varies with the seed
  // value, so an absolute tolerance would misclassify the node when the seed changes.
  private static readonly RELATIVE_NODE_TOLERANCE = 1e-1;

  // Relative threshold for choosing non-zero reference values near a node. This is much smaller
  // than RELATIVE_NODE_TOLERANCE because it is used only to avoid division by numerical zero.
  private static readonly SCALE_REFERENCE_TOLERANCE = 1e-12;

  // Maximum bisection iterations when bracketing an eigenvalue by node count.
  // 60 halvings shrink any bracket by ~10^18, far below floating-point relative resolution.
  private static readonly MAX_NODE_BISECTION_ITERATIONS = 200;

  // Stop node-count bisection when the bracket is this small relative to the initial energy
  // window and the upper endpoint has crossed only the requested state. The EnergyRefiner then
  // uses the continuous log-derivative mismatch within that bracket.
  private static readonly NODE_BRACKET_RELATIVE_TOLERANCE = 1e-5;

  // Relative tolerance for identifying a symmetric potential: V is symmetric when
  // |V[m-i] - V[m+i]| ≤ SYMMETRY_RELATIVE_TOLERANCE × max|V| for all i.
  private static readonly SYMMETRY_RELATIVE_TOLERANCE = 1e-10;

  /**
   * Main entry point for solving with default NumerovSolverOptions.
   *
   * @param xGrid - uniformly spaced x-coordinates in nm
   * @param potentialFunction - Function V(x) that returns potential energy in eV
   * @param mass - Particle mass in electron masses
   * @param energyMin - Minimum energy to search (eV)
   * @param energyMax - Maximum energy to search (eV)
   * @param options - Optional solver configuration
   * @returns Bound state results on xGrid
   */
  public static solve(
    xGrid: XGrid,
    potentialFunction: PotentialFunction,
    mass: number,
    energyMin: number,
    energyMax: number,
    options?: NumerovSolverOptions
  ): BoundStateResult {
    const solver = new NumerovSolver( mass, options );
    return solver.getBoundStateResult( potentialFunction, xGrid, energyMin, energyMax );
  }

  /**
   * Solve for a single eigenstate by index (0 = ground state for the finite-grid problem).
   * Uses node-count bisection to bracket E_n, then refines via the log-derivative mismatch.
   * Returns null when state n does not exist within [energyMin, energyMax].
   *
   * @param xGrid - uniformly spaced x-coordinates in nm
   * @param potential - Function V(x) that returns potential energy in eV
   * @param mass - Particle mass in electron masses
   * @param stateIndex - Zero-based eigenstate index (0 = ground state)
   * @param energyMin - Minimum energy to search (eV)
   * @param energyMax - Maximum energy to search (eV)
   * @param options - Optional solver configuration
   */
  public static getEigenstate(
    xGrid: XGrid,
    potential: PotentialFunction,
    mass: number,
    stateIndex: number,
    energyMin: number,
    energyMax: number,
    options?: NumerovSolverOptions
  ): EigenstateResult | null {
    const solver = new NumerovSolver( mass, options );
    return solver.getEigenstate( potential, xGrid, stateIndex, energyMin, energyMax );
  }

  private readonly integrator: NumerovIntegrator;
  private readonly energyRefiner: EnergyRefiner;
  private readonly normalizer: WaveFunctionNormalizer;

  /**
   * @param mass - Particle mass in electron masses
   * @param options - Optional solver configuration
   */
  public constructor( mass: number, options?: NumerovSolverOptions ) {
    this.integrator = new NumerovIntegrator( mass );

    // If energyTolerance is provided, it's absolute (in eV); otherwise use default relative tolerance
    const energyRefinerOptions = options?.energyTolerance !== undefined ?
      { tolerance: options.energyTolerance, isRelative: false } : {};

    this.energyRefiner = new EnergyRefiner( energyRefinerOptions );

    this.normalizer = new WaveFunctionNormalizer(
      options?.normalizationMethod ?? 'trapezoidal'
    );
  }

  /**
   * Solves the 1D Schrödinger equation using the Numerov method.
   * Returns all states detected by node count within the finite-grid energy bounds.
   *
   * @param potential - Function V(x) that returns potential energy in eV
   * @param xGrid - uniformly spaced x-coordinates in nm
   * @param energyMin - Minimum energy to search (eV)
   * @param energyMax - Maximum energy to search (eV)
   * @returns Bound state results containing energies, wave functions, and grid
   */
  public getBoundStateResult(
    potentialFunction: PotentialFunction,
    xGrid: XGrid,
    energyMin: number,
    energyMax: number
  ): BoundStateResult {

    const V = this.evaluatePotential( potentialFunction, xGrid.xCoordinates );
    const { energies, waveFunctions } = this.findBoundStates( V, xGrid, energyMin, energyMax );

    return {
      potentials: V,
      energies: energies,
      waveFunctions: waveFunctions,
      method: 'numerov'
    };
  }

  /**
   * Solve for a single eigenstate by index. See the static overload for parameter documentation.
   * Returns null when state stateIndex is not detected in [energyMin, energyMax].
   */
  public getEigenstate(
    potential: PotentialFunction,
    xGrid: XGrid,
    stateIndex: number,
    energyMin: number,
    energyMax: number
  ): EigenstateResult | null {

    const V = this.evaluatePotential( potential, xGrid.xCoordinates );
    const meetingIndex = this.getMeetingPointIndex( xGrid );
    const isSymmetric = this.isPotentialSymmetric( V, meetingIndex );

    const bracket = this.bracketEigenvalueByNodeCount( stateIndex, V, xGrid, energyMin, energyMax );
    if ( bracket === null ) {
      return null;
    }

    let energy: number;
    let waveFunction: number[];

    if ( isSymmetric ) {
      const parity: 'even' | 'odd' = stateIndex % 2 === 0 ? 'even' : 'odd';
      const mismatch = this.makeSymmetricMismatch( V, xGrid, meetingIndex, parity );
      energy = this.energyRefiner.refine( bracket.lowerEnergy, bracket.upperEnergy, mismatch );
      waveFunction = this.computeSymmetricWaveFunction( energy, V, xGrid, meetingIndex, parity );
    }
    else {
      const mismatch = this.makeLogDerivativeMismatch( V, xGrid, meetingIndex );
      energy = this.energyRefiner.refine( bracket.lowerEnergy, bracket.upperEnergy, mismatch );
      waveFunction = this.computeWaveFunction( energy, V, xGrid, meetingIndex );
    }

    return { energy: energy, waveFunction: waveFunction };
  }

  /**
   * Finds bound states using node-count bracketing followed by eigenvalue refinement.
   *
   *   1. Count interior nodes of ψ_L at energyMin and energyMax. By Sturm–Liouville, this gives
   *      the inclusive index of the lowest state and the exclusive index of the highest state in
   *      the energy window.
   *   2. For each state index in that range, bisect on the integer node count to isolate E_n.
   *   3. Refine the bracket to the eigenvalue:
   *      - Symmetric potential: parity-specific centre-BC mismatch (forward integration only).
   *      - General potential: log-derivative mismatch at the middle grid point.
   *   4. Build the normalised wave function:
   *      - Symmetric potential: reflect the left half.
   *      - General potential: stitch ψ_L and ψ_R at the middle grid point.
   */
  private findBoundStates(
    V: number[],
    xGrid: XGrid,
    energyMin: number,
    energyMax: number
  ): { energies: number[]; waveFunctions: number[][] } {

    const meetingIndex = this.getMeetingPointIndex( xGrid );
    const isSymmetric = this.isPotentialSymmetric( V, meetingIndex );

    // For non-symmetric potentials, build the log-derivative mismatch once and reuse it.
    const sharedMismatch = isSymmetric ? null : this.makeLogDerivativeMismatch( V, xGrid, meetingIndex );

    // States E_n with n in [lowestStateIndex, highestStateIndexExclusive) lie in the requested energy window.
    const lowestStateIndex = this.countNodesAtEnergy( energyMin, V, xGrid );
    const highestStateIndexExclusive = this.countNodesAtEnergy( energyMax, V, xGrid );

    const energies: number[] = [];
    const waveFunctions: number[][] = [];

    for ( let n = lowestStateIndex; n < highestStateIndexExclusive; n++ ) {
      const bracket = this.bracketEigenvalueByNodeCount( n, V, xGrid, energyMin, energyMax );
      if ( bracket === null ) { continue; }

      if ( isSymmetric ) {

        // Even-indexed states are spatially even; odd-indexed states are spatially odd.
        const parity: 'even' | 'odd' = n % 2 === 0 ? 'even' : 'odd';
        const mismatch = this.makeSymmetricMismatch( V, xGrid, meetingIndex, parity );
        const energy = this.energyRefiner.refine( bracket.lowerEnergy, bracket.upperEnergy, mismatch );
        energies.push( energy );
        waveFunctions.push( this.computeSymmetricWaveFunction( energy, V, xGrid, meetingIndex, parity ) );
      }
      else {
        const energy = this.energyRefiner.refine( bracket.lowerEnergy, bracket.upperEnergy, sharedMismatch! );
        energies.push( energy );
        waveFunctions.push( this.computeWaveFunction( energy, V, xGrid, meetingIndex ) );
      }
    }

    return { energies: energies, waveFunctions: waveFunctions };
  }

  /**
   * Number of interior nodes of ψ_L for trial energy E. By the Sturm-Liouville oscillation
   * theorem, this is also the index of the highest eigenstate strictly below E.
   */
  private countNodesAtEnergy( energy: number, V: number[], xGrid: XGrid ): number {
    const psiL = this.integrator.integrate( energy, V, xGrid );
    return this.countNodes( psiL );
  }

  /**
   * Bracket E_{stateIndex} by bisecting on the integer node count of ψ_L.
   *
   * Invariants maintained throughout: countNodesAtEnergy(lowerEnergy) ≤ stateIndex and
   * countNodesAtEnergy(upperEnergy) > stateIndex. The bracket therefore strictly contains E_n.
   *
   * Returns null when state stateIndex lies outside [energyMin, energyMax].
   */
  private bracketEigenvalueByNodeCount(
    stateIndex: number,
    V: number[],
    xGrid: XGrid,
    energyMin: number,
    energyMax: number
  ): { lowerEnergy: number; upperEnergy: number } | null {

    let lowerEnergy = energyMin;
    let upperEnergy = energyMax;

    if ( this.countNodesAtEnergy( lowerEnergy, V, xGrid ) > stateIndex ) { return null; }
    if ( this.countNodesAtEnergy( upperEnergy, V, xGrid ) <= stateIndex ) { return null; }

    const bracketTolerance = NumerovSolver.NODE_BRACKET_RELATIVE_TOLERANCE * ( upperEnergy - lowerEnergy );

    for ( let i = 0; i < NumerovSolver.MAX_NODE_BISECTION_ITERATIONS; i++ ) {
      if ( upperEnergy - lowerEnergy <= bracketTolerance &&
           this.countNodesAtEnergy( upperEnergy, V, xGrid ) === stateIndex + 1 ) {
        break;
      }

      const midEnergy = 0.5 * ( lowerEnergy + upperEnergy );
      if ( this.countNodesAtEnergy( midEnergy, V, xGrid ) > stateIndex ) {
        upperEnergy = midEnergy;
      }
      else {
        lowerEnergy = midEnergy;
      }
    }

    return { lowerEnergy: lowerEnergy, upperEnergy: upperEnergy };
  }

  /**
   * Returns true when the discrete potential V is symmetric about the grid point at centerIndex,
   * i.e. V[centerIndex - i] ≈ V[centerIndex + i] for every valid offset i. The check uses a
   * tolerance relative to max|V| so it is scale-independent.
   */
  private isPotentialSymmetric( V: number[], centerIndex: number ): boolean {
    const N = V.length;
    const vMax = V.reduce( ( max, v ) => Math.max( max, Math.abs( v ) ), 0 ) || 1;
    const tolerance = NumerovSolver.SYMMETRY_RELATIVE_TOLERANCE * vMax;

    for ( let i = 1; centerIndex - i >= 0 && centerIndex + i < N; i++ ) {
      if ( Math.abs( V[ centerIndex - i ] - V[ centerIndex + i ] ) > tolerance ) {
        return false;
      }
    }
    return true;
  }

  /**
   * Build a mismatch function for symmetric potentials. By the Sturm-Liouville theorem,
   * eigenfunctions alternate parity: even-indexed states are spatially even (ψ(-x) = ψ(x)) and
   * odd-indexed states are spatially odd (ψ(-x) = -ψ(x)). The boundary condition at the centre
   * therefore differs by parity:
   *
   *   Even states: ψ'(0) = 0  →  f(E) = [ψ_L[m+1] - ψ_L[m-1]] / (2·dx·peak)
   *   Odd  states: ψ(0)  = 0  →  f(E) = ψ_L[m] / peak
   *
   * Only the forward integration ψ_L is required — no backward sweep.
   */
  private makeSymmetricMismatch(
    V: number[],
    xGrid: XGrid,
    centerIndex: number,
    parity: 'even' | 'odd'
  ): ( E: number ) => number {

    return ( E: number ): number => {
      const psiL = this.integrator.integrate( E, V, xGrid );
      const peak = psiL.reduce( ( max, v ) => Math.max( max, Math.abs( v ) ), 0 ) || 1;

      if ( parity === 'odd' ) {

        // Odd eigenfunction: ψ(0) must be zero.
        return psiL[ centerIndex ] / peak;
      }
      else {

        // Even eigenfunction: ψ'(0) must be zero. Centred finite difference to O(dx²).
        return ( psiL[ centerIndex + 1 ] - psiL[ centerIndex - 1 ] ) / ( 2 * xGrid.dx * peak );
      }
    };
  }

  /**
   * Construct the wave function for a symmetric potential by integrating from the left boundary
   * to the centre only, then reflecting to fill the right half:
   *
   *   Even states: ψ[centerIndex + k]  =  ψ[centerIndex - k]
   *   Odd  states: ψ[centerIndex + k]  = -ψ[centerIndex - k],  ψ[centerIndex] = 0 exactly
   *
   * This guarantees exact spatial symmetry in the output and avoids the backward integration.
   */
  private computeSymmetricWaveFunction(
    energy: number,
    V: number[],
    xGrid: XGrid,
    centerIndex: number,
    parity: 'even' | 'odd'
  ): number[] {
    const N = V.length;
    const psiL = this.integrator.integrate( energy, V, xGrid );
    const psi = new Array<number>( N );

    // Copy left half (including centre).
    for ( let i = 0; i <= centerIndex; i++ ) {
      psi[ i ] = psiL[ i ];
    }

    // Enforce exact zero at centre for odd states.
    if ( parity === 'odd' ) {
      psi[ centerIndex ] = 0;
    }

    // Reflect to fill the right half. Sign is +1 for even, -1 for odd.
    const sign = parity === 'even' ? 1 : -1;
    for ( let i = centerIndex + 1; i < N; i++ ) {
      const mirrorIndex = 2 * centerIndex - i;

      // mirrorIndex can be negative for even-N grids at the far boundary (where ψ = 0 anyway).
      psi[ i ] = mirrorIndex >= 0 ? sign * psiL[ mirrorIndex ] : 0;
    }

    return this.normalizer.normalize( psi, xGrid.dx );
  }

  /**
   * Build a mismatch function for use by the EnergyRefiner. At an eigenvalue, ψ_L and ψ_R have a
   * common log-derivative at the midpoint: (ψ_L'/ψ_L)|_m = (ψ_R'/ψ_R)|_m. The returned
   * function is
   *
   *     f(E) = (slopeLeft·valueRight - slopeRight·valueLeft)
   *
   * which is the log-derivative difference multiplied through by ψ_L(m)·ψ_R(m) — equivalent at
   * roots, but bounded when ψ has a node at the midpoint (avoiding 1/0). Each side is
   * rescaled by its peak amplitude beforehand so the mismatch has O(1) magnitude regardless of
   * the exponential scaling that arises when integrating across classically forbidden regions.
   * Centered finite differences give the slope to O(dx²) accuracy.
   */
  private makeLogDerivativeMismatch(
    V: number[],
    xGrid: XGrid,
    meetingIndex: number
  ): ( E: number ) => number {

    return ( E: number ): number => {
      const psiLeft = this.integrator.integrate( E, V, xGrid );
      const psiRight = this.integrator.integrateBackward( E, V, xGrid );

      const peakLeft = psiLeft.reduce( ( max, v ) => Math.max( max, Math.abs( v ) ), 0 ) || 1;
      const peakRight = psiRight.reduce( ( max, v ) => Math.max( max, Math.abs( v ) ), 0 ) || 1;

      const m = meetingIndex;
      const valueLeft = psiLeft[ m ] / peakLeft;
      const valueRight = psiRight[ m ] / peakRight;
      const slopeLeft = ( psiLeft[ m + 1 ] - psiLeft[ m - 1 ] ) / ( 2 * xGrid.dx * peakLeft );
      const slopeRight = ( psiRight[ m + 1 ] - psiRight[ m - 1 ] ) / ( 2 * xGrid.dx * peakRight );

      return slopeLeft * valueRight - slopeRight * valueLeft;
    };
  }

  /**
   * Integrate from both ends, stitch at the midpoint, and normalize.
   */
  private computeWaveFunction(
    energy: number,
    V: number[],
    xGrid: XGrid,
    meetingIndex: number
  ): number[] {
    const psiL = this.integrator.integrate( energy, V, xGrid );
    const psiR = this.integrator.integrateBackward( energy, V, xGrid );
    const stitched = this.stitchWaveFunctions( psiL, psiR, meetingIndex );
    return this.normalizer.normalize( stitched, xGrid.dx );
  }

  /**
   * Count zero crossings of psi in the interior (indices 1 ... N-2).
   *
   * Do not use a global amplitude threshold here. Trial solutions can grow by many orders of
   * magnitude after crossing a forbidden barrier, especially for multiple separated wells. A
   * global threshold would then hide real earlier nodes and collapse several states into the same
   * high-energy bracket.
   */
  private countNodes( psi: number[] ): number {
    let nodes = 0;
    let prevSign = 0;

    for ( let i = 1; i < psi.length - 1; i++ ) {
      const value = psi[ i ];
      if ( value === 0 || !Number.isFinite( value ) ) { continue; }

      const sign = Math.sign( value );
      if ( prevSign !== 0 && sign !== prevSign ) { nodes++; }
      prevSign = sign;
    }

    return nodes;
  }

  /**
   * Grid index m closest to the x-coordinate midpoint (xMin+xMax)/2.
   *
   * Using the geometric midpoint rather than the array midpoint floor((N−1)/2) is essential:
   * due to floating-point rounding in dx = (xMax−xMin)/(N−1), the array midpoint may not
   * land on x=0 for grids with N not a power of 2 or an exact divisor of the range.  For the
   * default sim grid (N=3001, xMin=−3.5, xMax=3.5), the array-midpoint x value is
   * ~4.4×10⁻¹⁶ nm off from zero, which is negligible in practice but inconsistent with the
   * assumption made by the symmetric-potential code that the centre index lies at x=0.
   *
   * For the general (non-symmetric) case the midpoint is still a reasonable meeting point
   * for the log-derivative mismatch, independent of potential shape.
   */
  private getMeetingPointIndex( xGrid: XGrid ): number {
    return xGrid.getClosestIndex( ( xGrid.xMin + xGrid.xMax ) / 2 );
  }

  /**
   * Whether psi has a node at index, relative to its immediate neighbors.
   */
  private hasNodeAtIndex( psi: number[], index: number ): boolean {
    const neighborMax = Math.max( Math.abs( psi[ index - 1 ] ), Math.abs( psi[ index + 1 ] ) );
    return neighborMax === 0 ||
           Math.abs( psi[ index ] ) < NumerovSolver.RELATIVE_NODE_TOLERANCE * neighborMax;
  }

  /**
   * Scale psiR for a stitch point that is itself a node. The value at the node cannot determine
   * the scale, so use the nearest symmetric pair around the node to match the local slope:
   * ψ(m + k) ≈ -ψ(m - k).
   */
  private getNodeMatchScale( psiL: number[], psiR: number[], meetingPointIndex: number ): number {
    const N = psiL.length;
    const psiRMaxAbs = psiR.reduce( ( m, v ) => Math.max( m, Math.abs( v ) ), 0 );
    const psiLMaxAbs = psiL.reduce( ( m, v ) => Math.max( m, Math.abs( v ) ), 0 );
    const threshR = NumerovSolver.SCALE_REFERENCE_TOLERANCE * psiRMaxAbs;
    const threshL = NumerovSolver.SCALE_REFERENCE_TOLERANCE * psiLMaxAbs;

    for ( let offset = 1; meetingPointIndex - offset >= 0 && meetingPointIndex + offset < N; offset++ ) {
      const leftValue = psiL[ meetingPointIndex - offset ];
      const rightValue = psiR[ meetingPointIndex + offset ];
      if ( Math.abs( leftValue ) > threshL && Math.abs( rightValue ) > threshR ) {
        return -leftValue / rightValue;
      }
    }

    // Fall back to sign matching if no stable derivative reference was found.
    for ( let refIdx = meetingPointIndex - 1; refIdx > 0; refIdx-- ) {
      const leftValue = psiL[ refIdx ];
      const rightValue = psiR[ refIdx ];
      if ( Math.abs( leftValue ) > threshL && Math.abs( rightValue ) > threshR ) {
        return Math.sign( leftValue ) !== Math.sign( rightValue ) ? -1 : 1;
      }
    }

    return 1;
  }

  /**
   * Concatenate the left and right solutions at meetingPointIndex.
   * psiR is scaled so that ψ_R at the meeting point equals ψ_L there, ensuring continuity.
   *
   * Because psiL and psiR are integrated from opposite ends with independent
   * initial conditions, they may have opposite signs at the meeting point.
   * The scale factor (which may be negative) effectively flips the sign of psiR
   * when necessary, so the stitched wave function is continuous.
   */
  private stitchWaveFunctions( psiL: number[], psiR: number[], meetingPointIndex: number ): number[] {
    const N = psiL.length;
    const stitched = new Array<number>( N );

    for ( let i = 0; i <= meetingPointIndex; i++ ) {
      stitched[ i ] = psiL[ i ];
    }

    const psiLHasNodeAtMatch = this.hasNodeAtIndex( psiL, meetingPointIndex );
    const psiRHasNodeAtMatch = this.hasNodeAtIndex( psiR, meetingPointIndex );
    const psiRatMatch = psiR[ meetingPointIndex ];

    if ( !psiLHasNodeAtMatch && !psiRHasNodeAtMatch ) {

      // scale may be negative, flipping psiR's sign to match psiL at the junction.
      const scale = psiL[ meetingPointIndex ] / psiRatMatch;
      for ( let i = meetingPointIndex + 1; i < N; i++ ) {
        stitched[ i ] = psiR[ i ] * scale;
      }
    }
    else {

      // The stitch point is a node. Force it to zero and use the local slope to determine the
      // relative scale; otherwise a small numerical midpoint value can normalize into a spike.
      stitched[ meetingPointIndex ] = 0;
      const scale = this.getNodeMatchScale( psiL, psiR, meetingPointIndex );
      for ( let i = meetingPointIndex + 1; i < N; i++ ) {
        stitched[ i ] = psiR[ i ] * scale;
      }
    }

    return stitched;
  }

  /**
   * Evaluates potential on grid.
   * Clamps the potential energy to MAX_SOLVER_POTENTIAL_ENERGY to avoid overflow in steep potentials.
   */
  private evaluatePotential( potentialFunction: PotentialFunction, xGridArray: readonly number[] ): number[] {
    return xGridArray.map( x => {
      const potentialEnergy = potentialFunction( x );
      return Number.isFinite( potentialEnergy ) ?
             Math.min( potentialEnergy, NumerovSolver.MAX_SOLVER_POTENTIAL_ENERGY ) :
             NumerovSolver.MAX_SOLVER_POTENTIAL_ENERGY;
    } );
  }
}
