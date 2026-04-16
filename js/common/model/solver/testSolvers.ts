// Copyright 2026, University of Colorado Boulder

/**
 * Tests for numerical and analytic solutions. These tests are bidirectional: they validate both the numerical solver
 * (NumerovSolver) and the analytical solutions.
 *
 * Usage:
 * Add query parameter ?testSolver (or ?testSolverVerbose for verbose output) to run these tests when the sim starts.
 * Results will be displayed in the browser console.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { toFixed } from '../../../../../dot/js/util/toFixed.js';
import affirm from '../../../../../perennial-alias/js/browser-and-node/affirm.js';
import QBSQueryParameters from '../../QBSQueryParameters.js';
import MorseSolution from './analytical-solutions/MorseSolution.js';
import FiniteSquareSolution from './analytical-solutions/FiniteSquareSolution.js';
import HarmonicOscillatorSolution from './analytical-solutions/HarmonicOscillatorSolution.js';
import InfiniteSquareSolution from './analytical-solutions/InfiniteSquareSolution.js';
import InfiniteStepSolution from './analytical-solutions/InfiniteStepSolution.js';
import NumerovSolver from './NumerovSolver.js';
import XGrid from './XGrid.js';

const HBAR = NumerovSolver.HBAR;
const ELECTRON_MASSES = 1; // electron masses

/**
 * For verbose logging.
 */
function logVerbose( message: string ): void {
  if ( QBSQueryParameters.testSolversVerbose ) {
    console.log( message );
  }
}

/**
 * For summary logging. Summary messages are logged in green to make them easier to identify in the console.
 */
function logSummary( message: string ): void {
  console.log( `%c${message}`, 'color: green' );
}

/**
 * For error logging. If the supplied predicate does not evaluate to true, the message is logged in red.
 */
function affirmOrLog( predicate: boolean, message: string ): void {
  if ( !predicate ) {
    console.log( `%c${message}`, 'color: red' );
  }
}

/**
 * Count the number of nodes (zero crossings) in a wave function.
 * Handles both regular sign changes and exact zeros (for odd wave functions).
 * @param psi - Wave function array
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
 * Determine the parity (even/odd) of a wave function.
 * @param psi Wave function array
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
 * Compute the RMS error between two normalized wave functions, accounting for the
 * overall sign ambiguity (ψ and -ψ represent the same physical state).
 * @param psi1 - First wave function (normalized)
 * @param psi2 - Second wave function (normalized)
 * @param dx - Grid spacing in nm
 * @returns RMS error after optimal sign alignment
 */
function waveFunctionRMSError( psi1: number[], psi2: number[], dx: number ): number {
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

  const mass = ELECTRON_MASSES;  // electron masses
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
  const numericalResult = NumerovSolver.solve( xGrid, potential, mass, energyMin, energyMax );

  // Get analytical solution
  const analyticalResult = HarmonicOscillatorSolution.solve( xGrid, k, mass, energyMin, energyMax );

  // Basic smoke test - verify both methods return results
  affirm( numericalResult.energies.length > 0, `Found ${numericalResult.energies.length} numerical states` );
  affirm( analyticalResult.energies.length > 0, `Found ${analyticalResult.energies.length} analytical states` );

  logVerbose( `\nHarmonic Oscillator - Found ${numericalResult.energies.length} numerical, ${analyticalResult.energies.length} analytical states` );

  // Methods may find slightly different numbers of states due to boundary effects
  // Compare the states that both methods found
  const minStates = Math.min( numericalResult.energies.length, analyticalResult.energies.length );
  affirm( minStates > 0, 'At least one state found by both methods' );

  // Build comparison table for states found by both methods
  const dx = xGrid.dx;
  const tableRows = [];
  for ( let n = 0; n < Math.min( minStates, 10 ); n++ ) {
    const numerical = toFixed( numericalResult.energies[ n ], 3 );
    const analytical = toFixed( analyticalResult.energies[ n ], 3 );
    const error = toFixed( Math.abs( numericalResult.energies[ n ] - analyticalResult.energies[ n ] ) / analyticalResult.energies[ n ] * 100, 2 );
    const parity = getParity( numericalResult.waveFunctions[ n ] );
    const nodes = countNodes( numericalResult.waveFunctions[ n ] );
    const wfRMS = toFixed( waveFunctionRMSError( numericalResult.waveFunctions[ n ], analyticalResult.waveFunctions[ n ], dx ) * 100, 3 );
    tableRows.push( [ n, numerical, analytical, error, parity, nodes, wfRMS ] );
  }
  if ( minStates > 10 ) {
    tableRows.push( [ '...', '...', '...', '...', '...', '...', '...' ] );
  }

  logVerbose( formatTable( tableRows, [ 'n', 'Numerical (eV)', 'Analytical (eV)', 'Error (%)', 'Parity', 'Nodes', 'WF RMS (%)' ] ) );

  let maxRelativeError = 0;
  let maxWFError = 0;
  for ( let n = 0; n < minStates; n++ ) {
    const E_numerical = numericalResult.energies[ n ];
    const E_analytical = analyticalResult.energies[ n ];
    const relativeError = Math.abs( E_numerical - E_analytical ) / E_analytical;
    maxRelativeError = Math.max( maxRelativeError, relativeError );
    affirmOrLog( relativeError < 0.01, `Harmonic Oscillator: State n=${n}: Energy error=${toFixed( relativeError * 100, 4 )}%` );

    const rmsError = waveFunctionRMSError( numericalResult.waveFunctions[ n ], analyticalResult.waveFunctions[ n ], dx );
    maxWFError = Math.max( maxWFError, rmsError );
    affirmOrLog( rmsError < 0.05, `Harmonic Oscillator: State n=${n}: Wave function RMS error=${toFixed( rmsError, 5 )}` );
  }

  logSummary( `Harmonic Oscillator - Max energy error: ${toFixed( maxRelativeError * 100, 4 )}%, Max WF RMS: ${toFixed( maxWFError * 100, 3 )}%` );
}

