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
 * Skips the outermost 10 % of the array to avoid counting boundary effects.
 *
 * @param psi - Wave function array
 * @returns Number of interior nodes
 */
export function countNodes( psi: number[] ): number {
  const N = psi.length;

  // Skip boundary regions (first and last 10% to be safe)
  const skipPoints = Math.floor( N * 0.1 );

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
