// Copyright 2026, University of Colorado Boulder

/**
 * Browser-console regression tests for NumerovSolver multi-well edge cases.
 *
 * Analytical comparisons, normalization, and node-counting tests live in QBSSolverTests.ts
 * (QUnit / Continuous Testing). This file keeps regressions that are not yet in QUnit.
 *
 * Usage:
 * Add query parameter ?testSolvers (or ?testSolversVerbose for verbose output) to run these
 * tests when the sim starts. Results will be displayed in the browser console.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { toFixed } from '../../../../../dot/js/util/toFixed.js';
import affirm from '../../../../../perennial-alias/js/browser-and-node/affirm.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import QBSQueryParameters from '../../QBSQueryParameters.js';
import NumerovSolver from './NumerovSolver.js';
import XGrid from './XGrid.js';

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
 * Verify that the double square well produces exactly (anti-)symmetric wave functions.
 * The potential has two wells symmetric about x=0, so each eigenstate must be spatially
 * even (ψ(-x) = ψ(x)) or odd (ψ(-x) = -ψ(x)).
 *
 * The max antisymmetry residual:
 *   R = max_k |ψ[m+k] ∓ ψ[m-k]|  (where m is the center index)
 * should be zero (or at the level of float round-off) for both parities.
 */
function testDoubleSquareWell(): void {

  const mass = ELECTRON_MASSES; // electron masses
  const wellWidth = 1; // nm
  const wellDepth = 10; // eV
  const gap = 0.1; // nm, distance between the two walls
  const separation = wellWidth + gap; // nm, center-to-center

  // Symmetric double-well potential (same formula as FiniteSquarePotential.getPotentialEnergyAt)
  const potential = ( x: number ): number => {
    let pe = wellDepth;
    for ( let i = 1; i <= 2; i++ ) {
      const xi = separation * ( i - 1.5 );
      if ( x >= xi - wellWidth / 2 && x <= xi + wellWidth / 2 ) {
        pe = 0;
        break;
      }
    }
    return pe;
  };

  // Grid that matches the actual sim: xMin=-3.5, xMax=3.5, N=3001.
  const xGrid = new XGrid( {
    xMin: -3.5,
    xMax: 3.5,
    numberOfPoints: 3001,
    tandem: Tandem.OPT_OUT
  } );

  const result = NumerovSolver.solve( xGrid, potential, mass, 0, wellDepth );

  affirm( result.energies.length >= 2, `Double square well: expected at least 2 states, got ${result.energies.length}` );

  logVerbose( `\nDouble Square Well - Found ${result.energies.length} states` );

  // Use getClosestIndex to find the grid point nearest x=0, matching NumerovSolver's getMeetingPointIndex.
  const m = xGrid.getClosestIndex( ( xGrid.xMin + xGrid.xMax ) / 2 );
  logVerbose( `  Center index m=${m}, x[m]=${xGrid.xCoordinates[ m ]} nm` );
  let maxAsymmetry = 0;

  const tableRows = [];
  for ( let n = 0; n < result.energies.length; n++ ) {
    const psi = result.waveFunctions[ n ];
    const expectedParity = n % 2 === 0 ? 'even' : 'odd';
    const sign = expectedParity === 'even' ? 1 : -1;

    // Measure the largest deviation from (anti)symmetry: max_k |ψ[m+k] − sign·ψ[m-k]|
    let residual = 0;
    for ( let k = 1; m + k < xGrid.numberOfPoints; k++ ) {
      residual = Math.max( residual, Math.abs( psi[ m + k ] - sign * psi[ m - k ] ) );
    }
    maxAsymmetry = Math.max( maxAsymmetry, residual );

    tableRows.push( [ n, toFixed( result.energies[ n ], 4 ), expectedParity, residual.toExponential( 2 ) ] );

    affirmOrLog( residual < 1e-12,
      `Double Square Well: State n=${n} (${expectedParity}): symmetry residual = ${residual.toExponential( 4 )} (expected < 1e-12)` );
  }

  logVerbose( formatTable( tableRows, [ 'n', 'Energy (eV)', 'Parity', 'Sym residual' ] ) );
  logSummary( `Double Square Well - Max symmetry residual: ${maxAsymmetry.toExponential( 2 )} (0 = exact symmetry)` );
}

