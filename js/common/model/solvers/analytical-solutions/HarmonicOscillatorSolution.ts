// Copyright 2026, University of Colorado Boulder

/**
 * Analytical solution for a Harmonic Oscillator potential.
 * V(x) = (1/2) * k * (x - x₀)² + y₀ = (1/2) * m * ω² * (x - x₀)² + y₀
 *
 * ENERGY EIGENVALUES:
 *   E_n = ℏω(n + 1/2) + y₀,  n = 0, 1, 2, ...
 *   where ω = √(k/m)
 *
 * WAVEFUNCTIONS:
 *   ψ_n(x) = (1/√(2^n n!)) · (mω/πℏ)^(1/4) · exp(-mω(x-x₀)²/(2ℏ)) · H_n(√(mω/ℏ) (x-x₀))
 *   where H_n are the Hermite polynomials
 *
 * @author Martin Veillette
 */

import factorial from '../../../../../../dot/js/util/factorial.js';
import affirm from '../../../../../../perennial-alias/js/browser-and-node/affirm.js';
import { BoundStateResult } from '../BoundStateResult.js';
import NumerovSolver from '../NumerovSolver.js';
import { PotentialFunction } from '../PotentialFunction.js';
import XGrid from '../XGrid.js';

const HBAR = NumerovSolver.HBAR;

// Parameters for createPotentialFunction method
type PotentialParameters = {
  numberOfWells: number;
  xOffset: number; // Horizontal position x₀ of the singularity in nm
  yOffset: number; // Constant energy shift y₀ in eV
  wellWidth: number; // Width of the well L in nm
  energyAtWellWidth: number; // Energy at the position where well width is measured, in eV
  electricField: number; // Electric field in V/nm
};

// Parameters for solve method
type SolveParameters = {
  energyMin: number; // Minimum energy to search (eV)
  energyMax: number; // Maximum energy to search (eV)
  electronMasses: number; // Particle mass in electron masses
} & PotentialParameters;

export default class HarmonicOscillatorSolution {

  private constructor() {
    // Not intended for instantiation.
  }

  /**
   * Creates the potential function for a single-well Harmonic Oscillator potential.
   * V(x) = (1/2) * k * (x - x₀)² + y₀
   */
  public static createPotentialFunction( parameters: PotentialParameters ): PotentialFunction {

    // Unpack parameters
    const { numberOfWells, xOffset, yOffset, wellWidth, energyAtWellWidth, electricField } = parameters;
    affirm( numberOfWells === 1, 'HarmonicOscillatorSolution does not support multiple wells' );
    affirm( electricField === 0, 'HarmonicOscillatorSolution does not support electric field' );

    const springConstant = computeSpringConstant( wellWidth, energyAtWellWidth );

    return ( x: number ) => {
      const dx = x - xOffset;
      return 0.5 * springConstant * dx * dx + yOffset;
    };
  }