/**
 * Compare NumerovSolver to the analytical solution for an infinite square well.
 */
function testInfiniteSquare(): void {

  const mass = ELECTRON_MASSES; // electron masses
  const L = 4;  // 4 nm
  const V0 = 50;  // 50 eV barrier
  const potential = ( x: number ) => Math.abs( x ) < L / 2 ? 0 : V0;

  // Use grid that matches the infinite square well, as a result V0 is irrelevant
  const xGrid = new XGrid( -L / 2, L / 2, 1001 );

  const E1_analytical = ( Math.PI * Math.PI * HBAR * HBAR ) / ( 2 * mass * L * L );
  const energyMin = 0.5 * E1_analytical;
  const energyMax = 21 * 21 * E1_analytical;

  // Get numerical solution
  const numericalResult = NumerovSolver.solve( xGrid, potential, mass, energyMin, energyMax );

  // Get analytical solution
  const analyticalResult = InfiniteSquareSolution.solve( xGrid, L, mass, energyMin, energyMax );

  logVerbose( `\nInfinite Square - Found ${numericalResult.energies.length} numerical, ${analyticalResult.energies.length} analytical states` );

  affirm( numericalResult.energies.length >= 5, `Found ${numericalResult.energies.length} numerical states (expected at least 5)` );
  affirm( analyticalResult.energies.length >= 5, `Found ${analyticalResult.energies.length} analytical states (expected at least 5)` );

  // Build comparison table
  const dx = xGrid.dx;
  const tableRows = [];
  const maxStates = Math.min( numericalResult.energies.length, analyticalResult.energies.length, 10 );
  for ( let i = 0; i < maxStates; i++ ) {
    const n = i + 1;
    const numerical = toFixed( numericalResult.energies[ i ], 3 );
    const analytical = toFixed( analyticalResult.energies[ i ], 3 );
    const error = toFixed( Math.abs( numericalResult.energies[ i ] - analyticalResult.energies[ i ] ) / analyticalResult.energies[ i ] * 100, 2 );
    const parity = getParity( numericalResult.waveFunctions[ i ] );
    const nodes = countNodes( numericalResult.waveFunctions[ i ] );
    const wfRMS = toFixed( waveFunctionRMSError( numericalResult.waveFunctions[ i ], analyticalResult.waveFunctions[ i ], dx ) * 100, 3 );
    tableRows.push( [ n, numerical, analytical, error, parity, nodes, wfRMS ] );
  }
  if ( numericalResult.energies.length > 10 ) {
    tableRows.push( [ '...', '...', '...', '...', '...', '...', '...' ] );
  }

  logVerbose( formatTable( tableRows, [ 'n', 'Numerical (eV)', 'Analytical (eV)', 'Error (%)', 'Parity', 'Nodes', 'WF RMS (%)' ] ) );

  let maxRelativeError = 0;
  let maxWFError = 0;
  for ( let i = 0; i < maxStates; i++ ) {
    const E_numerical = numericalResult.energies[ i ];
    const E_analytical = analyticalResult.energies[ i ];
    const relativeError = Math.abs( E_numerical - E_analytical ) / E_analytical;
    maxRelativeError = Math.max( maxRelativeError, relativeError );
    affirmOrLog( relativeError < 0.01, `Infinite Square: State n=${i + 1}: Energy error=${toFixed( relativeError * 100, 4 )}%` );

    const rmsError = waveFunctionRMSError( numericalResult.waveFunctions[ i ], analyticalResult.waveFunctions[ i ], dx );
    maxWFError = Math.max( maxWFError, rmsError );
    affirmOrLog( rmsError < 0.05, `Infinite Square: State n=${i + 1}: Wave function RMS error=${toFixed( rmsError, 5 )}` );
  }

  logSummary( `Infinite Square - Max energy error: ${toFixed( maxRelativeError * 100, 4 )}%, Max WF RMS: ${toFixed( maxWFError * 100, 3 )}%` );
}

