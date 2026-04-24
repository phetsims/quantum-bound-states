// Copyright 2026, University of Colorado Boulder

/**
 * Potential energy function V(x) that returns energy in eV, where x is in nm.
 *
 * @author Martin Veillette
 *
 * The potential function defines the quantum system and determines
 * the allowed energy levels and wave functions. Common examples include:
 *
 * @example
 * // Harmonic oscillator: V(x) = (1/2)kx²
 * const harmonicOscillator = ( x: number ) => {
 *   const k = 1;  // Spring constant in eV/nm²
 *   return 0.5 * k * x * x;
 * };
 *
 * @example
 * // Infinite square well: V(x) = 0 for |x| < L/2, V₀ otherwise
 * const infiniteWell = ( x: number ) => {
 *   const L = 1; // 1 nm well width
 *   const V0 = 500; // 500 eV barrier
 *   return Math.abs( x ) < L / 2 ? 0 : V0;
 * };
 *
 * @example
 * // Finite square well: V(x) = -V₀ for |x| < L/2, 0 otherwise
 * const finiteWell = ( x: number ) => {
 *   const L = 1; // 1 nm well width
 *   const V0 = 10; // 10 eV well depth;
 *   return Math.abs( x ) < L / 2 ? -V0 : 0;
 * };
 * 
 * @example
 * // Double well: V(x) = -V₀ for |x ± d/2| < w/2, 0 otherwise
 * const doubleWell = ( x: number ) => {   
 *   const d = 1; // Separation between wells in nm
 *   const w = 0.5; // Width of each well in nm
 *   const V0 = 10; // Depth of each well in eV
 *   const leftWell = Math.abs( x + d / 2 ) < w / 2 ? -V0 : 0; 
 *   const rightWell = Math.abs( x - d / 2 ) < w / 2 ? -V0 : 0;
 *   return leftWell + rightWell;
 * 
 * @example
 * // Poschl-Teller potential: V(x) = -V₀ / cosh²( (x - x₀) / w )
 * const poschlTeller = ( x: number ) => {   
 *  const V0 = 10; // Depth of the well in eV
 *  const x0 = 0; // Center of the well in nm
 *  const w = 0.5; // Width parameter in nm
 *  const coshValue = Math.cosh( ( x - x0 ) / w );  
 *  return -V0 / ( coshValue * coshValue );
 * };
 * 
 */
export type PotentialFunction = ( x: number ) => number;