  /**
   * Analytical solution for a single-well Harmonic Oscillator potential.
   * V(x) = (1/2) * k * (x - x₀)² + y₀ = (1/2) * m * ω^2 * (x - x₀)² + y₀
   */
  public static solve( xGrid: XGrid, parameters: SolveParameters ): BoundStateResult {

    // Unpack parameters
    const { numberOfWells, energyMin, energyMax, xOffset, yOffset, wellWidth, energyAtWellWidth, electronMasses, electricField } = parameters;
    affirm( numberOfWells === 1, 'HarmonicOscillatorSolution does not support multiple wells' );
    affirm( electricField === 0, 'HarmonicOscillatorSolution does not support electric field' );

    const springConstant = computeSpringConstant( wellWidth, energyAtWellWidth );
    const omega = Math.sqrt( springConstant / electronMasses );

    // Calculate energies: E_n = ℏω(n + 1/2) + y₀ for n = 0, 1, 2, ...
    // Find all n where energyMin <= E_n <= energyMax
    const energyQuantum = HBAR * omega;

    // Find the minimum n: E_n >= energyMin
    // E_n = ℏω(n + 1/2) + y₀ >= energyMin  →  n >= (energyMin - y₀) / ℏω - 1/2
    const nMin = Math.max( 0, Math.ceil( ( ( energyMin - yOffset ) / energyQuantum ) - 0.5 ) );

    // Find the maximum n: E_n <= energyMax
    // E_n = ℏω(n + 1/2) + y₀ <= energyMax  →  n <= (energyMax - y₀) / ℏω - 1/2
    const nMax = Math.floor( ( ( energyMax - yOffset ) / energyQuantum ) - 0.5 );

    // Collect all quantum numbers within the energy range
    const quantumNumbers: number[] = [];
    const energies: number[] = [];
    for ( let n = nMin; n <= nMax; n++ ) {
      const energy = energyQuantum * ( n + 0.5 ) + yOffset;
      quantumNumbers.push( n );
      energies.push( energy );
    }

    // Calculate wave functions using Hermite polynomials centered at x₀
    // ψ_n(x) = (1/√(2^n n!)) * (mω/πℏ)^(1/4) * exp(-mω(x-x₀)²/(2ℏ)) * H_n(√(mω/ℏ) (x-x₀))
    const waveFunctions: number[][] = [];
    const alpha = Math.sqrt( ( electronMasses * omega ) / HBAR );

    for ( const n of quantumNumbers ) {
      const waveFunction: number[] = [];

      // Normalization: (mω/(πℏ))^(1/4) / √(2^n n!) = (α²/π)^(1/4) / √(2^n n!)
      const normalization =
        ( 1 / Math.sqrt( Math.pow( 2, n ) * factorial( n ) ) ) *
        Math.pow( ( alpha * alpha ) / Math.PI, 0.25 );

      for ( const x of xGrid.xCoordinates ) {
        const xi = alpha * ( x - xOffset );
        const hermite = hermitePolynomial( n, xi );
        const value = normalization * Math.exp( ( -xi * xi ) / 2 ) * hermite;
        waveFunction.push( value );
      }
      waveFunctions.push( waveFunction );
    }

    const potentialFunction = HarmonicOscillatorSolution.createPotentialFunction( {
      numberOfWells: numberOfWells,
      xOffset: xOffset,
      yOffset: yOffset,
      wellWidth: wellWidth,
      energyAtWellWidth: energyAtWellWidth,
      electricField: electricField
    } );
    const potentials = xGrid.xCoordinates.map( x => potentialFunction( x ) );

    return {
      potentials: potentials,
      energies: energies,
      waveFunctions: waveFunctions,
      method: 'analytical'
    };
  }
}


/**
 * Calculates the Hermite polynomial H_n(x) using the recurrence relation:
 * H_0(x) = 1, H_1(x) = 2x, H_{n+1}(x) = 2x·H_n(x) − 2n·H_{n−1}(x)
 */
function hermitePolynomial( n: number, x: number ): number {
  if ( n === 0 ) { return 1; }
  if ( n === 1 ) { return 2 * x; }

  let hPrev = 1;
  let hCurr = 2 * x;
  for ( let i = 1; i < n; i++ ) {
    const hNext = 2 * x * hCurr - 2 * i * hPrev;
    hPrev = hCurr;
    hCurr = hNext;
  }
  return hCurr;
}

/**
 * Derive the spring constant from wellWidth at a fixed energy E = WIDTH_HANDLE_ENERGY above the well minimum.
 *
 *  At the turning point: (1/2) k x_tp² = E
 *    → x_tp = sqrt(2E / k)
 *  The full classical width w is the distance between the two turning points:
 *    → w = 2 x_tp = 2 sqrt(2E / k)
 *
 *  Inverting for k:
 *    k = 2E / x_tp² = 8E / w²
 *
 *  @param wellWidth - width of the well in nm
 *  @returns spring constant in eV/nm^2
 */
function computeSpringConstant( wellWidth: number, energyAtWellWidth: number ): number {
  return ( 8 * energyAtWellWidth ) / ( wellWidth * wellWidth );
}