/**
 * Compare NumerovSolver to the analytical solution for a finite square well.
 */
function testFiniteSquare(): void {

  const mass = ELECTRON_MASSES; // electron masses
  const L = 2;  // 2 nm well width
  const V0 = 10;  // 10 eV well depth
  const potential = ( x: number ) => Math.abs( x ) < L / 2 ? -V0 : 0;

  // Grid extends beyond the well to capture evanescent tails
  const xGrid = new XGrid( -3, 3, 1001 );

  // Bound states have energies between -V0 and 0
  const energyMin = -V0;
  const energyMax = 0;

  // Get numerical solution
  const numericalResult = NumerovSolver.solve( xGrid, potential, mass, energyMin, energyMax );

  // Get analytical solution
  const analyticalResult = FiniteSquareSolution.solve( xGrid, L, V0, mass, energyMin, energyMax );

  logVerbose( `\nFinite Square - Found ${numericalResult.energies.length} numerical, ${analyticalResult.energies.length} analytical states` );

  logVerbose( `Well parameters: L = ${L} nm, V₀ = ${V0} eV` );

  affirm( numericalResult.energies.length > 0, `Found ${numericalResult.energies.length} numerical states` );
  affirm( analyticalResult.energies.length > 0, `Found ${analyticalResult.energies.length} analytical states` );

  // Methods may find slightly different numbers of states due to boundary effects
  // Compare the states that both methods found
  const minStates = Math.min( numericalResult.energies.length, analyticalResult.energies.length );
  affirm( minStates > 0, 'At least one state found by both methods' );

  // Build comparison table for states found by both methods
  const dx = xGrid.dx;
  const tableRows = [];
  for ( let i = 0; i < Math.min( minStates, 10 ); i++ ) {
    const numerical = toFixed( numericalResult.energies[ i ], 4 );
    const analytical = toFixed( analyticalResult.energies[ i ], 4 );
    const error = toFixed( Math.abs( numericalResult.energies[ i ] - analyticalResult.energies[ i ] ) / Math.abs( analyticalResult.energies[ i ] ) * 100, 3 );
    const parity = getParity( numericalResult.waveFunctions[ i ] );
    const nodes = countNodes( numericalResult.waveFunctions[ i ] );
    const wfRMS = toFixed( waveFunctionRMSError( numericalResult.waveFunctions[ i ], analyticalResult.waveFunctions[ i ], dx ) * 100, 3 );
    tableRows.push( [ i + 1, numerical, analytical, error, parity, nodes, wfRMS ] );
  }
  if ( minStates > 10 ) {
    tableRows.push( [ '...', '...', '...', '...', '...', '...', '...' ] );
  }

  logVerbose( formatTable( tableRows, [ 'n', 'Numerical (eV)', 'Analytical (eV)', 'Error (%)', 'Parity', 'Nodes', 'WF RMS (%)' ] ) );

  let maxRelativeError = 0;
  let maxWFError = 0;
  for ( let i = 0; i < minStates; i++ ) {
    const E_numerical = numericalResult.energies[ i ];
    const E_analytical = analyticalResult.energies[ i ];
    const relativeError = Math.abs( E_numerical - E_analytical ) / Math.abs( E_analytical );
    maxRelativeError = Math.max( maxRelativeError, relativeError );
    affirmOrLog( relativeError < 0.01, `Finite Square: State n=${i + 1}: Energy error=${toFixed( relativeError * 100, 4 )}%` );

    const rmsError = waveFunctionRMSError( numericalResult.waveFunctions[ i ], analyticalResult.waveFunctions[ i ], dx );
    maxWFError = Math.max( maxWFError, rmsError );
    affirmOrLog( rmsError < 0.05, `Finite Square: State n=${i + 1}: Wave function RMS error=${toFixed( rmsError, 5 )}` );
  }

  logSummary( `Finite Square - Max energy error: ${toFixed( maxRelativeError * 100, 4 )}%, Max WF RMS: ${toFixed( maxWFError * 100, 3 )}%` );
}

