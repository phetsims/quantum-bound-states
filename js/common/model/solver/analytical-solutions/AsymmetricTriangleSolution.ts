// Copyright 2026, University of Colorado Boulder

/**
 * Analytical solution for a single-well Asymmetric Triangle potential.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import affirm from '../../../../../../perennial-alias/js/browser-and-node/affirm.js';
import { BoundStateResult } from '../BoundStateResult.js';
import NumerovSolver from '../NumerovSolver.js';
import { PotentialFunction } from '../PotentialFunction.js';
import WaveFunctionNormalizer from '../WaveFunctionNormalizer.js';
import XGrid from '../XGrid.js';

const HBAR = NumerovSolver.HBAR;

// Fraction of wellDepth used to nudge the energy search range away from exact well edges,
// preventing the solver from starting exactly at a boundary where V(x) = E.
const ENERGY_BOUNDARY_FRACTION = 1e-6;

// Bisection stops when the energy interval is narrower than this value (eV).
const BISECTION_CONVERGENCE_THRESHOLD = 1e-10;

// Minimum number of samples used when counting interior nodes of the Airy wave function.
const MIN_NODE_COUNT_SAMPLES = 50;

// Number of samples per local oscillation period when counting nodes adaptively.
const NODE_COUNT_SAMPLES_PER_PERIOD = 10;

// Threshold below which an Airy boundary value is treated as zero when computing A/B coefficients.
const AIRY_DEGENERACY_THRESHOLD = 1e-12;

// Step size for the central-difference approximation of Airy function derivatives.
const AIRY_PRIME_STEP = 1e-6;

// Parameters for createPotentialFunction method
type PotentialParameters = {
  numberOfWells: number;
  xOffset: number; // Horizontal position x₀ of the wall in nm
  yOffset: number; // Constant energy shift y₀ in eV
  wellWidth: number; // Width of the well L in nm
  wellDepth: number; // Depth of the well V₀ in eV
  electricField: number; // Electric field in V/nm
};

// Parameters for solve method
type SolveParameters = {
  energyMin: number; // Minimum energy to search (eV)
  energyMax: number; // Maximum energy to search (eV)
  electronMasses: number; // Particle mass in electron masses
} & PotentialParameters;

export default class AsymmetricTriangleSolution {

  private constructor() {
    // Not intended for instantiation.
  }

  /**
   * Creates the potential function for a single-well Asymmetric Triangle potential.
   * V(x) = y₀ + V₀ outside the well, and ramps linearly from y₀ to y₀ + V₀ inside the well.
   * The potential is defined in the local coordinate system where the wall is at x = x₀ 
   */
  public static createPotentialFunction( parameters: PotentialParameters ): PotentialFunction {

    const { numberOfWells, xOffset, yOffset, wellWidth, wellDepth, electricField } = parameters;
    affirm( numberOfWells === 1, 'AsymmetricTriangleSolution does not support multiple wells' );
    affirm( electricField === 0, 'AsymmetricTriangleSolution does not support electric field' );

    const leftEdge = xOffset - wellWidth / 2;
    const slope = wellDepth / wellWidth;
    const barrierEnergy = yOffset + wellDepth;

    return ( x: number ) => {
      const xInWell = x - leftEdge;
      if ( xInWell < 0 || xInWell > wellWidth ) {
        return barrierEnergy;
      }
      else {
        return yOffset + slope * xInWell;
      }
    };
  }

  /**
   * Analytical solution for a single-well Asymmetric Triangle potential.
   */
  public static solve( xGrid: XGrid, parameters: SolveParameters ): BoundStateResult {

    const { numberOfWells, energyMin, energyMax, wellWidth, wellDepth, xOffset, yOffset, electronMasses, electricField } = parameters;
    affirm( numberOfWells === 1, 'AsymmetricTriangleSolution does not support multiple wells' );
    affirm( electricField === 0, 'AsymmetricTriangleSolution does not support electric field' );

    const energies = findBoundStateEnergies(
      wellWidth,
      wellDepth,
      electronMasses,
      yOffset,
      energyMin,
      energyMax
    );

    const waveFunctions: number[][] = [];
    for ( const energy of energies ) {
      const waveFunction = calculateWaveFunction(
        energy,
        wellWidth,
        wellDepth,
        electronMasses,
        yOffset,
        xOffset,
        xGrid.xCoordinates
      );
      waveFunctions.push( waveFunction );
    }

    const potentialFunction = AsymmetricTriangleSolution.createPotentialFunction( {
      numberOfWells: numberOfWells,
      xOffset: xOffset,
      yOffset: yOffset,
      wellWidth: wellWidth,
      wellDepth: wellDepth,
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
 * Find all bound-state energies for the finite triangular well.
 *
 * By the Sturm oscillation theorem, the n-th eigenstate has exactly n interior nodes,
 * and the node count increases by 1 at each eigenvalue. Bisecting on each n→n+1 transition
 * guarantees that no eigenvalue is missed, regardless of how closely spaced the states are.
 */
function findBoundStateEnergies(
  wellWidth: number,
  wellDepth: number,
  electronMasses: number,
  yOffset: number,
  energyMin: number,
  energyMax: number
): number[] {

  const barrierEnergy = yOffset + wellDepth;
  const internalEnergyMin = Math.max( energyMin, yOffset + ENERGY_BOUNDARY_FRACTION * wellDepth );
  const internalEnergyMax = Math.min( energyMax, barrierEnergy - ENERGY_BOUNDARY_FRACTION * wellDepth );

  if ( internalEnergyMin >= internalEnergyMax ) {
    return [];
  }

  const nodeCount = ( energy: number ) =>
    countNodesInAiryRegion( energy, wellWidth, wellDepth, electronMasses, yOffset );

  const totalStates = nodeCount( internalEnergyMax );
  const energies: number[] = [];
  let searchLow = internalEnergyMin;

  for ( let n = 0; n < totalStates; n++ ) {

    // Bisect to find the energy where node count transitions from n to n+1.
    let bisectLow = searchLow;
    let bisectHigh = internalEnergyMax;

    while ( bisectHigh - bisectLow > BISECTION_CONVERGENCE_THRESHOLD ) {
      const mid = ( bisectLow + bisectHigh ) / 2;
      if ( nodeCount( mid ) <= n ) {
        bisectLow = mid;
      }
      else {
        bisectHigh = mid;
      }
    }

    energies.push( ( bisectLow + bisectHigh ) / 2 );
    searchLow = bisectLow;
  }

  return energies;
}

/**
 * Count interior nodes (zero crossings) of the Airy wave function at the given energy.
 * Nodes occur only in the classically allowed region where V(x) < energy.
 * Uses adaptive sampling: zeros of A·Ai(z)+B·Bi(z) are spaced ~π/√|z| apart,
 * so we sample proportionally to |zLeft|^(3/2) to resolve all zeros near the left edge.
 */
function countNodesInAiryRegion(
  energy: number,
  wellWidth: number,
  wellDepth: number,
  electronMasses: number,
  yOffset: number
): number {

  const { alpha, turningPoint, A, B } = calculateAiryCoefficients(
    energy, wellWidth, wellDepth, electronMasses, yOffset
  );

  if ( turningPoint <= 0 ) {
    return 0;
  }

  // The Airy argument z = alpha*(x - turningPoint) maps the classically allowed region [0, turningPoint] to [zLeft, 0].
  const zLeft = -alpha * turningPoint;

  // ≥10 samples per local period at z = zLeft (densest region) ensures all zeros are detected.
  const nSamples = Math.max( MIN_NODE_COUNT_SAMPLES, Math.ceil( Math.pow( -zLeft, 1.5 ) * NODE_COUNT_SAMPLES_PER_PERIOD / Math.PI ) );

  let count = 0;
  let prev = A * airyAi( zLeft ) + B * airyBi( zLeft );

  for ( let i = 1; i <= nSamples; i++ ) {
    const z = zLeft + i * ( -zLeft ) / nSamples;
    const curr = A * airyAi( z ) + B * airyBi( z );
    if ( prev * curr < 0 ) {
      count++;
    }
    prev = curr;
  }

  return count;
}

type AiryCoefficients = {
  alpha: number;
  kappa: number;
  turningPoint: number;
  A: number;
  B: number;
  leftAi: number;
  leftBi: number;
  rightAi: number;
  rightBi: number;
};

/**
 * Calculate Airy scaling and the Ai/Bi coefficients implied by the left boundary.
 */
function calculateAiryCoefficients(
  energy: number,
  wellWidth: number,
  wellDepth: number,
  electronMasses: number,
  yOffset: number
): AiryCoefficients {

  const slope = wellDepth / wellWidth;
  const barrierEnergy = yOffset + wellDepth;
  const alpha = Math.pow( 2 * electronMasses * slope / ( HBAR * HBAR ), 1 / 3 );
  const kappa = Math.sqrt( 2 * electronMasses * ( barrierEnergy - energy ) ) / HBAR;
  const turningPoint = ( energy - yOffset ) / slope;

  const zLeft = -alpha * turningPoint;
  const zRight = alpha * ( wellWidth - turningPoint );

  const AiLeft = airyAi( zLeft );
  const BiLeft = airyBi( zLeft );
  const AiRight = airyAi( zRight );
  const BiRight = airyBi( zRight );
  const AiPrimeLeft = airyAiPrime( zLeft );
  const BiPrimeLeft = airyBiPrime( zLeft );
  const AiPrimeRight = airyAiPrime( zRight );
  const BiPrimeRight = airyBiPrime( zRight );

  const leftAi = kappa * AiLeft - alpha * AiPrimeLeft;
  const leftBi = kappa * BiLeft - alpha * BiPrimeLeft;
  const rightAi = kappa * AiRight + alpha * AiPrimeRight;
  const rightBi = kappa * BiRight + alpha * BiPrimeRight;

  let A: number;
  let B: number;

  if ( Math.abs( leftAi ) > AIRY_DEGENERACY_THRESHOLD ) {
    const ratio = -leftBi / leftAi; // A/B
    const norm = 1 / Math.sqrt( 1 + ratio * ratio );
    A = ratio * norm;
    B = norm;
  }
  else if ( Math.abs( leftBi ) > AIRY_DEGENERACY_THRESHOLD ) {
    const ratio = -leftAi / leftBi; // B/A
    const norm = 1 / Math.sqrt( 1 + ratio * ratio );
    A = norm;
    B = ratio * norm;
  }
  else {
    A = 1;
    B = 0;
  }

  return {
    alpha: alpha,
    kappa: kappa,
    turningPoint: turningPoint,
    A: A,
    B: B,
    leftAi: leftAi,
    leftBi: leftBi,
    rightAi: rightAi,
    rightBi: rightBi
  };
}

/**
 * Calculate a normalized wave function for one finite triangular well eigenstate.
 */
function calculateWaveFunction(
  energy: number,
  wellWidth: number,
  wellDepth: number,
  electronMasses: number,
  yOffset: number,
  xOffset: number,
  xArray: readonly number[]
): number[] {

  const coefficients = calculateAiryCoefficients( energy, wellWidth, wellDepth, electronMasses, yOffset );
  const leftEdge = xOffset - wellWidth / 2;
  const psiRaw: number[] = [];

  for ( const x of xArray ) {
    const xInWell = x - leftEdge;
    const value = evaluateWaveFunction( xInWell, wellWidth, coefficients );
    psiRaw.push( Number.isFinite( value ) ? value : 0 );
  }

  const dx = xArray.length > 1 ? xArray[ 1 ] - xArray[ 0 ] : 0;
  return applySignConvention( new WaveFunctionNormalizer().normalize( psiRaw, dx ) );
}

/**
 * Evaluate the unnormalized eigenfunction in local coordinates where the ramp starts at x = 0.
 *
 * The full Airy combination A·Ai(z) + B·Bi(z) is used throughout the entire well (0 ≤ x ≤ wellWidth)
 * with no switch at the classical turning point. This guarantees both value and derivative are
 * continuous everywhere — in particular, there is no kink at the turning point.
 *
 * Why Bi does not blow up: at a converged eigenvalue the right boundary condition forces
 * B ≈ A·Ai(z_R)/Bi(z_R), which is exponentially small when z_R is large, so B·Bi(z) ≤ A·Ai(z_R)
 * for all z ≤ z_R and the combination remains bounded throughout the well.
 */
function evaluateWaveFunction( x: number, wellWidth: number, coefficients: AiryCoefficients ): number {
  const { alpha, kappa, turningPoint, A, B } = coefficients;

  if ( x < 0 ) {

    // Left barrier: exponential decay matched to the Airy combination at x = 0.
    const zLeft = -alpha * turningPoint;
    const psiAtLeft = A * airyAi( zLeft ) + B * airyBi( zLeft );
    return psiAtLeft * Math.exp( kappa * x );
  }
  else if ( x <= wellWidth ) {

    // Ramp region: single Airy combination, valid in both the classically allowed (z < 0)
    // and classically forbidden (z > 0) sub-regions. No formula switch → no derivative kink.
    const z = alpha * ( x - turningPoint );
    return A * airyAi( z ) + B * airyBi( z );
  }
  else {

    // Right barrier: exponential decay matched to the Airy combination at x = wellWidth.
    const zRight = alpha * ( wellWidth - turningPoint );
    const psiAtRight = A * airyAi( zRight ) + B * airyBi( zRight );
    return psiAtRight * Math.exp( -kappa * ( x - wellWidth ) );
  }
}

/**
 * Put each state in a stable display convention: the largest lobe is positive.
 */
function applySignConvention( waveFunction: number[] ): number[] {
  let maxAbsIndex = 0;
  for ( let i = 1; i < waveFunction.length; i++ ) {
    if ( Math.abs( waveFunction[ i ] ) > Math.abs( waveFunction[ maxAbsIndex ] ) ) {
      maxAbsIndex = i;
    }
  }

  return waveFunction[ maxAbsIndex ] < 0 ? waveFunction.map( value => -value ) : waveFunction;
}

/**
 * Airy function Ai(x), using a power series near zero and asymptotic forms away from zero.
 */
function airyAi( x: number ): number {
  const ABS_X_THRESHOLD = 3;

  if ( Math.abs( x ) < ABS_X_THRESHOLD ) {
     // Series expansion for small |x|
    // Ai(x) = c1 * (1 + x^3/(2*3) + x^6/(2*3*5*6) + ...) - c2 * (x + x^4/(3*4) + x^7/(3*4*6*7) + ...)
    // where c1 = 1/(3^(2/3)*Γ(2/3)), c2 = 1/(3^(1/3)*Γ(1/3))
    const c1 = 0.3550280538878172; // 1 / ( 3^(2/3) * Γ(2/3) )
    const c2 = 0.2588194037928068; // 1 / ( 3^(1/3) * Γ(1/3) )

    let term1 = 1;
    let sum1 = 1;
    for ( let k = 1; k <= 20; k++ ) {
      term1 *= x * x * x / ( ( 3 * k - 1 ) * ( 3 * k ) );
      sum1 += term1;
      if ( Math.abs( term1 ) < 1e-15 ) { break; }
    }

    let term2 = x;
    let sum2 = x;
    for ( let k = 1; k <= 20; k++ ) {
      term2 *= x * x * x / ( 3 * k * ( 3 * k + 1 ) );
      sum2 += term2;
      if ( Math.abs( term2 ) < 1e-15 ) { break; }
    }

    return c1 * sum1 - c2 * sum2;
  }
  else if ( x > 0 ) {
    // Asymptotic expansion for large positive x
    // Ai(x) ≈ (1/(2√π)) * x^(-1/4) * exp(-ζ) * (1 - ...)
    // where ζ = (2/3) * x^(3/2)
    const zeta = ( 2 / 3 ) * Math.pow( x, 1.5 );
    return 0.5 * Math.pow( x, -0.25 ) * Math.exp( -zeta ) / Math.sqrt( Math.PI );
  }
  else {
    // Asymptotic expansion for large negative x
    // Ai(x) ≈ (1/√π) * |x|^(-1/4) * sin(ζ + π/4)
    // where ζ = (2/3) * |x|^(3/2)
    const absX = Math.abs( x );
    const zeta = ( 2 / 3 ) * Math.pow( absX, 1.5 );
    return Math.pow( absX, -0.25 ) * Math.sin( zeta + Math.PI / 4 ) / Math.sqrt( Math.PI );
  }
}

/**
 * Airy function Bi(x), using a power series near zero and asymptotic forms away from zero.
 */
function airyBi( x: number ): number {
  const ABS_X_THRESHOLD = 3;

  if ( Math.abs( x ) < ABS_X_THRESHOLD ) {
    // Series expansion for small |x|
    // Bi(x) = c3 * (1 + x^3/(2*3) + x^6/(2*3*5*6) + ...) + c4 * (x + x^4/(3*4) + x^7/(3*4*6*7) + ...)
    // where c3 = 1/(3^(1/6)*Γ(2/3)), c4 = 3^(1/6)/Γ(1/3)
    const c3 = 0.6149266274460007; // 1 / ( 3^(1/6) * Γ(2/3) )
    const c4 = 0.4482883573538264; // 3^(1/6) / Γ(1/3)

    let term1 = 1;
    let sum1 = 1;
    for ( let k = 1; k <= 20; k++ ) {
      term1 *= x * x * x / ( ( 3 * k - 1 ) * ( 3 * k ) );
      sum1 += term1;
      if ( Math.abs( term1 ) < 1e-15 ) { break; }
    }

    let term2 = x;
    let sum2 = x;
    for ( let k = 1; k <= 20; k++ ) {
      term2 *= x * x * x / ( 3 * k * ( 3 * k + 1 ) );
      sum2 += term2;
      if ( Math.abs( term2 ) < 1e-15 ) { break; }
    }

    return c3 * sum1 + c4 * sum2;
  }
  else if ( x > 0 ) {
    // Asymptotic expansion for large positive x
    // Bi(x) ≈ (1/√π) * x^(-1/4) * exp(ζ)
    // where ζ = (2/3) * x^(3/2)
    const zeta = ( 2 / 3 ) * Math.pow( x, 1.5 );
    return Math.pow( x, -0.25 ) * Math.exp( zeta ) / Math.sqrt( Math.PI );
  }
  else {
    // Asymptotic expansion for large negative x
    // Bi(x) ≈ (1/√π) * |x|^(-1/4) * cos(ζ + π/4)
    // where ζ = (2/3) * |x|^(3/2)
    const absX = Math.abs( x );
    const zeta = ( 2 / 3 ) * Math.pow( absX, 1.5 );
    return Math.pow( absX, -0.25 ) * Math.cos( zeta + Math.PI / 4 ) / Math.sqrt( Math.PI );
  }
}

function airyAiPrime( x: number ): number {
  return ( airyAi( x + AIRY_PRIME_STEP ) - airyAi( x - AIRY_PRIME_STEP ) ) / ( 2 * AIRY_PRIME_STEP );
}

function airyBiPrime( x: number ): number {
  return ( airyBi( x + AIRY_PRIME_STEP ) - airyBi( x - AIRY_PRIME_STEP ) ) / ( 2 * AIRY_PRIME_STEP );
}
