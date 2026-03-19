// Copyright 2026, University of Colorado Boulder

/**
 * Grid configuration for numerical integration.
 *
 * @author Martin Martin Veillette
 *
 * Defines the spatial domain and resolution for solving the Schrödinger equation.
 * The grid should:
 * - Extend to regions where ψ ≈ 0 (typically 3-5 classical turning points)
 * - Have sufficient resolution (10-20 points per wavelength)
 * - Be symmetric around x=0 for symmetric potentials
 *
 * @example
 * // Grid for harmonic oscillator (±6 turning points)
 * const gridConfig: GridConfig = {
 *   xMin: -6, // nm
 *   xMax: 6, // nm
 *   numPoints: 1001 // ~0.012 nm spacing
 * };
 *
 * @example
 * // High-resolution grid for sharp features
 * const fineGrid: GridConfig = {
 *   xMin: -1, // nm
 *   xMax: 1, // nm
 *   numPoints: 2401 // ~0.0008 nm spacing
 * };
 */

export type GridConfig = {
  xMin: number;      // Minimum x value in nm
  xMax: number;      // Maximum x value in nm
  numPoints: number; // Number of grid points (odd recommended for symmetric potentials)
};