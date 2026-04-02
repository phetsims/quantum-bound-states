// Copyright 2026, University of Colorado Boulder

/**
 * NumerovSolver orchestrates the solution of the 1D time-independent Schrödinger equation
 * using the Numerov method. This is the main solver class that coordinates the integration,
 * energy refinement, and normalization components.
 *
 * Architecture:
 * - NumerovIntegrator: Handles forward integration
 * - EnergyRefiner: Refines energy eigenvalues using bisection
 * - WaveFunctionNormalizer: Normalizes wave functions
 *
 * The TISE is: -ℏ²/(2m) d²ψ/dx² + V(x)ψ = Eψ
 *
 * @author Martin Veillette
 */

import ToggleButtonInteractionStateProperty from '../../../../../sun/js/buttons/ToggleButtonInteractionStateProperty.js';
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
};

export default class NumerovSolver {

  // Reduced Planck constant (hbar) in natural units: √(eV⋅mₑ)⋅nm
  // Computed as: 1.054571817e-34 / (1e-9 * sqrt(9.1093837015e-31 * 1.602176634e-19))
  public static readonly HBAR = 0.2760428268035944;
  
  // Tolerance for detecting nodes in the wave function at the matching point.
  private static readonly TOLERANCE = 1e-6;

  /**
   * Main entry point for solving with default NumerovSolverOptions.
   *
   * @param xGrid - uniformly spaced x-coordinates in nm
   * @param potential - Function V(x) that returns potential energy in eV
   * @param mass - Particle mass in electron masses
   * @param energyMin - Minimum energy to search (eV)
   * @param energyMax - Maximum energy to search (eV)
   * @returns Bound state results
   */
  public static solve(
    xGrid: XGrid,
    potential: PotentialFunction,
    mass: number,
    energyMin: number,
    energyMax: number
  ): BoundStateResult {
    const solver = new NumerovSolver( mass );
    return solver.getBoundStateResult( potential, xGrid, energyMin, energyMax );
  }

  // Number of energy steps for scanning in the shooting method.
  // This is a parameter that strongly affects the performance. A larger value makes the energy search more robust.
  private static readonly ENERGY_SCAN_STEPS = 200;

  private readonly integrator: NumerovIntegrator;
  private readonly energyRefiner: EnergyRefiner;
  private readonly normalizer: WaveFunctionNormalizer;

  /**
   * @param mass - Particle mass in kg
   * @param options - Optional solver configuration
   */
  public constructor( mass: number, options?: NumerovSolverOptions ) {
    // Create component instances
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
   * Main public API that finds all bound states within the energy bounds.
   *
   * Uses the shooting method: scans energy range looking for energies where
   * the wave function satisfies boundary conditions (ψ → 0 at boundaries).
   * Detects eigenvalues by finding sign changes in ψ(x_max).
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
   *   0, // Ground state is above 0
   *   20 // eV
   * );
   *
   * // Access results
   * console.log( 'Ground state energy:', result.energies[ 0 ] );
   * console.log( 'First excited energy:', result.energies[ 1 ] );
   */
  public getBoundStateResult(
    potential: PotentialFunction,
    xGrid: XGrid,
    energyMin: number,
    energyMax: number
  ): BoundStateResult {

    const V = this.evaluatePotential( potential, xGrid.xCoordinates );

    // Find bound states
    const { energies, waveFunctions } = this.findBoundStates(
      V,
      xGrid,
      energyMin,
      energyMax
    );

    return {
      potentials: V,
      energies: energies,
      waveFunctions: waveFunctions,
      method: 'numerov'
    };
  }

