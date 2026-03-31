// Copyright 2025-2026, University of Colorado Boulder

/**
 * QBSQueryParameters defines query parameters that are specific to this simulation.
 * Run with ?log to print query parameters and their values to the browser console at startup.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import logGlobal from '../../../phet-core/js/logGlobal.js';
import { QueryStringMachine } from '../../../query-string-machine/js/QueryStringMachineModule.js';

const QBSQueryParameters = QueryStringMachine.getAll( {

  //====================================================================================================================
  // public
  //====================================================================================================================

  // Whether the Phase checkbox is visible in the controls panel.
  phaseCheckboxVisible: {
    type: 'boolean',
    defaultValue: true, //TODO default should be false
    public: true
  },

  //====================================================================================================================
  // private - for internal use only
  //====================================================================================================================

  // Runs a test at startup that compares NumerovSolver to analytic solutions. Results are logged to the browser console.
  testNumerovSolver: {
    type: 'flag'
  },

  // Same as testNumerovSolver, but with verbose logging.
  testNumerovSolverVerbose: {
    type: 'flag'
  },

  // Initial value of the 'Values' checkbox
  valuesVisible: {
    type: 'boolean',
    defaultValue: true
  },

  // Initial value of the 'Magnifier' checkbox
  magnifierVisible: {
    type: 'boolean',
    defaultValue: false
  },

  // Initial value of the 'Reference Line' checkbox
  referenceLineVisible: {
    type: 'boolean',
    defaultValue: false
  },

  // Initial value of the 'Real Part' checkbox
  realPartVisible: {
    type: 'boolean',
    defaultValue: true
  },

  // Initial value of the 'Imaginary Part' checkbox
  imaginaryPartVisible: {
    type: 'boolean',
    defaultValue: false
  },

  // Initial value of the 'Magnitude' checkbox
  magnitudeVisible: {
    type: 'boolean',
    defaultValue: false
  },

  // Initial value of the 'Phase' checkbox
  phaseVisible: {
    type: 'boolean',
    defaultValue: false
  }
} );

// Log query parameters
logGlobal( 'phet.chipper.queryParameters' );
logGlobal( 'phet.preloads.phetio.queryParameters' );
phet.log && phet.log( `QBSQueryParameters: ${JSON.stringify( QBSQueryParameters, null, 2 )}` );

export default QBSQueryParameters;
