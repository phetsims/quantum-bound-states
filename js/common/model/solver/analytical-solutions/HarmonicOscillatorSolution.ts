// Copyright 2026, University of Colorado Boulder

/**
 * Analytical solution for a Harmonic Oscillator potential.
 * V(x) = (1/2) * k * x^2 = (1/2) * m * ω^2 * x^2
 *
 * ENERGY EIGENVALUES:
 *   E_n = ℏω(n + 1/2),  n = 0, 1, 2, ...
 *   where ω = √(k/m)
 *
 * WAVEFUNCTIONS:
 *   ψ_n(x) = (1/√(2^n n!)) · (mω/πℏ)^(1/4) · exp(-mωx²/(2ℏ)) · H_n(√(mω/ℏ) x)
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
import hermitePolynomial from './hermitePolynomial.js';

const HBAR = NumerovSolver.HBAR;

// Parameters for createPotentialFunction method
type PotentialParameters = {
  numberOfWells: number;
  xOffset: number; // Horizontal position x₀ of the singularity in nm
  yOffset: number; // Constant energy shift y₀ in eV
  springConstant: number; // Spring constant k in eV/nm²
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
   * V(x) = (1/2) * k * x^2
   */
  public static createPotentialFunction( parameters: PotentialParameters ): PotentialFunction {

    //TODO https://github.com/phetsims/quantum-bound-states/issues/43 Add support for xOffset and yOffset
    // Unpack parameters
    const { numberOfWells, springConstant } = parameters;
    affirm( numberOfWells === 1, 'HarmonicOscillatorSolution does not support multiple wells' );

    return ( x: number ) => {
      return 0.5 * springConstant * x * x;
    };
  }

  /**
   * Analytical solution for a single-well Harmonic Oscillator potential.
   * V(x) = (1/2) * k * x^2 = (1/2) * m * ω^2 * x^2
   */
  public static solve( xGrid: XGrid, parameters: SolveParameters ): BoundStateResult {

    //TODO https://github.com/phetsims/quantum-bound-states/issues/43 Add support for xOffset and yOffset
    // Unpack parameters
    const { numberOfWells, energyMin, energyMax, xOffset, yOffset, springConstant, electronMasses } = parameters;
    affirm( numberOfWells === 1, 'HarmonicOscillatorSolution does not support multiple wells' );

    const omega = Math.sqrt( springConstant / electronMasses );

    // Calculate energies: E_n = ℏω(n + 1/2) for n = 0, 1, 2, ...
    // Find all n where energyMin <= E_n <= energyMax
    const energyQuantum = HBAR * omega;

    // Find the minimum n: E_n >= energyMin
    // E_n = ℏω(n + 1/2) >= energyMin
    // n >= (energyMin / ℏω) - 1/2
    const nMin = Math.max( 0, Math.ceil( ( energyMin / energyQuantum ) - 0.5 ) );

    // Find the maximum n: E_n <= energyMax
    // E_n = ℏω(n + 1/2) <= energyMax
    // n <= (energyMax / ℏω) - 1/2
    const nMax = Math.floor( ( energyMax / energyQuantum ) - 0.5 );

    // Collect all quantum numbers within the energy range
    const quantumNumbers: number[] = [];
    const energies: number[] = [];
    for ( let n = nMin; n <= nMax; n++ ) {
      const energy = energyQuantum * ( n + 0.5 );
      quantumNumbers.push( n );
      energies.push( energy );
    }

    // Calculate wave functions using Hermite polynomials
    // ψ_n(x) = (1/√(2^n n!)) * (mω/πℏ)^(1/4) * exp(-mωx^2/(2ℏ)) * H_n(√(mω/ℏ) x)
    const waveFunctions: number[][] = [];
    const alpha = Math.sqrt( ( electronMasses * omega ) / HBAR );

    for ( const n of quantumNumbers ) {
      const waveFunction: number[] = [];

      // Normalization: (mω/(πℏ))^(1/4) / √(2^n n!) = (α²/π)^(1/4) / √(2^n n!)
      const normalization =
        ( 1 / Math.sqrt( Math.pow( 2, n ) * factorial( n ) ) ) *
        Math.pow( ( alpha * alpha ) / Math.PI, 0.25 );

      for ( const x of xGrid.xCoordinates ) {
        const xi = alpha * x;
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
      springConstant: springConstant
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
