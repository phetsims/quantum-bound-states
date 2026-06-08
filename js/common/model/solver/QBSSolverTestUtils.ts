// Copyright 2026, University of Colorado Boulder

/**
 * Shared utility functions for testing the Numerov solver.
 * These functions are used by both testSolvers.ts (query-parameter tests) and
 * QBSSolverTests.ts (QUnit / Continuous-Testing tests).
 *
 * All functions are pure math with no browser dependencies.
 *
 * @author Martin Veillette
 */

/**
 * Count the number of interior nodes (zero crossings) in a wave function.
 * Handles both regular sign changes and exact zeros (for odd wave functions).
 * Skips the outermost 1 % of the array to avoid counting boundary effects.
 *
 * @param psi - Wave function array
 * @returns Number of interior nodes
 */
export function countNodes( psi: number[] ): number {
  const N = psi.length;

  // Skip boundary regions (first and last 1% to be safe)
  const skipPoints = Math.floor( N * 0.01 );

  let nodeCount = 0;

  // Find the first non-zero value to start
  let prevSign = 0;
  for ( let j = skipPoints; j < N - skipPoints; j++ ) {
    if ( psi[ j ] !== 0 ) {
      prevSign = Math.sign( psi[ j ] );
      break;
    }
  }

  // Count sign changes, treating exact zeros as potential nodes
  for ( let j = skipPoints + 1; j < N - skipPoints; j++ ) {
    const currentValue = psi[ j ];

    if ( currentValue !== 0 ) {
      const currentSign = Math.sign( currentValue );

      // Node occurs when sign changes
      if ( currentSign !== prevSign && prevSign !== 0 ) {
        nodeCount++;
      }

      prevSign = currentSign;
    }
    // currentValue === 0, check if this is a node by looking at neighbors
    else {
      // Find next non-zero value
      let nextSign = 0;
      for ( let k = j + 1; k < N - skipPoints; k++ ) {
        if ( psi[ k ] !== 0 ) {
          nextSign = Math.sign( psi[ k ] );
          break;
        }
      }

      // If there's a sign change across the zero, count it as a node
      if ( nextSign !== 0 && prevSign !== 0 && nextSign !== prevSign ) {
        nodeCount++;
        prevSign = nextSign;
      }
    }
  }

  return nodeCount;
}

/**
 * Determine the parity (even/odd) of a wave function by comparing values
 * at symmetric points about the center index.
 *
 * @param psi - Wave function array (assumed to live on a symmetric grid)
 * @returns 'even' if ψ(-x) ≈ ψ(x), 'odd' if ψ(-x) ≈ -ψ(x)
 */
export function getParity( psi: number[] ): 'even' | 'odd' {
  const N = psi.length;
  const centerIdx = Math.floor( N / 2 );

  // Compare a representative sample of symmetric point pairs (10% of half-domain)
  const samplePoints = Math.floor( centerIdx * 0.1 );

  let evenScore = 0;
  let oddScore = 0;

  for ( let i = 1; i <= samplePoints; i++ ) {
    const leftIdx = centerIdx - i;
    const rightIdx = centerIdx + i;

    if ( leftIdx >= 0 && rightIdx < N ) {
      const leftVal = psi[ leftIdx ];
      const rightVal = psi[ rightIdx ];

      const evenDiff = Math.abs( leftVal - rightVal );
      const oddDiff = Math.abs( leftVal + rightVal );

      if ( evenDiff < oddDiff ) {
        evenScore++;
      }
      else {
        oddScore++;
      }
    }
  }

  return evenScore > oddScore ? 'even' : 'odd';
}

/**
 * Compute the RMS error between two wave functions, accounting for the global
 * sign ambiguity (ψ and −ψ represent the same physical state).
 *
 * @param psi1 - First wave function (normalized)
 * @param psi2 - Second wave function (normalized)
 * @param dx - Grid spacing in nm
 * @returns RMS error after optimal sign alignment
 */
export function waveFunctionRMSError( psi1: number[], psi2: number[], dx: number ): number {

  // Determine the sign of the overlap integral ∫ ψ1 · ψ2 dx
  let overlap = 0;
  for ( let i = 0; i < psi1.length; i++ ) {
    overlap += psi1[ i ] * psi2[ i ];
  }
  overlap *= dx;

  const sign = overlap >= 0 ? 1 : -1;

  // Compute RMS of (ψ1 - sign·ψ2)
  let sumSq = 0;
  for ( let i = 0; i < psi1.length; i++ ) {
    const diff = psi1[ i ] - sign * psi2[ i ];
    sumSq += diff * diff;
  }
  return Math.sqrt( sumSq * dx );
}

/**
 * Compute the norm ∫|ψ|² dx using the trapezoidal rule.
 *
 * @param psi - Wave function array
 * @param dx - Grid spacing in nm
 * @returns Numerical value of ∫|ψ|² dx
 */
export function computeNorm( psi: number[], dx: number ): number {
  let norm = 0;
  for ( let j = 0; j < psi.length - 1; j++ ) {
    norm += ( psi[ j ] * psi[ j ] + psi[ j + 1 ] * psi[ j + 1 ] ) / 2;
  }
  return norm * dx;
}

/**
 * Compute the overlap integral ∫ψ₁ψ₂ dx using the trapezoidal rule.
 *
 * @param psi1 - First wave function array
 * @param psi2 - Second wave function array
 * @param dx - Grid spacing in nm
 * @returns Numerical value of ∫ψ₁ψ₂ dx
 */