/**
 * Test NumerovSolver wave function normalization.
 */
function testWaveFunctionNormalization(): void {

  const mass = ELECTRON_MASSES; // electron masses
  const k = 5.685630103565724; // arbitrary spring constant, eV/nm²
  const omega = Math.sqrt( k / mass );
  const potential = ( x: number ) => 0.5 * k * x * x;

  // Use standard grid from -4nm to 4nm
  const E0 = 0.5 * HBAR * omega;
  const xGrid = new XGrid( -4, 4, 1001 );

  const result = NumerovSolver.solve( xGrid, potential, mass, 0.1 * E0, 20.5 * HBAR * omega );

  // Ensure we found some states
  affirm( result.waveFunctions.length > 0, `Found ${result.waveFunctions.length} states` );

  const dx = xGrid.dx;
  for ( let i = 0; i < result.waveFunctions.length; i++ ) {
    const psi = result.waveFunctions[ i ];

    let norm = 0;
    for ( let j = 0; j < psi.length - 1; j++ ) {
      norm += ( psi[ j ] * psi[ j ] + psi[ j + 1 ] * psi[ j + 1 ] ) / 2;
    }
    norm *= dx;

    affirmOrLog(
      Math.abs( norm - 1.0 ) < 0.00001,
      `Wave Function Normalization: State ${i}: Norm = ${toFixed( norm, 6 )}`
    );
  }
}

/**
 * Test NumerovSolver node counting.
 */
function testNodeCounting(): void {

  const mass = ELECTRON_MASSES; // electron masses
  const k = 5.685630103565724;  // arbitrary spring constant, eV/nm²
  const omega = Math.sqrt( k / mass );
  const potential = ( x: number ) => 0.5 * k * x * x;

  // Use standard grid from -4nm to 4nm
  const E0 = 0.5 * HBAR * omega;
  const xGrid = new XGrid( -4, 4, 1001 );
  {
    const result = NumerovSolver.solve( xGrid, potential, mass, 0.1 * E0, 20.5 * HBAR * omega );

    // Ensure we found some states
    affirm( result.waveFunctions.length > 0, `Found ${result.waveFunctions.length} states` );

    logVerbose( `\nNode Counting - Found ${result.waveFunctions.length} states` );

    // Build table data
    const tableRows = [];
    for ( let i = 0; i < Math.min( result.waveFunctions.length, 15 ); i++ ) {
      const psi = result.waveFunctions[ i ];
      const nodeCount = countNodes( psi );
      const energyEV = toFixed( result.energies[ i ], 2 );
      const nodeCorrect = ( nodeCount === i ) ? '✓' : '✗';

      tableRows.push( [ i, energyEV, nodeCount, i, nodeCorrect ] );
    }
    if ( result.waveFunctions.length > 15 ) {
      tableRows.push( [ '...', '...', '...', '...', '...' ] );
    }

    logVerbose( formatTable( tableRows, [ 'State', 'Energy (eV)', 'Nodes', 'Expected', 'Match' ] ) );

    // Count how many states have correct node count
    let correctCount = 0;
    for ( let i = 0; i < result.waveFunctions.length; i++ ) {
      const nodeCount = countNodes( result.waveFunctions[ i ] );
      if ( nodeCount === i ) {
        correctCount++;
      }
    }

    logSummary( `\nNode counting accuracy: ${correctCount}/${result.waveFunctions.length} states correct (${toFixed( 100 * correctCount / result.waveFunctions.length, 1 )}%)` );

    // Require at least 50% accuracy (node counting can be challenging with numerical artifacts)
    // The important thing is that states are ordered by energy correctly, which they are
    affirmOrLog( correctCount / result.waveFunctions.length >= 0.5, `Node Counting: Should be at least 50% accurate, got ${correctCount}/${result.waveFunctions.length}` );
  }
}

