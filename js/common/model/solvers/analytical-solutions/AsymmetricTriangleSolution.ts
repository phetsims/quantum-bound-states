// Copyright 2026, University of Colorado Boulder

/**
 * AsymmetricTriangleSolution implements the analytical solution for a single-well Asymmetric Triangle potential.
 *
 * The solution involves Airy functions Ai(z) and Bi(z), which are the natural basis functions for a linear potential
 * region. The potential is a finite triangular well. It is flat at the barrier energy outside the well and rises
 * linearly across the well interior:
 *
 * V(x) = wellDepth + yOffset    for x < xOffset - wellWidth/2
 * V(x) = yOffset + (wellDepth/wellWidth) * x    for xOffset - wellWidth/2 < x < xOffset + wellWidth/2
 * V(x) = wellDepth + yOffset    for x > xOffset + wellWidth/2
 *
 * The solver:
 * 1. Finds energies that satisfy the boundary-matching equation.
 * 2. Builds the corresponding Airy wave function for each energy.
 * 3. Normalizes each wave function on the supplied x grid.
 *
 * Bound states exist when: yOffset < E < wellDepth + yOffset
 * 
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import affirm from '../../../../../../perennial-alias/js/browser-and-node/affirm.js';
import QBSConstants from '../../../QBSConstants.js';
import BoundStateResult from '../BoundStateResult.js';
import { PotentialFunction } from '../PotentialFunction.js';
import WaveFunctionNormalizer from '../WaveFunctionNormalizer.js';
import XGrid from '../XGrid.js';

const HBAR = QBSConstants.HBAR;

// Fraction of wellDepth used to nudge the energy search range away from exact well edges,
// preventing the solver from starting exactly at a boundary where V(x) = E.
const ENERGY_BOUNDARY_FRACTION = 1e-8;

// Bisection stops when the energy interval is narrower than this value (eV).
const BISECTION_CONVERGENCE_THRESHOLD = 1e-15;

// Number of search intervals used to bracket roots of the transcendental boundary equation.
const ENERGY_SEARCH_POINTS = 1000;

// Maximum number of bisection iterations used to refine one energy root.
const BISECTION_MAX_ITERATIONS = 1000;

// Threshold below which an Airy boundary value is treated as zero when computing A/B coefficients.
const AIRY_DEGENERACY_THRESHOLD = 1e-12;

// Step size for the central-difference approximation of Airy function derivatives.
const AIRY_PRIME_STEP = 1e-8;

// Positive Airy argument where the asymptotic Ai form is used instead of direct evaluation.
const AIRY_ASYMPTOTIC_THRESHOLD = 4;

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

    return new BoundStateResult( {
      potentials: potentials,
      energies: energies,
      waveFunctions: waveFunctions,
      solutionMethod: 'analytical'
    } );
  }
}

/**
 * Finds all bound-state energies for the finite triangular well.
 *
 * The Airy solution inside the ramp must connect smoothly to decaying exponential tails
 * outside the well. That requirement produces a transcendental boundary equation. Roots
 * of that equation are the allowed bound-state energies.
 *
 * The equation solved here is:
 *
 * leftBi(E) * rightAi(E) - leftAi(E) * rightBi(E) = 0
 *
 * Here "left" and "right" refer to the two edges of the finite well. In local well
 * coordinates, the left edge is x = 0 and the right edge is x = wellWidth. In global
 * simulation coordinates, these are x = xOffset - wellWidth / 2 and
 * x = xOffset + wellWidth / 2.
 *
 * leftAi/leftBi are the boundary terms for the Ai/Bi basis functions at the left edge.
 * rightAi/rightBi are the corresponding boundary terms at the right edge. Each term
 * combines the Airy value and derivative at that edge so the interior Airy solution can
 * be matched to the exterior exponential tail.
 *
 * Steps:
 * 1. Restrict the search range to true bound-state energies: yOffset < E < barrierEnergy.
 * 2. Sample the boundary equation on a uniform energy grid.
 * 3. Record intervals where the sampled equation changes sign.
 * 4. Refine each sign-change interval with bisection.
 * 5. Return the refined energies in ascending order.
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

  // Transcendental boundary equation: leftBi * rightAi - leftAi * rightBi = 0.
  // "left" is the well edge at local x = 0; "right" is the well edge at local x = wellWidth.
  // A zero means both edge conditions can be satisfied by the same Ai/Bi coefficient pair.
  const transcendentalFunction = ( energy: number ): number => {
    const { leftAi, leftBi, rightAi, rightBi } = calculateAiryCoefficients(
      energy, wellWidth, wellDepth, electronMasses, yOffset
    );

    // Boundary matching condition at both finite barriers.
    return leftBi * rightAi - leftAi * rightBi;
  };

  const brackets: Array<[ number, number ]> = [];
  const dE = ( internalEnergyMax - internalEnergyMin ) / ENERGY_SEARCH_POINTS;
  let prevEnergy = internalEnergyMin;
  let prevValue = transcendentalFunction( prevEnergy );

  // First pass: locate possible roots by looking for sign changes between neighboring
  // energy samples. Each bracket is later refined to a single eigenvalue.
  for ( let i = 1; i <= ENERGY_SEARCH_POINTS; i++ ) {
    const energy = internalEnergyMin + i * dE;
    const value = transcendentalFunction( energy );

    if ( Number.isFinite( prevValue ) && Number.isFinite( value ) && prevValue * value < 0 ) {
      brackets.push( [ prevEnergy, energy ] );
    }

    prevEnergy = energy;
    prevValue = value;
  }

  const energies: number[] = [];

  // Second pass: convert each bracket into a precise energy value.
  for ( const [ low, high ] of brackets ) {
    const energy = refineBisection( transcendentalFunction, low, high );

    if ( energy !== null ) {
      energies.push( energy );
    }
  }

  return energies.sort( ( a, b ) => a - b );
}

/**
 * Refines one bracketed root using bisection.
 *
 * The caller provides low/high energies that should straddle a sign change in f. Each
 * iteration evaluates the midpoint and keeps the half-interval that still contains the
 * sign change, until the interval is sufficiently small.
 */