  /**
   * Finds bound states using the bidirectional matching method.
   *
   * Instead of shooting from one side and checking ψ at x_max (which diverges exponentially
   * in classically forbidden regions), this method:
   *   1. Integrates ψ_L forward from x_min over the full grid.
   *   2. Integrates ψ_R backward from x_max over the full grid.
   *   3. Uses the Wronskian across the meeting point m: W = ψ_L[m]·ψ_R[m+1] − ψ_L[m+1]·ψ_R[m]
   *      (zero when log-derivatives match, i.e. at an eigenvalue). Default m is the grid midpoint.
   *   4. Refines each detected sign change via bisection.
   *   5. Stitches left and right solutions at m for the final wavefunction.
   */
  private findBoundStates(
    V: number[],
    xGrid: XGrid,
    energyMin: number,
    energyMax: number
  ): { energies: number[]; waveFunctions: number[][] } {

    const meetingPointIndex = this.getMeetingPointIndex( xGrid );

    // Wronskian at the meeting point: zero when log-derivatives agree (eigenvalue condition).
    const wronskian = ( E: number ): number => {
      const psiL = this.integrator.integrate( E, V, xGrid );
      const psiR = this.integrator.integrateBackward( E, V, xGrid );
      const m = meetingPointIndex;
      return psiL[ m ] * psiR[ m + 1 ] - psiL[ m + 1 ] * psiR[ m ];
    };

    const energies: number[] = [];
    const waveFunctions: number[][] = [];

    const energyStep = ( energyMax - energyMin ) / NumerovSolver.ENERGY_SCAN_STEPS;

    let prevSign = Math.sign( wronskian( energyMin ) );
    let prevEnergy = energyMin;

    for ( let E = energyMin + energyStep; E <= energyMax; E += energyStep ) {
      const currentSign = Math.sign( wronskian( E ) );

      if ( currentSign !== 0 && prevSign !== 0 && currentSign !== prevSign ) {

        // Refine energy using bisection on the Wronskian mismatch.
        const refinedEnergy = this.energyRefiner.refine( prevEnergy, E, wronskian );
        energies.push( refinedEnergy );

        // Build the final wavefunction by stitching left and right solutions.
        const psiL = this.integrator.integrate( refinedEnergy, V, xGrid );
        const psiR = this.integrator.integrateBackward( refinedEnergy, V, xGrid );
        const stitched = this.stitchWaveFunctions( psiL, psiR, meetingPointIndex );
        waveFunctions.push( this.normalizer.normalize( stitched, xGrid.dx ) );
      }

      if ( currentSign !== 0 ) {
        prevSign = currentSign;
        prevEnergy = E;
      }
    }

    return { energies, waveFunctions };
  }

  /**
   * Grid index m where the left (forward) and right (backward) solutions meet for matching.
   * ψ_L is used for indices i ≤ m; ψ_R is scaled for i > m. The Wronskian is formed using m and m+1.
   *
   * Currently fixed to the geometric midpoint of the grid: floor(N/2), i.e. the meeting point
   * in x is near the center of [x_min, x_max] for uniform spacing.
   */
  private getMeetingPointIndex( xGrid: XGrid ): number {
    return Math.floor( xGrid.numberOfPoints / 2 );
  }

  /**
   * Concatenate the left and right solutions at meetingPointIndex.
   * psiR is scaled so that ψ_R at the meeting point equals ψ_L there, ensuring continuity.
   *
   * Because psiL and psiR are integrated from opposite ends with independent
   * initial conditions, they may have opposite signs at the meeting point.
   * The scale factor (which may be negative) effectively flips the sign of psiR
   * when necessary so the stitched wavefunction is continuous.
   */
  private stitchWaveFunctions( psiL: number[], psiR: number[], meetingPointIndex: number ): number[] {
    const N = psiL.length;
    const stitched = new Array<number>( N );

    for ( let i = 0; i <= meetingPointIndex; i++ ) {
      stitched[ i ] = psiL[ i ];
    }

    const psiRatMatch = psiR[ meetingPointIndex ];
    if ( Math.abs( psiRatMatch ) > NumerovSolver.TOLERANCE ) {

      // scale may be negative, flipping psiR's sign to match psiL at the junction.
      const scale = psiL[ meetingPointIndex ] / psiRatMatch;
      for ( let i = meetingPointIndex + 1; i < N; i++ ) {
        stitched[ i ] = psiR[ i ] * scale;
      }
    }
    else {

      // psiR has a node at the meeting point; use the neighboring point to determine
      // the sign, then copy psiR unscaled (it's already normalized to ~1 in amplitude).
      const signFlip = Math.sign( psiL[ meetingPointIndex - 1 ] ) !== Math.sign( psiR[ meetingPointIndex - 1 ] ) ? -1 : 1;
      for ( let i = meetingPointIndex + 1; i < N; i++ ) {
        stitched[ i ] = psiR[ i ] * signFlip;
      }
    }

    return stitched;
  }

  /**
   * Evaluates potential on grid.
   */
  private evaluatePotential( potential: PotentialFunction, xGridArray: number[] ): number[] {
    return xGridArray.map( potential );
  }
}
