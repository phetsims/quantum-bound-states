// Copyright 2026, University of Colorado Boulder

/**
 * NumerovSolver orchestrates the solution of the 1D time-independent Schrödinger equation
 * using the Numerov method. This is the main solver class that coordinates the integration,
 * energy refinement, and normalization components.
 *
 * Architecture:
 * - NumerovIntegrator: Handles forward integration
 * - EnergyRefiner: Refines energy eigenvalues using bisection
 * - WavefunctionNormalizer: Normalizes wavefunctions
 *
 * The TISE is: -ℏ²/(2m) d²ψ/dx² + V(x)ψ = Eψ
 *
 * @author Martin Veillette
 */

import { BoundStateResult } from './BoundStateResult.js';
import EnergyRefiner from './EnergyRefiner.js';
import NumerovIntegrator from './NumerovIntegrator.js';
import { PotentialFunction } from './PotentialFunction.js';
import WavefunctionNormalizer, { NormalizationMethod } from './WavefunctionNormalizer.js';
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
  public static solveNumerov(
    xGrid: XGrid,
    potential: PotentialFunction,
    mass: number,
    energyMin: number,
    energyMax: number
  ): BoundStateResult {
    const solver = new NumerovSolver( mass );
    return solver.solve( potential, xGrid, energyMin, energyMax );
  }

  // Number of energy steps for scanning in the shooting method.
  // This is a parameter that strongly affects the performance. A larger value makes the energy search more robust.
  private static readonly ENERGY_SCAN_STEPS = 200;

  private readonly integrator: NumerovIntegrator;
  private readonly energyRefiner: EnergyRefiner;
  private readonly normalizer: WavefunctionNormalizer;

  /**
   * @param mass - Particle mass in kg
   * @param options - Optional solver configuration
   */
  public constructor( mass: number, options?: NumerovSolverOptions ) {
    // Create component instances
    this.integrator = new NumerovIntegrator( mass );

    // If energyTolerance is provided, it's absolute (in eV); otherwise use default relative tolerance
    const energyRefinerOptions = options?.energyTolerance !== undefined ?
      { tolerance: options.energyTolerance, isRelative: false }
                                                                        : {};
    this.energyRefiner = new EnergyRefiner( this.integrator, energyRefinerOptions );

    this.normalizer = new WavefunctionNormalizer(
      options?.normalizationMethod ?? 'trapezoidal'
    );
  }

  /**
   * Solves the 1D Schrödinger equation using the Numerov method.
   * Main public API that finds all bound states within the energy bounds.
   *
   * Uses the shooting method: scans energy range looking for energies where
   * the wavefunction satisfies boundary conditions (ψ → 0 at boundaries).
   * Detects eigenvalues by finding sign changes in ψ(x_max).
   *
   * @param potential - Function V(x) that returns potential energy in eV
   * @param xGrid - uniformly spaced x-coordinates in nm
   * @param energyMin - Minimum energy to search (eV)
   * @param energyMax - Maximum energy to search (eV)
   * @returns Bound state results containing energies, wavefunctions, and grid
   *
   * @example
   * // Solve harmonic oscillator
   * const mass = 1;  // electron masses
   * const k = 5.685630103565724; // arbitrary spring constant, eV/nm²
   * const potential = ( x: number ) => 0.5 * k * x * x;
   *
   * const solver = new NumerovSolver( mass );
   * const result = solver.solve(
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
  public solve(
    potential: PotentialFunction,
    xGrid: XGrid,
    energyMin: number,
    energyMax: number
  ): BoundStateResult {

    const V = this.evaluatePotential( potential, xGrid.xCoordinates );

    // Find bound states
    const { energies, wavefunctions } = this.findBoundStates(
      V,
      xGrid,
      energyMin,
      energyMax
    );

    return {
      potentials: V,
      energies: energies,
      wavefunctions: wavefunctions,
      method: 'numerov'
    };
  }

  /**
   * Finds bound states using the standard shooting method.
   */
  private findBoundStates(
    V: number[],
    xGrid: XGrid,
    energyMin: number,
    energyMax: number
  ): { energies: number[]; wavefunctions: number[][] } {

    const energies: number[] = [];
    const wavefunctions: number[][] = [];

    // Scan energy range looking for sign changes
    const energyStep = ( energyMax - energyMin ) / NumerovSolver.ENERGY_SCAN_STEPS;

    // Initialize prevSign by integrating at energyMin
    const psi0 = this.integrator.integrate( energyMin, V, xGrid );
    const endValue0 = this.getEndValue( psi0 );
    let prevSign = Math.sign( endValue0 );
    let prevEnergy = energyMin;

    for ( let E = energyMin + energyStep; E <= energyMax; E += energyStep ) {
      const psi = this.integrator.integrate( E, V, xGrid );
      const endValue = this.getEndValue( psi );

      // Check for sign change (indicates bound state)
      const currentSign = Math.sign( endValue );

      if ( currentSign !== 0 && prevSign !== 0 && currentSign !== prevSign ) {

        // Refine energy
        const refinedEnergy = this.energyRefiner.refine( prevEnergy, E, V, xGrid );
        energies.push( refinedEnergy );

        // Calculate and normalize wavefunction
        const refinedPsi = this.integrator.integrate( refinedEnergy, V, xGrid );
        const normalizedPsi = this.normalizer.normalize( refinedPsi, xGrid.dx );
        wavefunctions.push( normalizedPsi );
      }

      if ( currentSign !== 0 ) {
        prevSign = currentSign;
        prevEnergy = E;
      }
    }

    return { energies: energies, wavefunctions: wavefunctions };
  }

  /**
   * Evaluates potential on grid.
   */
  private evaluatePotential( potential: PotentialFunction, xGridArray: number[] ): number[] {
    return xGridArray.map( potential );
  }

  /**
   * Gets the wavefunction value at the end of the grid.
   */
  private getEndValue( psi: number[] ): number {
    return psi[ psi.length - 1 ];
  }
}
