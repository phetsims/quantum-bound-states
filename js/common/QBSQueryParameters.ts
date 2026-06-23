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

  // Number of sample points for approximating each curve
  numberOfPoints: {
    type: 'number',
    isValidValue: value => value > 0,
    // This value was arrived at by experimenting and provides a nice tradeoff between smoothness of the curve and performance.
    defaultValue: 3001 //TODO Decide what the optimal value should be.
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
  realPartSelected: {
    type: 'boolean',
    defaultValue: true
  },

  // Initial value of the 'Imaginary Part' checkbox
  imaginaryPartSelected: {
    type: 'boolean',
    defaultValue: true //TODO should be false
  },

  // Initial value of the 'Magnitude' checkbox
  magnitudeSelected: {
    type: 'boolean',
    defaultValue: true //TODO should be false
  },

  // Initial value of the 'Phase' checkbox
  phaseSelected: {
    type: 'boolean',
    defaultValue: false
  },

  // Chooses the mapping of phase to color.
  phaseToColor: {
    type: 'string',
    validValues: [ 'twilight', 'rainbow' ],
    defaultValue: 'twilight'
  }
} );

// Log query parameters
logGlobal( 'phet.chipper.queryParameters' );
logGlobal( 'phet.preloads.phetio.queryParameters' );
phet.log && phet.log( `QBSQueryParameters: ${JSON.stringify( QBSQueryParameters, null, 2 )}` );

export default QBSQueryParameters;