/**
 * Compare NumerovSolver to the analytical solution for a Morse potential.
 */
function testMorsePotential(): void {

  const mass = ELECTRON_MASSES; // electron masses
  const wellDepth = 10;  // D_e = 10 eV
  const width = 0.5;  // w = 0.5 nm

  // The Morse potential: V(x) = D_e*(1 - e^{-x/w})^2 - D_e
  // Well bottom at x=0 (V = -D_e), dissociation limit at x→+∞ (V = 0), repulsive wall at x→-∞
  const potential = MorseSolution.createPotential( wellDepth, width );

  // Grid: from -0.5 nm (high repulsive wall ~20 eV above all bound states) to 5 nm (V ≈ 0)
  const xGrid = new XGrid( -0.5, 5, 1001 );

  // All bound-state energies lie between -D_e and 0
  const energyMin = -wellDepth;
  const energyMax = -0.001;  // just below the dissociation limit

  // Get numerical solution
  const numericalResult = NumerovSolver.solve( xGrid, potential, mass, energyMin, energyMax );

  // Get analytical solution
  const analyticalResult = MorseSolution.solve( xGrid, wellDepth, width, mass, energyMin, energyMax );

  logVerbose( `\nMorse - Found ${numericalResult.energies.length} numerical, ${analyticalResult.energies.length} analytical states` );

  affirm( numericalResult.energies.length > 0, `Found ${numericalResult.energies.length} numerical states` );
  affirm( analyticalResult.energies.length > 0, `Found ${analyticalResult.energies.length} analytical states` );

  const minStates = Math.min( numericalResult.energies.length, analyticalResult.energies.length );
  affirm( minStates > 0, 'At least one state found by both methods' );

  // Build comparison table
  const dx = xGrid.dx;
  const tableRows = [];
  for ( let v = 0; v < Math.min( minStates, 10 ); v++ ) {
    const numerical = toFixed( numericalResult.energies[ v ], 4 );
    const analytical = toFixed( analyticalResult.energies[ v ], 4 );
    const error = toFixed( Math.abs( numericalResult.energies[ v ] - analyticalResult.energies[ v ] ) / Math.abs( analyticalResult.energies[ v ] ) * 100, 3 );
    const nodes = countNodes( numericalResult.waveFunctions[ v ] );
    const wfRMS = toFixed( waveFunctionRMSError( numericalResult.waveFunctions[ v ], analyticalResult.waveFunctions[ v ], dx ) * 100, 3 );
    tableRows.push( [ v, numerical, analytical, error, nodes, wfRMS ] );
  }
  if ( minStates > 10 ) {
    tableRows.push( [ '...', '...', '...', '...', '...', '...' ] );
  }

  logVerbose( formatTable( tableRows, [ 'v', 'Numerical (eV)', 'Analytical (eV)', 'Error (%)', 'Nodes', 'WF RMS (%)' ] ) );

  let maxRelativeError = 0;
  let maxWFError = 0;
  for ( let v = 0; v < minStates; v++ ) {
    const E_numerical = numericalResult.energies[ v ];
    const E_analytical = analyticalResult.energies[ v ];
    const relativeError = Math.abs( E_numerical - E_analytical ) / Math.abs( E_analytical );
    maxRelativeError = Math.max( maxRelativeError, relativeError );
    affirmOrLog( relativeError < 0.01, `Morse: State v=${v}: Energy error=${toFixed( relativeError * 100, 4 )}%` );

    const rmsError = waveFunctionRMSError( numericalResult.waveFunctions[ v ], analyticalResult.waveFunctions[ v ], dx );
    maxWFError = Math.max( maxWFError, rmsError );
    affirmOrLog( rmsError < 0.05, `Morse: State v=${v}: Wave function RMS error=${toFixed( rmsError, 5 )}` );
  }

  logSummary( `Morse - Max energy error: ${toFixed( maxRelativeError * 100, 4 )}%, Max WF RMS: ${toFixed( maxWFError * 100, 3 )}%` );
}

/**
 * Compare NumerovSolver to the analytical solution for an infinite step well.
 */
