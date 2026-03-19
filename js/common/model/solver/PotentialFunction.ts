// Copyright 2026, University of Colorado Boulder

/**
 * Potential energy function V(x) that returns energy in Joules.
 *
 * @author Martin Veillette
 *
 * The potential function defines the quantum system and determines
 * the allowed energy levels and wavefunctions. Common examples include:
 *
 * @example
 * // Harmonic oscillator: V(x) = (1/2)kx²
 * const harmonicOscillator = ( x: number ) => {
 *   const k = 1e3;  // Spring constant
 *   return 0.5 * k * x * x;
 * };
 *
 * @example
 * // Infinite square well: V(x) = 0 for |x| < L/2, V₀ otherwise
 * const infiniteWell = ( x: number ) => {
 *   const L = 1e-9;  // Well width
 *   const V0 = 500 * FundamentalConstants.EV_TO_JOULES;
 *   return Math.abs( x ) < L / 2 ? 0 : V0;
 * };
 *
 * @example
 * // Finite square well: V(x) = -V₀ for |x| < L/2, 0 otherwise
 * const finiteWell = ( x: number ) => {
 *   const L = 1e-9;
 *   const V0 = 10 * FundamentalConstants.EV_TO_JOULES;
 *   return Math.abs( x ) < L / 2 ? -V0 : 0;
 * };
 */
export type PotentialFunction = ( x: number ) => number;
