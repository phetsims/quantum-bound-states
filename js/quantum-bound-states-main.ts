// Copyright 2025-2026, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PreferencesModel from '../../joist/js/preferences/PreferencesModel.js';
import Sim, { SimOptions } from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import { testNumerovSolver } from './common/model/solver/testNumerovSolver.js';
import QBSConstants from './common/QBSConstants.js';
import QBSQueryParameters from './common/QBSQueryParameters.js';
import QBSSimulationPreferencesNode from './common/view/QBSSimulationPreferencesNode.js';
import ManyWellsScreen from './many-wells/ManyWellsScreen.js';
import OneWellScreen from './one-well/OneWellScreen.js';
import QuantumBoundStatesFluent from './QuantumBoundStatesFluent.js';
import './common/QBSQueryParameters.js';
import SuperpositionScreen from './superposition/SuperpositionScreen.js';
import TwoWellsScreen from './two-wells/TwoWellsScreen.js';

simLauncher.launch( () => {

  const titleStringProperty = QuantumBoundStatesFluent[ 'quantum-bound-states' ].titleStringProperty;

  const screens = [
    new OneWellScreen( Tandem.ROOT.createTandem( 'oneWellScreen' ) ),
    new TwoWellsScreen( Tandem.ROOT.createTandem( 'twoWellsScreen' ) ),
    new ManyWellsScreen( Tandem.ROOT.createTandem( 'manyWellsScreen' ) ),
    new SuperpositionScreen( Tandem.ROOT.createTandem( 'superpositionScreen' ) )
  ];

  const options: SimOptions = {
    credits: QBSConstants.CREDITS,
    preferencesModel: new PreferencesModel( {
      simulationOptions: {
        customPreferences: [ {
          createContent: tandem => new QBSSimulationPreferencesNode( tandem.createTandem( 'content' ) )
        } ]
      }
    } )
  };

  const sim = new Sim( titleStringProperty, screens, options );
  sim.start();
  console.log( 'Quantum Bound States sim started' );

  // Compare NumerovSolver to analytical solutions.
  if ( QBSQueryParameters.testNumerovSolver || QBSQueryParameters.testNumerovSolverVerbose ) {
    testNumerovSolver();
  }
} );