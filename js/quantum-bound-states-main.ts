// Copyright 2025, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PreferencesModel from '../../joist/js/preferences/PreferencesModel.js';
import Sim, { SimOptions } from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import QBSConstants from './common/QBSConstants.js';
import ManyWellsScreen from './many-wells/ManyWellsScreen.js';
import OneWellScreen from './one-well/OneWellScreen.js';
import QuantumBoundStatesStrings from './QuantumBoundStatesStrings.js';
import './common/QBSQueryParameters.js';
import TwoWellsScreen from './two-wells/TwoWellsScreen.js';

simLauncher.launch( () => {

  const titleStringProperty = QuantumBoundStatesStrings[ 'quantum-bound-states' ].titleStringProperty;

  const screens = [
    new OneWellScreen( Tandem.ROOT.createTandem( 'oneWellScreen' ) ),
    new TwoWellsScreen( Tandem.ROOT.createTandem( 'twoWellsScreen' ) ),
    new ManyWellsScreen( Tandem.ROOT.createTandem( 'manyWellsScreen' ) )
  ];

  const options: SimOptions = {
    credits: QBSConstants.CREDITS,
    preferencesModel: new PreferencesModel( {
      visualOptions: {
        supportsProjectorMode: true
      }
    } )
  };

  const sim = new Sim( titleStringProperty, screens, options );
  sim.start();
} );