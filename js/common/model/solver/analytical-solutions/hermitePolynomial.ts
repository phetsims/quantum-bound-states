// Copyright 2026, University of Colorado Boulder

//TODO Move to dot/js/util/
/**
 * Calculates the Hermite polynomial H_n(x) using recurrence relation.
 * H_0(x) = 1
 * H_1(x) = 2x
 * H_(n+1)(x) = 2x*H_n(x) - 2n*H_(n-1)(x)
 *
 * @author Martin Veillette
 */
export default function hermitePolynomial( n: number, x: number ): number {
  if ( n === 0 ) {
    return 1;
  }
  if ( n === 1 ) {
    return 2 * x;
  }

  let H_prev = 1;
  let H_curr = 2 * x;

  for ( let i = 1; i < n; i++ ) {
    const H_next = 2 * x * H_curr - 2 * i * H_prev;
    H_prev = H_curr;
    H_curr = H_next;
  }

  return H_curr;
}