function refineBisection( f: ( x: number ) => number, low: number, high: number ): number | null {
  let fLow = f( low );
  const fHigh = f( high );

  if ( !Number.isFinite( fLow ) || !Number.isFinite( fHigh ) || fLow * fHigh > 0 ) {
    return null;
  }

  let a = low;
  let b = high;

  for ( let i = 0; i < BISECTION_MAX_ITERATIONS && b - a > BISECTION_CONVERGENCE_THRESHOLD; i++ ) {
    const mid = ( a + b ) / 2;
    const fMid = f( mid );

    if ( !Number.isFinite( fMid ) ) {
      return null;
    }
    if ( Math.abs( fMid ) < Number.EPSILON ) {
      return mid;
    }
    if ( fLow * fMid < 0 ) {
      b = mid;
    }
    else {
      a = mid;
      fLow = fMid;
    }
  }

  return ( a + b ) / 2;
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
 * Calculates Airy scaling and the Ai/Bi coefficients for a trial energy.
 *
 * alpha converts physical distance into the dimensionless Airy argument z. kappa is the
 * exponential decay constant in the flat barrier regions. The boundary terms combine
 * wave-function continuity and derivative continuity at the two well edges.
 *
 * The returned A and B values are a normalized coefficient pair for the interior solution:
 *
 * psi(x) = A * Ai(z) + B * Bi(z)
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

  // Evaluate the Airy basis and its derivative at both well edges. These values define
  // how the interior Airy solution joins to the exterior exponential tails.
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

  // Choose an A/B pair that satisfies the left boundary condition. The two branches avoid
  // dividing by a nearly zero boundary term.
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

  // Check for potential numerical instability when Bi grows rapidly in the forbidden
  // region. If the trial combination grows too much, replace it with a local Ai/Bi
  // cancellation near zTest and renormalize the coefficient vector.
  const zTest = Math.min( zRight, 3 );
  if ( zTest > 0 ) {
    const psiTest = A * airyAi( zTest ) + B * airyBi( zTest );
    const psiAtLeft = A * AiLeft + B * BiLeft;

    // If the test wave function is much larger than the left boundary wave function,
    // the Bi component is dominating numerically instead of representing a decaying tail.
    if ( Math.abs( psiTest ) > 100 * Math.abs( psiAtLeft ) ) {
      A = 1;
      B = -airyAi( zTest ) / airyBi( zTest );

      // Normalize A and B to ensure they are a unit vector.
      const norm = Math.sqrt( A * A + B * B );
      A /= norm;
      B /= norm;
    }
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
 * Calculates a normalized wave function for one finite triangular well eigenstate.
 *
 * The x grid is supplied in global simulation coordinates. The analytical wave function
 * is evaluated in local coordinates where the left edge of the triangular well is x = 0,
 * then normalized using the grid spacing.
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

  // Evaluate the unnormalized wave function at each grid point. Non-finite values are
  // discarded so that one unstable point does not poison the normalization.
  for ( const x of xArray ) {
    const xInWell = x - leftEdge;
    const value = evaluateWaveFunction( xInWell, wellWidth, coefficients );
    psiRaw.push( Number.isFinite( value ) ? value : 0 );
  }

  const dx = xArray.length > 1 ? xArray[ 1 ] - xArray[ 0 ] : 0;
  return applySignConvention( new WaveFunctionNormalizer().normalize( psiRaw, dx ) );
}

/**
 * Evaluates the unnormalized eigenfunction in local coordinates where the ramp starts at x = 0.
 *
 * Regions:
 * 1. Left barrier, x < 0: exponential decay away from the well.
 * 2. Classically allowed ramp, 0 <= x <= turningPoint: full Ai/Bi combination.
 * 3. Forbidden ramp, turningPoint < x < wellWidth: Ai-like decay from the turning point.
 * 4. Right barrier, x >= wellWidth: exponential decay away from the right edge.
 */
function evaluateWaveFunction( x: number, wellWidth: number, coefficients: AiryCoefficients ): number {
  const { alpha, kappa, turningPoint, A, B } = coefficients;
  const zLeft = -alpha * turningPoint;
  const psiAtLeft = A * airyAi( zLeft ) + B * airyBi( zLeft );
  const psiAtTurningPoint = A * airyAi( 0 ) + B * airyBi( 0 );

  if ( x < 0 ) {

    // Match the interior value at the left edge, then decay into the left barrier.
    return psiAtLeft * Math.exp( kappa * x );
  }
  else if ( x <= turningPoint ) {

    // Inside the classically allowed part of the ramp, use the full Airy basis.
    const z = alpha * ( x - turningPoint );
    return A * airyAi( z ) + B * airyBi( z );
  }
  else if ( x < wellWidth ) {

    // Past the turning point, keep the solution on the decaying branch.
    return evaluateForbiddenRampWaveFunction( x, alpha, turningPoint, psiAtTurningPoint );
  }
  else {

    // Match the value at the right edge, then decay into the right barrier.
    const psiAtRight = evaluateForbiddenRampWaveFunction( wellWidth, alpha, turningPoint, psiAtTurningPoint );
    return psiAtRight * Math.exp( -kappa * ( x - wellWidth ) );
  }
}

/**
 * Evaluates the decaying wave function in the forbidden part of the linear ramp, scaled so
 * that its value matches the full Airy combination at the classical turning point.
 */
function evaluateForbiddenRampWaveFunction( x: number, alpha: number, turningPoint: number, psiAtTurningPoint: number ): number {
  const z = alpha * ( x - turningPoint );
  return psiAtTurningPoint * evaluateAiDecayRatio( z );
}

/**
 * Evaluates Ai(z) / Ai(0) on the decaying side of the turning point.
 *
 * Direct Ai evaluation is used for moderate z. For larger positive z, the asymptotic
 * expression avoids underflow/overflow pressure from the Airy implementation.
 */
function evaluateAiDecayRatio( z: number ): number {
  const aiAtZero = airyAi( 0 );

  if ( z < AIRY_ASYMPTOTIC_THRESHOLD ) {
    return airyAi( z ) / aiAtZero;
  }
  else {
    const zeta = ( 2 / 3 ) * Math.pow( z, 1.5 );
    return Math.exp( -zeta ) / ( 2 * Math.sqrt( Math.PI ) * Math.pow( z, 0.25 ) * aiAtZero );
  }
}

/**
 * Put each state in a stable display convention: the largest lobe is positive.
 *
 * Both psi(x) and -psi(x) are physically equivalent eigenfunctions. Choosing a consistent
 * sign keeps plots and tests stable across small numerical differences.
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
 *
 * This implementation is intentionally lightweight and avoids adding a special-function
 * dependency for the solver. It uses:
 * 1. A convergent power series around x = 0.
 * 2. A decaying asymptotic form for large positive x.
 * 3. An oscillatory asymptotic form for large negative x.
 */
function airyAi( x: number ): number {
  const ABS_X_THRESHOLD = 3;

  if ( Math.abs( x ) < ABS_X_THRESHOLD ) {

    // Series expansion for small |x|.
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

    // Asymptotic expansion for large positive x.
    // Ai(x) ≈ (1/(2√π)) * x^(-1/4) * exp(-ζ) * (1 - ...)
    // where ζ = (2/3) * x^(3/2)
    const zeta = ( 2 / 3 ) * Math.pow( x, 1.5 );
    return 0.5 * Math.pow( x, -0.25 ) * Math.exp( -zeta ) / Math.sqrt( Math.PI );
  }
  else {

    // Asymptotic expansion for large negative x.
    // Ai(x) ≈ (1/√π) * |x|^(-1/4) * sin(ζ + π/4)
    // where ζ = (2/3) * |x|^(3/2)
    const absX = Math.abs( x );
    const zeta = ( 2 / 3 ) * Math.pow( absX, 1.5 );
    return Math.pow( absX, -0.25 ) * Math.sin( zeta + Math.PI / 4 ) / Math.sqrt( Math.PI );
  }
}

/**
 * Airy function Bi(x), using a power series near zero and asymptotic forms away from zero.
 *
 * Bi is linearly independent from Ai and grows rapidly for positive x, so it is useful in
 * the allowed region but must be handled carefully in forbidden-region calculations.
 */
function airyBi( x: number ): number {
  const ABS_X_THRESHOLD = 3;

  if ( Math.abs( x ) < ABS_X_THRESHOLD ) {

    // Series expansion for small |x|.
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

    // Asymptotic expansion for large positive x.
    // Bi(x) ≈ (1/√π) * x^(-1/4) * exp(ζ)
    // where ζ = (2/3) * x^(3/2)
    const zeta = ( 2 / 3 ) * Math.pow( x, 1.5 );
    return Math.pow( x, -0.25 ) * Math.exp( zeta ) / Math.sqrt( Math.PI );
  }
  else {

    // Asymptotic expansion for large negative x.
    // Bi(x) ≈ (1/√π) * |x|^(-1/4) * cos(ζ + π/4)
    // where ζ = (2/3) * |x|^(3/2)
    const absX = Math.abs( x );
    const zeta = ( 2 / 3 ) * Math.pow( absX, 1.5 );
    return Math.pow( absX, -0.25 ) * Math.cos( zeta + Math.PI / 4 ) / Math.sqrt( Math.PI );
  }
}

/**
 * Numerically approximates Ai'(x) with a centered finite difference.
 */
function airyAiPrime( x: number ): number {
  return ( airyAi( x + AIRY_PRIME_STEP ) - airyAi( x - AIRY_PRIME_STEP ) ) / ( 2 * AIRY_PRIME_STEP );
}

/**
 * Numerically approximates Bi'(x) with a centered finite difference.
 */
function airyBiPrime( x: number ): number {
  return ( airyBi( x + AIRY_PRIME_STEP ) - airyBi( x - AIRY_PRIME_STEP ) ) / ( 2 * AIRY_PRIME_STEP );
}
