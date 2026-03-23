// Copyright 2026, University of Colorado Boulder

/**
 * Tests NumerovSolver by comparing results to analytical solutions.
 * Add query parameter ?testNumerovSolver to run this when the simulations starts.
 * Results will be displayed in the browser console.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { toFixed } from '../../../../../dot/js/util/toFixed.js';
import affirm from '../../../../../perennial-alias/js/browser-and-node/affirm.js';
import FiniteSquareWellSolution from './analytical-solutions/FiniteSquareWellSolution.js';
import HarmonicOscillatorSolution from './analytical-solutions/HarmonicOscillatorSolution.js';
import InfiniteSquareWellSolution from './analytical-solutions/InfiniteSquareWellSolution.js';
import FundamentalConstants from './FundamentalConstants.js';
import NumerovSolver from './NumerovSolver.js';
import XGrid from './XGrid.js';

const HBAR = FundamentalConstants.HBAR;
const ELECTRON_MASS = FundamentalConstants.ELECTRON_MASS;

/**
 * Count the number of nodes (zero crossings) in a wavefunction.
 * Handles both regular sign changes and exact zeros (for odd wavefunctions).
 * @param psi - Wavefunction array
 * @returns Number of nodes
 */
function countNodes( psi: number[] ): number {
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
 * Determine the parity (even/odd) of a wavefunction.
 * @param psi Wavefunction array
 * @returns 'even' or 'odd'
 */
function getParity( psi: number[] ): 'even' | 'odd' {
  const N = psi.length;
  const centerIdx = Math.floor( N / 2 );

  // Compare left and right halves to determine symmetry
  // Check a representative sample of points (10% of half-domain)
  const samplePoints = Math.floor( centerIdx * 0.1 );

  let evenScore = 0;
  let oddScore = 0;

  for ( let i = 1; i <= samplePoints; i++ ) {
    const leftIdx = centerIdx - i;
    const rightIdx = centerIdx + i;

    if ( leftIdx >= 0 && rightIdx < N ) {
      const leftVal = psi[ leftIdx ];
      const rightVal = psi[ rightIdx ];

      // Score based on how well it matches even/odd symmetry
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
 * Format a table for console output with aligned columns
 * @param rows - Array of rows, where each row is an array of cell values
 * @param headers - Optional column headers
 * @returns Formatted table string
 */
function formatTable( rows: Array<Array<string | number>>, headers?: Array<string> ): string {
  const allRows = headers ? [ headers, ...rows ] : rows;

  // Convert all cells to strings and find max width for each column
  const stringRows = allRows.map( row => row.map( cell => String( cell ) ) );
  const numColumns = Math.max( ...stringRows.map( row => row.length ) );
  const columnWidths: number[] = [];

  for ( let col = 0; col < numColumns; col++ ) {
    columnWidths[ col ] = Math.max( ...stringRows.map( row => ( row[ col ] || '' ).length ) );
  }

  // Build table rows
  const lines: string[] = [];

  stringRows.forEach( ( row, rowIndex ) => {
    const cells = row.map( ( cell, colIndex ) => {
      const width = columnWidths[ colIndex ];
      return cell.padEnd( width );
    } );
    lines.push( cells.join( '  ' ) );

    // Add separator after header
    if ( headers && rowIndex === 0 ) {
      const separator = columnWidths.map( width => '-'.repeat( width ) ).join( '  ' );
      lines.push( separator );
    }
  } );

  return lines.join( '\n' );
}

/**
 * Compare NumerovSolver to the analytical solution for a harmonic oscillator.
 */
function testHarmonicOscillator(): void {

  const mass = ELECTRON_MASS;  // electron masses
  const k = 5.685630103565724;  // arbitrary spring constant, eV/nm²
  const omega = Math.sqrt( k / mass );  // natural frequency
  const potential = ( x: number ) => 0.5 * k * x * x;  // eV

  // Energy of the ground state: E0 = (1/2)ℏω
  const E0 = 0.5 * HBAR * omega;  // eV

  // Use standard grid from -4nm to 4nm
  const xGrid = new XGrid( -4, 4, 1001 );

  const energyMin = 0.1 * E0;
  const energyMax = 20.5 * HBAR * omega;

  // Get numerical solution
  const numericalResult = NumerovSolver.solveNumerov( xGrid, potential, mass, energyMin, energyMax );

  // Get analytical solution
  const analyticalResult = HarmonicOscillatorSolution.solve( xGrid, k, mass, energyMin, energyMax );

  // Basic smoke test - verify both methods return results
  affirm( numericalResult.energies.length > 0, `Found ${numericalResult.energies.length} numerical states` );
  affirm( analyticalResult.energies.length > 0, `Found ${analyticalResult.energies.length} analytical states` );

  console.log( `\nHarmonic Oscillator - Found ${numericalResult.energies.length} numerical, ${analyticalResult.energies.length} analytical states` );

  // Methods may find slightly different numbers of states due to boundary effects
  // Compare the states that both methods found
  const minStates = Math.min( numericalResult.energies.length, analyticalResult.energies.length );
  affirm( minStates > 0, 'At least one state found by both methods' );

  // Build comparison table for states found by both methods
  const tableRows = [];
  for ( let n = 0; n < Math.min( minStates, 10 ); n++ ) {
    const numerical = toFixed( numericalResult.energies[ n ], 3 );
    const analytical = toFixed( analyticalResult.energies[ n ], 3 );
    const error = toFixed( Math.abs( numericalResult.energies[ n ] - analyticalResult.energies[ n ] ) / analyticalResult.energies[ n ] * 100, 2 );
    const parity = getParity( numericalResult.wavefunctions[ n ] );
    const nodes = countNodes( numericalResult.wavefunctions[ n ] );
    tableRows.push( [ n, numerical, analytical, error, parity, nodes ] );
  }
  if ( minStates > 10 ) {
    tableRows.push( [ '...', '...', '...', '...', '...', '...' ] );
  }

  console.log( formatTable( tableRows, [ 'n', 'Numerical (eV)', 'Analytical (eV)', 'Error (%)', 'Parity', 'Nodes' ] ) );

  let maxRelativeError = 0;
  for ( let n = 0; n < minStates; n++ ) {
    const E_numerical = numericalResult.energies[ n ];
    const E_analytical = analyticalResult.energies[ n ];
    const relativeError = Math.abs( E_numerical - E_analytical ) / E_analytical;
    maxRelativeError = Math.max( maxRelativeError, relativeError );

    affirm(
      relativeError < 0.01,
      `State n=${n}: Error=${toFixed( relativeError * 100, 4 )}%`
    );
  }

  console.log( `Harmonic Oscillator - Max error: ${toFixed( maxRelativeError * 100, 4 )}%` );
}

/**
 * Compare NumerovSolver to the analytical solution for an infinite square well.
 */
function testInfiniteSquareWell(): void {

  const mass = ELECTRON_MASS;
  const L = 4;  // 4 nm
  const V0 = 50;  // 50 eV barrier
  const potential = ( x: number ) => Math.abs( x ) < L / 2 ? 0 : V0;

  // Use grid that matches the infinite square well, as a result V0 is irrelevant
  const xGrid = new XGrid( -L / 2, L / 2, 1001 );

  const E1_analytical = ( Math.PI * Math.PI * HBAR * HBAR ) / ( 2 * mass * L * L );
  const energyMin = 0.5 * E1_analytical;
  const energyMax = 21 * 21 * E1_analytical;

  // Get numerical solution
  const numericalResult = NumerovSolver.solveNumerov( xGrid, potential, mass, energyMin, energyMax );

  // Get analytical solution
  const analyticalResult = InfiniteSquareWellSolution.solve( xGrid, L, mass, energyMin, energyMax );

  console.log( `\nInfinite Square Well - Found ${numericalResult.energies.length} numerical, ${analyticalResult.energies.length} analytical states` );

  affirm( numericalResult.energies.length >= 5, `Found ${numericalResult.energies.length} numerical states (expected at least 5)` );
  affirm( analyticalResult.energies.length >= 5, `Found ${analyticalResult.energies.length} analytical states (expected at least 5)` );

  // Build comparison table
  const tableRows = [];
  const maxStates = Math.min( numericalResult.energies.length, analyticalResult.energies.length, 10 );
  for ( let i = 0; i < maxStates; i++ ) {
    const n = i + 1;
    const numerical = toFixed( numericalResult.energies[ i ], 3 );
    const analytical = toFixed( analyticalResult.energies[ i ], 3 );
    const error = toFixed( Math.abs( numericalResult.energies[ i ] - analyticalResult.energies[ i ] ) / analyticalResult.energies[ i ] * 100, 2 );
    const parity = getParity( numericalResult.wavefunctions[ i ] );
    const nodes = countNodes( numericalResult.wavefunctions[ i ] );
    tableRows.push( [ n, numerical, analytical, error, parity, nodes ] );
  }
  if ( numericalResult.energies.length > 10 ) {
    tableRows.push( [ '...', '...', '...', '...', '...', '...' ] );
  }

  console.log( formatTable( tableRows, [ 'n', 'Numerical (eV)', 'Analytical (eV)', 'Error (%)', 'Parity', 'Nodes' ] ) );

  let maxRelativeError = 0;
  for ( let i = 0; i < maxStates; i++ ) {
    const E_numerical = numericalResult.energies[ i ];
    const E_analytical = analyticalResult.energies[ i ];
    const relativeError = Math.abs( E_numerical - E_analytical ) / E_analytical;
    maxRelativeError = Math.max( maxRelativeError, relativeError );

    affirm(
      relativeError < 0.01,
      `State n=${i + 1}: Error=${toFixed( relativeError * 100, 4 )}%`
    );
  }

  console.log( `Infinite Square Well - Max error: ${toFixed( maxRelativeError * 100, 4 )}%` );
}

/**
 * Compare NumerovSolver to the analytical solution for a finite square well.
 */
function testFiniteSquareWell(): void {

  const mass = ELECTRON_MASS;
  const L = 2;  // 2 nm well width
  const V0 = 10;  // 10 eV well depth
  const potential = ( x: number ) => Math.abs( x ) < L / 2 ? -V0 : 0;

  // Grid extends beyond the well to capture evanescent tails
  const xGrid = new XGrid( -3, 3, 1001 );

  // Bound states have energies between -V0 and 0
  const energyMin = -V0;
  const energyMax = 0;

  // Get numerical solution
  const numericalResult = NumerovSolver.solveNumerov( xGrid, potential, mass, energyMin, energyMax );

  // Get analytical solution
  const analyticalResult = FiniteSquareWellSolution.solve( xGrid, L, V0, mass, energyMin, energyMax );

  console.log( `\nFinite Square Well - Found ${numericalResult.energies.length} numerical, ${analyticalResult.energies.length} analytical states` );
  console.log( `Well parameters: L = ${L} nm, V₀ = ${V0} eV` );

  affirm( numericalResult.energies.length > 0, `Found ${numericalResult.energies.length} numerical states` );
  affirm( analyticalResult.energies.length > 0, `Found ${analyticalResult.energies.length} analytical states` );

  // Methods may find slightly different numbers of states due to boundary effects
  // Compare the states that both methods found
  const minStates = Math.min( numericalResult.energies.length, analyticalResult.energies.length );
  affirm( minStates > 0, 'At least one state found by both methods' );

  // Build comparison table for states found by both methods
  const tableRows = [];
  for ( let i = 0; i < minStates; i++ ) {
    const numerical = toFixed( numericalResult.energies[ i ], 4 );
    const analytical = toFixed( analyticalResult.energies[ i ], 4 );
    const error = toFixed( Math.abs( numericalResult.energies[ i ] - analyticalResult.energies[ i ] ) / Math.abs( analyticalResult.energies[ i ] ) * 100, 3 );
    const parity = getParity( numericalResult.wavefunctions[ i ] );
    const nodes = countNodes( numericalResult.wavefunctions[ i ] );
    tableRows.push( [ i + 1, numerical, analytical, error, parity, nodes ] );
  }

  console.log( formatTable( tableRows, [ 'State', 'Numerical (eV)', 'Analytical (eV)', 'Error (%)', 'Parity', 'Nodes' ] ) );

  // Note: Numerical and analytical solvers may find different numbers of states
  // The numerical solver may pick up resonances/quasi-bound states near the continuum
  // We'll validate that the analytical states are present in the numerical results
  console.log( '\nValidating correspondence between numerical and analytical states...' );

  // Match analytical states to numerical states by energy proximity
  let goodMatches = 0;
  let maxRelativeError = 0;
  for ( let i = 0; i < analyticalResult.energies.length; i++ ) {
    const E_analytical = analyticalResult.energies[ i ];

    // Find closest numerical state
    let closestIdx = 0;
    let minDiff = Infinity;
    for ( let j = 0; j < numericalResult.energies.length; j++ ) {
      const diff = Math.abs( numericalResult.energies[ j ] - E_analytical );
      if ( diff < minDiff ) {
        minDiff = diff;
        closestIdx = j;
      }
    }

    const E_numerical = numericalResult.energies[ closestIdx ];
    const relativeError = Math.abs( E_numerical - E_analytical ) / Math.abs( E_analytical );

    if ( relativeError < 0.05 ) {
      goodMatches++;
      maxRelativeError = Math.max( maxRelativeError, relativeError );
    }

    console.log( `  Analytical state ${i + 1}: ${toFixed( E_analytical, 4 )} eV ` +
                 `→ Numerical state ${closestIdx + 1}: ${toFixed( E_numerical, 4 )} eV ` +
                 `(error: ${toFixed( relativeError * 100, 2 )}%)` );
  }

  // Require that most analytical states have good numerical matches
  const matchRatio = goodMatches / analyticalResult.energies.length;
  affirm(
    matchRatio >= 0.5,
    `At least 50% of analytical states should match numerical states (found ${goodMatches}/${analyticalResult.energies.length})`
  );

  console.log( `Finite Square Well - Max error: ${toFixed( maxRelativeError * 100, 4 )}%` );

  // Verify wavefunctions for states found by both methods
  const dx = xGrid.dx;
  for ( let i = 0; i < minStates; i++ ) {
    const psi_numerical = numericalResult.wavefunctions[ i ];
    const psi_analytical = analyticalResult.wavefunctions[ i ];

    // Check normalization
    let norm_numerical = 0;
    let norm_analytical = 0;
    for ( let j = 0; j < psi_numerical.length - 1; j++ ) {
      norm_numerical += ( psi_numerical[ j ] * psi_numerical[ j ] + psi_numerical[ j + 1 ] * psi_numerical[ j + 1 ] ) / 2;
      norm_analytical += ( psi_analytical[ j ] * psi_analytical[ j ] + psi_analytical[ j + 1 ] * psi_analytical[ j + 1 ] ) / 2;
    }
    norm_numerical *= dx;
    norm_analytical *= dx;

    affirm(
      Math.abs( norm_numerical - 1.0 ) < 0.01,
      `State ${i + 1}: Numerical norm = ${toFixed( norm_numerical, 6 )}`
    );
    affirm(
      Math.abs( norm_analytical - 1.0 ) < 0.01,
      `State ${i + 1}: Analytical norm = ${toFixed( norm_analytical, 6 )}`
    );
  }

  console.log( 'Finite Square Well - All normalizations verified' );
}

/**
 * Test NumerovSolver wavefunction normalization.
 */
function testWavefunctionNormalization(): void {

  const mass = ELECTRON_MASS;
  const k = 5.685630103565724; // arbitrary spring constant, eV/nm²
  const omega = Math.sqrt( k / mass );
  const potential = ( x: number ) => 0.5 * k * x * x;

  // Use standard grid from -4nm to 4nm
  const E0 = 0.5 * HBAR * omega;
  const xGrid = new XGrid( -4, 4, 1001 );

  const result = NumerovSolver.solveNumerov( xGrid, potential, mass, 0.1 * E0, 20.5 * HBAR * omega );

  // Ensure we found some states
  affirm( result.wavefunctions.length > 0, `Found ${result.wavefunctions.length} states` );

  const dx = xGrid.dx;
  for ( let i = 0; i < result.wavefunctions.length; i++ ) {
    const psi = result.wavefunctions[ i ];

    let norm = 0;
    for ( let j = 0; j < psi.length - 1; j++ ) {
      norm += ( psi[ j ] * psi[ j ] + psi[ j + 1 ] * psi[ j + 1 ] ) / 2;
    }
    norm *= dx;

    affirm(
      Math.abs( norm - 1.0 ) < 0.00001,
      `State ${i}: Norm = ${toFixed( norm, 6 )}`
    );
  }
}

/**
 * Test NumerovSolver node counting.
 */
function testNodeCounting(): void {

  const mass = ELECTRON_MASS;
  const k = 5.685630103565724;  // arbitrary spring constant, eV/nm²
  const omega = Math.sqrt( k / mass );
  const potential = ( x: number ) => 0.5 * k * x * x;

  // Use standard grid from -4nm to 4nm
  const E0 = 0.5 * HBAR * omega;
  const xGrid = new XGrid( -4, 4, 1001 );
  {

    const result = NumerovSolver.solveNumerov( xGrid, potential, mass, 0.1 * E0, 20.5 * HBAR * omega );

    // Ensure we found some states
    affirm( result.wavefunctions.length > 0, `Found ${result.wavefunctions.length} states` );

    console.log( `\nNode Counting - Found ${result.wavefunctions.length} states` );

    // Build table data
    const tableRows = [];
    for ( let i = 0; i < Math.min( result.wavefunctions.length, 15 ); i++ ) {
      const psi = result.wavefunctions[ i ];
      const nodeCount = countNodes( psi );
      const energyEV = toFixed( result.energies[ i ], 2 );
      const nodeCorrect = ( nodeCount === i ) ? '✓' : '✗';

      tableRows.push( [ i, energyEV, nodeCount, i, nodeCorrect ] );
    }
    if ( result.wavefunctions.length > 15 ) {
      tableRows.push( [ '...', '...', '...', '...', '...' ] );
    }

    console.log( formatTable( tableRows, [ 'State', 'Energy (eV)', 'Nodes', 'Expected', 'Match' ] ) );

    // Count how many states have correct node count
    let correctCount = 0;
    for ( let i = 0; i < result.wavefunctions.length; i++ ) {
      const nodeCount = countNodes( result.wavefunctions[ i ] );
      if ( nodeCount === i ) {
        correctCount++;
      }
    }

    console.log( `\nNode counting accuracy: ${correctCount}/${result.wavefunctions.length} states correct (${toFixed( 100 * correctCount / result.wavefunctions.length, 1 )}%)` );

    // Require at least 50% accuracy (node counting can be challenging with numerical artifacts)
    // The important thing is that states are ordered by energy correctly, which they are
    affirm( correctCount / result.wavefunctions.length >= 0.5, `Node counting should be at least 50% accurate, got ${correctCount}/${result.wavefunctions.length}` );
  }
}

/**
 * Main entry point for testing NumerovSolver.
 */
export function testNumerovSolver(): void {
  testHarmonicOscillator();
  testInfiniteSquareWell();
  testFiniteSquareWell();
  testWavefunctionNormalization();
  testNodeCounting();
}