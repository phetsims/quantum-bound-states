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
  const internalEnergyMin = Math.max( energyMin, yOffset + 1e-6 * wellDepth );
  const internalEnergyMax = Math.min( energyMax, barrierEnergy - 1e-6 * wellDepth );

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

    while ( bisectHigh - bisectLow > 1e-10 ) {
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
  const nSamples = Math.max( 50, Math.ceil( Math.pow( -zLeft, 1.5 ) * 10 / Math.PI ) );

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

  if ( Math.abs( leftAi ) > 1e-12 ) {
    const ratio = -leftBi / leftAi; // A/B
    const norm = 1 / Math.sqrt( 1 + ratio * ratio );
    A = ratio * norm;
    B = norm;
  }
  else if ( Math.abs( leftBi ) > 1e-12 ) {
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
 */
function evaluateWaveFunction( x: number, wellWidth: number, coefficients: AiryCoefficients ): number {
  const { alpha, kappa, turningPoint, A, B } = coefficients;
  const zLeft = -alpha * turningPoint;
  const psiAtLeft = A * airyAi( zLeft ) + B * airyBi( zLeft );
  const psiAtTurningPoint = A * airyAi( 0 ) + B * airyBi( 0 );

  if ( x < 0 ) {
    return psiAtLeft * Math.exp( kappa * x );
  }
  else if ( x <= turningPoint ) {
    const z = alpha * ( x - turningPoint );
    return A * airyAi( z ) + B * airyBi( z );
  }
  else if ( x < wellWidth ) {
    return evaluateDecayingAiryTail( alpha * ( x - turningPoint ), psiAtTurningPoint );
  }
  else {
    const zAtRight = alpha * ( wellWidth - turningPoint );
    const psiAtRight = evaluateDecayingAiryTail( zAtRight, psiAtTurningPoint );
    return psiAtRight * Math.exp( -kappa * ( x - wellWidth ) );
  }
}

/**
 * Use the decaying Airy branch in the classically forbidden ramp region to avoid Bi blow-up.
 */
function evaluateDecayingAiryTail( z: number, psiAtTurningPoint: number ): number {
  const aiAtZero = airyAi( 0 );

  if ( z < 4 ) {
    return psiAtTurningPoint * airyAi( z ) / aiAtZero;
  }
  else {
    const zeta = ( 2 / 3 ) * Math.pow( z, 1.5 );
    const airyRatio = Math.exp( -zeta ) / ( 2 * Math.sqrt( Math.PI ) * Math.pow( z, 0.25 ) * aiAtZero );
    return psiAtTurningPoint * airyRatio;
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
    const zeta = ( 2 / 3 ) * Math.pow( x, 1.5 );
    return 0.5 * Math.pow( x, -0.25 ) * Math.exp( -zeta ) / Math.sqrt( Math.PI );
  }
  else {
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
    const zeta = ( 2 / 3 ) * Math.pow( x, 1.5 );
    return Math.pow( x, -0.25 ) * Math.exp( zeta ) / Math.sqrt( Math.PI );
  }
  else {
    const absX = Math.abs( x );
    const zeta = ( 2 / 3 ) * Math.pow( absX, 1.5 );
    return Math.pow( absX, -0.25 ) * Math.cos( zeta + Math.PI / 4 ) / Math.sqrt( Math.PI );
  }
}

function airyAiPrime( x: number ): number {
  const h = 1e-6;
  return ( airyAi( x + h ) - airyAi( x - h ) ) / ( 2 * h );
}

function airyBiPrime( x: number ): number {
  const h = 1e-6;
  return ( airyBi( x + h ) - airyBi( x - h ) ) / ( 2 * h );
}