export function computeOverlap( psi1: number[], psi2: number[], dx: number ): number {
  let overlap = 0;
  for ( let j = 0; j < psi1.length - 1; j++ ) {
    overlap += ( psi1[ j ] * psi2[ j ] + psi1[ j + 1 ] * psi2[ j + 1 ] ) / 2;
  }
  return overlap * dx;
}

/**
 * Returns true if every element of arr is a finite number (not NaN, not ±Infinity).
 *
 * @param arr - Array of numbers to check
 */
export function allFinite( arr: number[] ): boolean {
  return arr.every( v => isFinite( v ) );
}

/**
 * Returns max |ψ[i+1] − ψ[i]| / max|ψ| over the index range [iStart, iEnd).
 * A large value at a single index indicates a jump discontinuity in ψ.
 */
export function maxPsiJump( psi: number[], iStart: number, iEnd: number ): number {
  const maxAbs = Math.max( ...psi.map( Math.abs ) );
  if ( maxAbs === 0 ) { return 0; }
  let max = 0;
  for ( let i = iStart; i < iEnd; i++ ) {
    max = Math.max( max, Math.abs( psi[ i + 1 ] - psi[ i ] ) / maxAbs );
  }
  return max;
}

/**
 * Returns max |ψ'[j+1] − ψ'[j]| / max|ψ'| over derivative indices [jStart, jEnd),
 * where ψ' is estimated by central differences at all interior grid points.
 * A large value at a single index indicates a kink (discontinuous ψ').
 */
export function maxDPsiJump( psi: number[], dx: number, jStart: number, jEnd: number ): number {
  const N = psi.length;
  const dPsi: number[] = [];
  for ( let i = 1; i < N - 1; i++ ) {
    dPsi.push( ( psi[ i + 1 ] - psi[ i - 1 ] ) / ( 2 * dx ) );
  }
  const maxAbsDPsi = Math.max( ...dPsi.map( Math.abs ) );
  if ( maxAbsDPsi === 0 ) { return 0; }
  let max = 0;
  const limit = Math.min( jEnd, dPsi.length - 1 );
  for ( let j = jStart; j < limit; j++ ) {
    max = Math.max( max, Math.abs( dPsi[ j + 1 ] - dPsi[ j ] ) / maxAbsDPsi );
  }
  return max;
}

/**
 * Assert that every bound state returned by the solver is continuous in ψ and ψ'.
 *
 * @param assert - QUnit assert object
 * @param result - Solver result containing waveFunctions array
 * @param dx - Grid spacing in nm
 * @param skipEdgePoints - number of grid points to exclude at each end.
 *   Pass 1 for infinite-wall potentials (ISW, ISP) whose Dirichlet boundary makes
 *   ψ' physically discontinuous at the hard wall, which is the grid edge.
 *   Pass 0 for soft-wall potentials where ψ and ψ' are continuous everywhere.
 * @param label - label used in assertion messages
 */
export function assertWaveFunctionContinuity(
  assert: Assert,
  result: { waveFunctions: number[][] },
  dx: number,
  skipEdgePoints: number,
  label: string
): void {

  // Continuity is checked only for the genuinely-smooth, well-resolved soft-wall potentials.  Cases
  // that arer solved exactly or nearly exactly (e.g. ISW, ISP, Harmonic Oscillator) can have true discontinuities in ψ and ψ' at the grid scale due to the nature of the solution, 
  // not solver error.  Cases with very sharp features (e.g. Coulomb) can have large jumps that are physical and 
  // well-resolved but would fail a tight continuity threshold. 

  // Threshold for ψ: max change per grid step, normalised by max|ψ|.  For a smooth wave function the
  // change per step is ~kwave·dx, largest for the highest bound state.  The binding case among the
  // retained soft-wall tests is the tilted multi-well Pöschl-Teller regression at ≈ 0.031.
  const PSI_JUMP_THRESHOLD = 0.045;

  // Threshold for ψ': max change per grid step in the central-difference derivative, normalised by
  // max|ψ'|.  The binding case is the tilted multi-well Pöschl-Teller regression scenario (the bug this
  // metric guards) at ≈ 0.040.  We set 0.05 — tight enough to catch any genuine kink while clearing
  // that worst-case high state.
  const DPSI_JUMP_THRESHOLD = 0.05;

  for ( let n = 0; n < result.waveFunctions.length; n++ ) {
    const psi = result.waveFunctions[ n ];
    const N = psi.length;

    const psiJump = maxPsiJump( psi, skipEdgePoints, N - 1 - skipEdgePoints );
    assert.ok( psiJump < PSI_JUMP_THRESHOLD,
      `${label} state ${n}: ψ jump = ${psiJump.toExponential( 2 )} must be < ${PSI_JUMP_THRESHOLD}` );

    // Derivative array has N-2 elements (interior points); skip skipEdgePoints at each end.
    const dPsiJump = maxDPsiJump( psi, dx, skipEdgePoints, N - 2 - skipEdgePoints );
    assert.ok( dPsiJump < DPSI_JUMP_THRESHOLD,
      `${label} state ${n}: ψ' jump = ${dPsiJump.toExponential( 2 )} must be < ${DPSI_JUMP_THRESHOLD}` );
  }
}
