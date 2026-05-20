// Copyright 2026, University of Colorado Boulder

/**
 * EnergyRefiner refines energy eigenvalues using the bisection method.
 * Used to find the precise energy where the wave function satisfies boundary conditions.
 *
 * The caller supplies a mismatch function f(E) that returns a signed value whose zero
 * corresponds to an eigenvalue (e.g. ψ(x_max), a Wronskian, or a log-derivative difference).
 * Bisection is applied between two energies where f changes sign.
 *
 * This is a very robust method in root finding, but it generates a lot of iterations, so it is not the most efficient.
 * This approach could be refined if performance is needed.
 *
 * @author Martin Veillette
 */

// Default relative precision of 10^-4 gives absolute tolerance = 10^-4 × (bracket width)
const DEFAULT_RELATIVE_TOLERANCE = 1e-4;

/**
 * Configuration options for EnergyRefiner.
 */
export type EnergyRefinerOptions = {
  tolerance?: number;   // Tolerance value (default: 1e-4)
  isRelative?: boolean; // If true, tolerance is relative to bracket width; if false, absolute in eV (default: true)
};

export default class EnergyRefiner {

  private readonly tolerance: number;
  private readonly isRelative: boolean;

  /**
   * Physical motivation for tolerance:
   * The eigenvalue should be resolved to much better precision than the level spacing.
   * Typical quantum systems have level spacing ΔE, and we want tolerance << ΔE.
   *
   * The initial bracket width (E2 - E1) is typically a fraction of the level spacing
   * (from the energy scan that detected the sign change). A relative precision of
   * 10^-4 ensures the eigenvalue is accurate to ~4 significant figures relative to
   * the bracket width.
   *
   * @param options - Configuration options
   *   - tolerance: Energy tolerance value. If isRelative is true, this is a dimensionless
   *                relative tolerance. If isRelative is false, this is an absolute tolerance in eV.
   *                Default: 1e-4
   *   - isRelative: If true, tolerance is relative to the energy bracket width.
   *                 If false, tolerance is an absolute value in eV. Default: true
   */
  public constructor( options?: EnergyRefinerOptions ) {
    this.tolerance = options?.tolerance ?? DEFAULT_RELATIVE_TOLERANCE;
    this.isRelative = options?.isRelative ?? true;
  }

  /**
   * Refine energy eigenvalue using bisection method.
   *
   * @param E1 - Lower energy bound (eV); mismatch(E1) and mismatch(E2) must have opposite signs
   * @param E2 - Upper energy bound (eV)
   * @param mismatch - Function returning a signed value whose zero is the eigenvalue
   * @returns Refined energy eigenvalue (eV)
   */
  public refine(
    E1: number,
    E2: number,
    mismatch: ( E: number ) => number
  ): number {
    let energyLow = E1;
    let energyHigh = E2;

    // Convert tolerance to absolute value if it's relative
    const absoluteTolerance = this.isRelative ?
      this.tolerance * Math.abs( E2 - E1 ) :
      this.tolerance;

    const signLow = Math.sign( mismatch( energyLow ) );

    // Bisection loop
    while ( energyHigh - energyLow > absoluteTolerance ) {
      const energyMid = ( energyLow + energyHigh ) / 2;
      const signMid = Math.sign( mismatch( energyMid ) );

      if ( signMid === signLow ) {
        energyLow = energyMid;
      }
      else {
        energyHigh = energyMid;
      }
    }

    return ( energyLow + energyHigh ) / 2;
  }
}