/**
 * Regression: large spacing in a symmetric double-well Poschl-Teller must not hang in EnergyRefiner.
 * At spacing ~2.25 nm the ground and first excited states are nearly degenerate, producing a micro-bracket
 * whose relative tolerance would fall below one ulp without the machine-epsilon floor.
 */
function testDoublePoschlTellerLargeSpacing(): void {

  const mass = ELECTRON_MASSES;
  const wellWidth = 0.3; // nm
  const wellDepth = 10; // eV
  const spacing = 2.25; // nm, center-to-center spacing (Two Wells screen default range)

  const potential = ( x: number ): number => {
    let pe = 0;
    for ( let i = 1; i <= 2; i++ ) {
      const xi = spacing * ( i - 1.5 );
      const coshValue = Math.cosh( ( x - xi ) / wellWidth );
      pe += -wellDepth / ( coshValue * coshValue );
    }
    return pe;
  };

  const xGrid = new XGrid( {
    xMin: -3.5,
    xMax: 3.5,
    numberOfPoints: 3001,
    tandem: Tandem.OPT_OUT
  } );

  const result = NumerovSolver.solve( xGrid, potential, mass, -30, 0 );

  affirm( result.energies.length >= 1,
    `Double Poschl-Teller (spacing=${spacing}): expected at least 1 state, got ${result.energies.length}` );
  affirm( Math.abs( result.energies[ 0 ] + 8.143 ) < 0.01,
    `Double Poschl-Teller ground state energy ~-8.143 eV, got ${result.energies[ 0 ]}` );

  logSummary( `Double Poschl-Teller (spacing=${spacing} nm) - Found ${result.energies.length} states, E0=${toFixed( result.energies[ 0 ], 4 )} eV` );
}

/**
 * Regression test for node-count bracketing in multiple separated finite square wells.
 */
function testMultipleFiniteSquareWells(): void {

  const mass = ELECTRON_MASSES; // electron masses
  const numberOfWells = 5;
  const wellWidth = 0.5; // nm
  const wellDepth = 10; // eV
  const separation = 0.1; // nm, distance between walls of adjacent wells
  const yOffset = 0; // eV

  const potential = ( x: number ): number => {
    const wellCenterSpacing = wellWidth + separation;
    let energy = yOffset + wellDepth;

    for ( let i = 1; i <= numberOfWells; i++ ) {
      const xi = wellCenterSpacing * ( i - ( ( numberOfWells + 1 ) / 2 ) );
      if ( x >= xi - wellWidth / 2 && x <= xi + wellWidth / 2 ) {
        energy = yOffset;
        break;
      }
    }

    return energy;
  };

  const xGrid = new XGrid( {
    xMin: -3.5,
    xMax: 3.5,
    numberOfPoints: 3001,
    tandem: Tandem.OPT_OUT
  } );

  const result = NumerovSolver.solve( xGrid, potential, mass, yOffset, yOffset + wellDepth );
  const expectedStates = 15;

  logVerbose( `\nMultiple Finite Square Wells - Found ${result.energies.length} numerical states` );

  const tableRows = [];
  for ( let i = 0; i < result.energies.length; i++ ) {
    tableRows.push( [ i, toFixed( result.energies[ i ], 4 ) ] );
  }
  logVerbose( formatTable( tableRows, [ 'State', 'Energy (eV)' ] ) );

  affirm( result.energies.length === expectedStates,
    `Multiple Finite Square Wells: Found ${result.energies.length} states, expected ${expectedStates}` );
  affirm( result.energies[ 0 ] < 1.5,
    `Multiple Finite Square Wells: Ground state should be in the first band, got ${toFixed( result.energies[ 0 ], 4 )} eV` );

  for ( let i = 1; i < result.energies.length; i++ ) {
    affirm( result.energies[ i ] > result.energies[ i - 1 ] + 1e-4,
      `Multiple Finite Square Wells: Energies ${i - 1} and ${i} should be distinct and increasing` );
  }

  logSummary( `Multiple Finite Square Wells - Found ${result.energies.length} distinct states` );
}

/**
 * Main entry point for running these tests.
 */
export function testSolvers(): void {
  testDoubleSquareWell();
  testDoublePoschlTellerLargeSpacing();
  testMultipleFiniteSquareWells();
}
