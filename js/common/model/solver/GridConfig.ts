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
 *   xMin: -6e-9,     // -6 nm
 *   xMax: 6e-9,      // +6 nm
 *   numPoints: 1001  // ~12 pm spacing
 * };
 *
 * @example
 * // High-resolution grid for sharp features
 * const fineGrid: GridConfig = {
 *   xMin: -1e-9,
 *   xMax: 1e-9,
 *   numPoints: 2401  // ~0.8 pm spacing
 * };
 */

export type GridConfig = {
  xMin: number;      // Minimum x value in meters
  xMax: number;      // Maximum x value in meters
  numPoints: number; // Number of grid points (odd recommended for symmetric potentials)
};