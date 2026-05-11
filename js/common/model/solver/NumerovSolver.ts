// Copyright 2026, University of Colorado Boulder

/**
 * NumerovSolver orchestrates the solution of the 1D Time-Independent Schrödinger Equation (TISE)
 * using the Numerov method. This is the main solver class that coordinates the integration,
 * energy refinement, and normalization components.
 *
 * Architecture:
 * - NumerovIntegrator: Handles forward and backward integration
 * - EnergyRefiner: Refines energy eigenvalues using Illinois false-position
 * - WaveFunctionNormalizer: Normalizes wave functions
 *
 * The TISE is: -ℏ²/(2m) d²ψ/dx² + V(x)ψ = Eψ
 *
 * Eigenvalues are localized by **node counting** (Sturm–Liouville oscillation theorem): the
 * forward solution ψ_L for a trial energy E has exactly k interior nodes when E_k < E < E_{k+1}.
 * Bisecting on the integer node count produces a guaranteed bracket for state n that is robust to
 * arbitrarily clustered eigenvalues — every requested state is found regardless of scan resolution.
 *
 * The bracket is then refined to the eigenvalue using a **log-derivative mismatch** at the
 * meeting point m: (ψ_L'/ψ_L)|_m − (ψ_R'/ψ_R)|_m, multiplied through by ψ_L·ψ_R so it remains
 * bounded when ψ has a node at m. Each side is rescaled to its peak amplitude before forming the
 * mismatch so the magnitude is O(1) regardless of exponential growth in classically forbidden
 * regions.
 *
 * @author Martin Veillette
 */

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

  // Optional tolerance for energy refinement (eV). If not provided, uses relative tolerance × (bracket width)
  energyTolerance?: number;

  // Method for normalization (default: 'trapezoidal')
  normalizationMethod?: NormalizationMethod;

  // Optional custom scan grid (eV), used as a fallback when node-count bracketing produces no states.
  energyScanPoints?: number[];
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

  // Positive barriers above this are effectively infinite for the energy ranges in this sim, but
  // keeping them finite avoids Numerov overflow in steep potentials such as Morse.
  private static readonly MAX_SOLVER_POTENTIAL_ENERGY = 1000; // in eV

  // Relative threshold for detecting a node of psi at the matching point.
  // If |psi[m]| / max(|psi[m-1]|, |psi[m+1]|) is below this value, psi is treated as having a node
  // at m. A relative threshold is essential: the absolute amplitude of psi varies with the seed
  // value, so an absolute tolerance would misclassify the node when the seed changes.
  private static readonly RELATIVE_NODE_TOLERANCE = 1e-3;

  // Maximum bisection iterations when bracketing an eigenvalue by node count.
  // 60 halvings shrink any bracket by ~10^18, far below floating-point relative resolution.
  private static readonly MAX_NODE_BISECTION_ITERATIONS = 60;

  // Stop node-count bisection when the bracket is this small relative to the initial bracket
  // width. The bracket only needs to be tight enough for the log-derivative mismatch to have a
  // monotone sign change inside it; the EnergyRefiner takes over from there.
  private static readonly NODE_BRACKET_RELATIVE_TOLERANCE = 1e-3;

  /**
   * Main entry point for solving with default NumerovSolverOptions.
   *
   * @param xGrid - uniformly spaced x-coordinates in nm
   * @param potentialFunction - Function V(x) that returns potential energy in eV
   * @param mass - Particle mass in electron masses
   * @param energyMin - Minimum energy to search (eV)
   * @param energyMax - Maximum energy to search (eV)
   * @param options - Optional solver configuration
   * @returns Bound state results
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
    return solver.getBoundStateResult( potentialFunction, xGrid, energyMin, energyMax, options?.energyScanPoints );
  }

  /**
   * Solve for a single eigenstate by index (0 = ground state).
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
   * @param mass - Particle mass in kg
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
   * Finds every bound state within the energy bounds.
   *
   * @param potential - Function V(x) that returns potential energy in eV
   * @param xGrid - uniformly spaced x-coordinates in nm
   * @param energyMin - Minimum energy to search (eV)
   * @param energyMax - Maximum energy to search (eV)
   * @returns Bound state results containing energies, wave functions, and grid
   *
   * @example
   * // Solve harmonic oscillator
   * const mass = 1;  // electron masses
   * const k = 3; // arbitrary spring constant, eV/nm²
   * const potential = ( x: number ) => 0.5 * k * x * x;
   *
   * const solver = new NumerovSolver( mass );
   * const result = solver.getBoundStateResult(
   *   potential,
   *   { xMin: -4, xMax: 4, numPoints: 1001 }, // nm
   *   0,
   *   20
   * );
   *
   * console.log( 'Ground state energy:', result.energies[ 0 ] );
   * console.log( 'First excited energy:', result.energies[ 1 ] );
   */
  public getBoundStateResult(
    potentialFunction: PotentialFunction,
    xGrid: XGrid,
    energyMin: number,
    energyMax: number,
    energyScanPoints?: number[]
  ): BoundStateResult {

    const V = this.evaluatePotential( potentialFunction, xGrid.xCoordinates );

    // Find bound states
    const { energies, waveFunctions } = this.findBoundStates(
      V,
      xGrid,
      energyMin,
      energyMax,
      energyScanPoints
    );

    return {
      potentials: V,
      energies: energies,
      waveFunctions: waveFunctions,
      method: 'numerov'
    };
  }

  /**
   * Solve for a single eigenstate by index. See the static overload for parameter documentation.
   * Returns null when state stateIndex is not in [energyMin, energyMax].
   */
  public getEigenstate(
    potential: PotentialFunction,
    xGrid: XGrid,
    stateIndex: number,
    energyMin: number,
    energyMax: number
  ): EigenstateResult | null {

    const V = this.evaluatePotential( potential, xGrid.xCoordinates );
    const meetingIndex = this.getMeetingPointIndex( V );

    const bracket = this.bracketEigenvalueByNodeCount( stateIndex, V, xGrid, energyMin, energyMax );
    if ( bracket === null ) {
      return null;
    }

    const mismatch = this.makeLogDerivativeMismatch( V, xGrid, meetingIndex );
    const energy = this.energyRefiner.refine( bracket.lowerEnergy, bracket.upperEnergy, mismatch );
    const waveFunction = this.computeWaveFunction( energy, V, xGrid, meetingIndex );

    return { energy: energy, waveFunction: waveFunction };
  }

  /**
   * Finds bound states using node-count bracketing followed by log-derivative refinement.
   *
   *   1. Count interior nodes of ψ_L at energyMin and energyMax. By Sturm–Liouville, this gives
   *      the inclusive index of the lowest state and the exclusive index of the highest state in
   *      the energy window.
   *   2. For each state index in that range, bisect on the integer node count to bracket E_n.
   *   3. Refine the bracket to the eigenvalue using the log-derivative mismatch at the meeting
   *      point.
   *   4. Stitch ψ_L and ψ_R at the meeting point to form the final wave function and normalize.
   *
   * If any expected state could not be bracketed (bracket === null), the mismatch-scan fallback
   * is merged in to recover it rather than silently dropping the state.
   */
  private findBoundStates(
    V: number[],
    xGrid: XGrid,
    energyMin: number,
    energyMax: number,
    energyScanPoints?: number[]
  ): { energies: number[]; waveFunctions: number[][] } {

    const meetingIndex = this.getMeetingPointIndex( V );
    const mismatch = this.makeLogDerivativeMismatch( V, xGrid, meetingIndex );

    // States E_n with n in [lowestStateIndex, highestStateIndexExclusive) lie in (energyMin, energyMax).
    const lowestStateIndex = this.countNodesAtEnergy( energyMin, V, xGrid );
    const highestStateIndexExclusive = this.countNodesAtEnergy( energyMax, V, xGrid );
    const expectedStateCount = highestStateIndexExclusive - lowestStateIndex;

    const energies: number[] = [];
    const waveFunctions: number[][] = [];

    for ( let n = lowestStateIndex; n < highestStateIndexExclusive; n++ ) {
      const bracket = this.bracketEigenvalueByNodeCount( n, V, xGrid, energyMin, energyMax );
      if ( bracket === null ) { continue; }

      const energy = this.energyRefiner.refine( bracket.lowerEnergy, bracket.upperEnergy, mismatch );
      energies.push( energy );
      waveFunctions.push( this.computeWaveFunction( energy, V, xGrid, meetingIndex ) );
    }

    // Return immediately when all expected states were found (and at least one was found).
    // Requiring energies.length > 0 preserves the fallback safety net for the degenerate case
    // where node counting returns 0 at both boundary energies (e.g., when the forbidden-region
    // exponential growth overwhelms the threshold), so the mismatch scan still gets a chance.
    if ( energies.length > 0 && energies.length >= expectedStateCount ) {
      return { energies: energies, waveFunctions: waveFunctions };
    }

    // Some expected states were not bracketed (e.g., two eigenvalues too close for the node-count
    // bisection to separate, or a near-threshold state whose node count is ambiguous at the
    // boundary energies). Run the mismatch-scan fallback and merge any states it recovers.
    const fallback = this.findBoundStatesByMismatchScan(
      V, xGrid, meetingIndex, mismatch, energyMin, energyMax, energyScanPoints
    );
    return this.mergeStateResults( { energies: energies, waveFunctions: waveFunctions }, fallback, energyMax - energyMin );
  }

  /**
   * Merge two sets of bound-state results, discarding duplicate energies from the secondary set.
   * Two states are considered duplicates when their energies agree to within duplicateTolerance.
   * The returned arrays are sorted by ascending energy.
   */
  private mergeStateResults(
    primary: { energies: number[]; waveFunctions: number[][] },
    secondary: { energies: number[]; waveFunctions: number[][] },
    energyRange: number
  ): { energies: number[]; waveFunctions: number[][] } {

    // Tolerance: finer than the bracket tolerance used during bisection so a state bracketed
    // via node-count and independently found by the mismatch scan is always deduplicated.
    const duplicateTolerance = 1e-5 * energyRange;

    const mergedEnergies = [ ...primary.energies ];
    const mergedWaveFunctions = [ ...primary.waveFunctions ];

    for ( let i = 0; i < secondary.energies.length; i++ ) {
      const E = secondary.energies[ i ];
      const isDuplicate = mergedEnergies.some( e => Math.abs( e - E ) < duplicateTolerance );
      if ( !isDuplicate ) {
        mergedEnergies.push( E );
        mergedWaveFunctions.push( secondary.waveFunctions[ i ] );
      }
    }

    const sorted = mergedEnergies
      .map( ( e, i ) => ( { energy: e, waveFunction: mergedWaveFunctions[ i ] } ) )
      .sort( ( a, b ) => a.energy - b.energy );

    return {
      energies: sorted.map( s => s.energy ),
      waveFunctions: sorted.map( s => s.waveFunction )
    };
  }

  /**
   * Fallback bound-state search by scanning sign changes of the mismatch over an energy grid.
   */
  private findBoundStatesByMismatchScan(
    V: number[],
    xGrid: XGrid,
    meetingIndex: number,
    mismatch: ( E: number ) => number,
    energyMin: number,
    energyMax: number,
    energyScanPoints?: number[]
  ): { energies: number[]; waveFunctions: number[][] } {

    const scanGrid = this.buildScanGrid( energyMin, energyMax, energyScanPoints );
    const energies: number[] = [];
    const waveFunctions: number[][] = [];

    let previousEnergy = scanGrid[ 0 ];
    let previousMismatch = mismatch( previousEnergy );
    for ( let i = 1; i < scanGrid.length; i++ ) {
      const currentEnergy = scanGrid[ i ];
      const currentMismatch = mismatch( currentEnergy );

      if ( Number.isFinite( previousMismatch ) && Number.isFinite( currentMismatch ) ) {
        if ( previousMismatch === 0 ) {
          energies.push( previousEnergy );
          waveFunctions.push( this.computeWaveFunction( previousEnergy, V, xGrid, meetingIndex ) );
        }
        else if ( previousMismatch * currentMismatch < 0 ) {
          const energy = this.energyRefiner.refine( previousEnergy, currentEnergy, mismatch );
          energies.push( energy );
          waveFunctions.push( this.computeWaveFunction( energy, V, xGrid, meetingIndex ) );
        }
      }

      previousEnergy = currentEnergy;
      previousMismatch = currentMismatch;
    }

    return {
      energies: energies,
      waveFunctions: waveFunctions
    };
  }

  /**
   * Build a sorted scan grid that includes [energyMin, energyMax].
   */
  private buildScanGrid( energyMin: number, energyMax: number, energyScanPoints?: number[] ): number[] {
    if ( energyScanPoints && energyScanPoints.length > 0 ) {
      const interior = energyScanPoints
        .filter( energy => energy > energyMin && energy < energyMax )
        .sort( ( a, b ) => a - b );
      return [ energyMin, ...interior, energyMax ];
    }

    const STEPS = 200;
    const step = ( energyMax - energyMin ) / STEPS;
    const grid: number[] = [];
    for ( let energy = energyMin; energy <= energyMax + 1e-12; energy += step ) {
      grid.push( energy );
    }
    return grid;
  }

  /**
   * Number of interior nodes of ψ_L for trial energy E. By the Sturm–Liouville oscillation
   * theorem, this is also the index of the highest eigenstate strictly below E.
   * The count is returned directly from the inline node counter in NumerovIntegrator.integrate.
   */
  private countNodesAtEnergy( energy: number, V: number[], xGrid: XGrid ): number {
    return this.integrator.integrate( energy, V, xGrid ).nodeCount;
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
      if ( upperEnergy - lowerEnergy <= bracketTolerance ) { break; }

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
   * Build a mismatch function for use by the EnergyRefiner. At an eigenvalue, ψ_L and ψ_R have a
   * common log-derivative at the meeting point: (ψ_L'/ψ_L)|_m = (ψ_R'/ψ_R)|_m. The returned
   * function is
   *
   *     f(E) = (slopeLeft·valueRight − slopeRight·valueLeft)
   *
   * which is the log-derivative difference multiplied through by ψ_L(m)·ψ_R(m) — equivalent at
   * roots, but bounded when ψ has a node at the meeting point (avoiding 1/0). Each side is
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
      const { psi: psiLeft } = this.integrator.integrate( E, V, xGrid );
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
   * Integrate from both ends, stitch at the meeting point, and normalize.
   */
  private computeWaveFunction(
    energy: number,
    V: number[],
    xGrid: XGrid,
    meetingIndex: number
  ): number[] {
    const { psi: psiL } = this.integrator.integrate( energy, V, xGrid );
    const psiR = this.integrator.integrateBackward( energy, V, xGrid );
    const stitched = this.stitchWaveFunctions( psiL, psiR, meetingIndex );
    return this.normalizer.normalize( stitched, xGrid.dx );
  }

  /**
   * Grid index m where the left (forward) and right (backward) solutions meet for matching.
   * ψ_L is used for indices i ≤ m; ψ_R is scaled for i > m. The mismatch is formed at m.
   *
   * Groups global-minimum indices into contiguous clusters. For a single flat-bottomed well the
   * cluster centroid is used (original behaviour). For multiple separated minima (e.g., double-well
   * or triple-well) the cluster centroid closest to the grid midpoint is chosen, avoiding the
   * saddle point between wells that the naïve average of all minimum indices would produce.
   * Any cluster centroid is in the classically allowed region for all bound states, because each
   * cluster has the globally lowest potential value.
   */
  private getMeetingPointIndex( V: number[] ): number {
    const N = V.length;

    let vMin = V[ 0 ];
    for ( let i = 1; i < N; i++ ) {
      if ( V[ i ] < vMin ) {
        vMin = V[ i ];
      }
    }

    type Cluster = { first: number; last: number };
    const clusters: Cluster[] = [];
    for ( let i = 0; i < N; i++ ) {
      if ( V[ i ] === vMin ) {
        if ( clusters.length === 0 || i !== clusters[ clusters.length - 1 ].last + 1 ) {
          clusters.push( { first: i, last: i } );
        }
        else {
          clusters[ clusters.length - 1 ].last = i;
        }
      }
    }

    if ( clusters.length <= 1 ) {
      const cluster = clusters[ 0 ];
      return Math.floor( ( cluster.first + cluster.last ) / 2 );
    }

    const gridMidpoint = ( N - 1 ) / 2;
    let best = clusters[ 0 ];
    let bestDist = Math.abs( Math.floor( ( best.first + best.last ) / 2 ) - gridMidpoint );
    for ( let c = 1; c < clusters.length; c++ ) {
      const clusterMid = Math.floor( ( clusters[ c ].first + clusters[ c ].last ) / 2 );
      const dist = Math.abs( clusterMid - gridMidpoint );
      if ( dist < bestDist ) {
        bestDist = dist;
        best = clusters[ c ];
      }
    }
    return Math.floor( ( best.first + best.last ) / 2 );
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

    const psiRatMatch = psiR[ meetingPointIndex ];

    // Detect a node of psiR at the meeting point using a relative threshold so the check is
    // robust to amplitude changes in psiR (e.g. from a different boundary seed).
    const psiRNeighborMax = Math.max( Math.abs( psiR[ meetingPointIndex - 1 ] ), Math.abs( psiR[ meetingPointIndex + 1 ] ) );
    const psiRHasNodeAtMatch = psiRNeighborMax === 0 ||
                               Math.abs( psiRatMatch ) < NumerovSolver.RELATIVE_NODE_TOLERANCE * psiRNeighborMax;

    if ( !psiRHasNodeAtMatch ) {

      // scale may be negative, flipping psiR's sign to match psiL at the junction.
      const scale = psiL[ meetingPointIndex ] / psiRatMatch;
      for ( let i = meetingPointIndex + 1; i < N; i++ ) {
        stitched[ i ] = psiR[ i ] * scale;
      }
    }
    else {

      // psiR has a node at the meeting point. Determine the relative sign of psiL and psiR by
      // searching backward from meetingPointIndex − 1 for the nearest index where both are
      // significant. Searching beyond the immediate neighbor is necessary when consecutive nodes
      // happen to fall close together and psiR[meetingPointIndex − 1] is also near zero.
      const psiRMaxAbs = psiR.reduce( ( m, v ) => Math.max( m, Math.abs( v ) ), 0 );
      const psiLMaxAbs = psiL.reduce( ( m, v ) => Math.max( m, Math.abs( v ) ), 0 );
      const threshR = NumerovSolver.RELATIVE_NODE_TOLERANCE * psiRMaxAbs;
      const threshL = NumerovSolver.RELATIVE_NODE_TOLERANCE * psiLMaxAbs;

      let refIdx = meetingPointIndex - 1;
      while ( refIdx > 0 && ( Math.abs( psiR[ refIdx ] ) < threshR || Math.abs( psiL[ refIdx ] ) < threshL ) ) {
        refIdx--;
      }
      const signFlip = Math.sign( psiL[ refIdx ] ) !== Math.sign( psiR[ refIdx ] ) ? -1 : 1;
      for ( let i = meetingPointIndex + 1; i < N; i++ ) {
        stitched[ i ] = psiR[ i ] * signFlip;
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