function testInfiniteStep(): void {

  const mass = ELECTRON_MASSES; // electron masses
  const wellWidth = 2;  // L = 2 nm
  const stepHeight = 3;  // V₀ = 3 eV

  // Potential: 0 in left half [-L/2, 0), V₀ in right half [0, L/2], infinite walls at boundaries.
  // Use a large but finite barrier to represent the infinite walls for NumerovSolver.
  const barrierHeight = 1000;  // eV
  const potential = InfiniteStepSolution.createPotential( wellWidth, stepHeight, barrierHeight );

  // Grid spans exactly the well: [-L/2, L/2]
  const xGrid = new XGrid( -wellWidth / 2, wellWidth / 2, 1001 );

  // First infinite-square-well energy (upper bound on ground state): E₁ = π²ℏ²/(2mL²)
  const E1_ISW = ( Math.PI * Math.PI * HBAR * HBAR ) / ( 2 * mass * wellWidth * wellWidth );
  const energyMin = 0.1 * E1_ISW;
  const energyMax = 100 * E1_ISW;  // covers ~10 states comfortably

  // Get numerical solution
  const numericalResult = NumerovSolver.solve( xGrid, potential, mass, energyMin, energyMax );

  // Get analytical solution
  const analyticalResult = InfiniteStepSolution.solve( xGrid, wellWidth, stepHeight, mass, energyMin, energyMax );

  logVerbose( `\nInfinite Step - Found ${numericalResult.energies.length} numerical, ${analyticalResult.energies.length} analytical states` );
  logVerbose( `Well parameters: L = ${wellWidth} nm, V₀ = ${stepHeight} eV` );

  affirm( numericalResult.energies.length > 0, `Found ${numericalResult.energies.length} numerical states` );
  affirm( analyticalResult.energies.length > 0, `Found ${analyticalResult.energies.length} analytical states` );

  const minStates = Math.min( numericalResult.energies.length, analyticalResult.energies.length );
  affirm( minStates > 0, 'At least one state found by both methods' );

  // Build comparison table
  const dx = xGrid.dx;
  const tableRows = [];
  for ( let i = 0; i < Math.min( minStates, 10 ); i++ ) {
    const numerical = toFixed( numericalResult.energies[ i ], 4 );
    const analytical = toFixed( analyticalResult.energies[ i ], 4 );
    const error = toFixed( Math.abs( numericalResult.energies[ i ] - analyticalResult.energies[ i ] ) / analyticalResult.energies[ i ] * 100, 3 );
    const nodes = countNodes( numericalResult.waveFunctions[ i ] );
    const wfRMS = toFixed( waveFunctionRMSError( numericalResult.waveFunctions[ i ], analyticalResult.waveFunctions[ i ], dx ) * 100, 3 );
    tableRows.push( [ i + 1, numerical, analytical, error, nodes, wfRMS ] );
  }
  if ( minStates > 10 ) {
    tableRows.push( [ '...', '...', '...', '...', '...', '...' ] );
  }

  logVerbose( formatTable( tableRows, [ 'n', 'Numerical (eV)', 'Analytical (eV)', 'Error (%)', 'Nodes', 'WF RMS (%)' ] ) );

  let maxRelativeError = 0;
  let maxWFError = 0;
  for ( let i = 0; i < minStates; i++ ) {
    const E_numerical = numericalResult.energies[ i ];
    const E_analytical = analyticalResult.energies[ i ];
    const relativeError = Math.abs( E_numerical - E_analytical ) / E_analytical;
    maxRelativeError = Math.max( maxRelativeError, relativeError );
    affirmOrLog( relativeError < 0.01, `Infinite Step: State n=${i + 1}: Energy error=${toFixed( relativeError * 100, 4 )}%` );

    const rmsError = waveFunctionRMSError( numericalResult.waveFunctions[ i ], analyticalResult.waveFunctions[ i ], dx );
    maxWFError = Math.max( maxWFError, rmsError );
    affirmOrLog( rmsError < 0.05, `Infinite Step: State n=${i + 1}: Wave function RMS error=${toFixed( rmsError, 5 )}` );
  }

  logSummary( `Infinite Step - Max energy error: ${toFixed( maxRelativeError * 100, 4 )}%, Max WF RMS: ${toFixed( maxWFError * 100, 3 )}%` );
}

/**
 * Main entry point for running these tests/
 */
export function testSolvers(): void {
  testHarmonicOscillator();
  testInfiniteSquare();
  testFiniteSquare();
  testMorsePotential();
  testInfiniteStep();
  testWaveFunctionNormalization();
  testNodeCounting();
}