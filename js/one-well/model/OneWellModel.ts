// Copyright 2025-2026, University of Colorado Boulder

/**
 * OneWellModel is the top-level model for the 'One Well' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import AnharmonicOscillatorPotential from '../../common/model/potentials/AnharmonicOscillatorPotential.js';
import AsymmetricTrianglePotential from '../../common/model/potentials/AsymmetricTrianglePotential.js';
import CoulombPotential from '../../common/model/potentials/CoulombPotential.js';
import FiniteSquarePotential from '../../common/model/potentials/FiniteSquarePotential.js';
import HarmonicOscillatorPotential from '../../common/model/potentials/HarmonicOscillatorPotential.js';
import InfiniteSquarePotential from '../../common/model/potentials/InfiniteSquarePotential.js';
import InfiniteStepPotential from '../../common/model/potentials/InfiniteStepPotential.js';
import QBSModel from '../../common/model/QBSModel.js';
import quantumBoundStates from '../../quantumBoundStates.js';

export default class OneWellModel extends QBSModel {

  public constructor( tandem: Tandem ) {

    const potentialsTandem = tandem.createTandem( 'potentials' );
    const potentials = [
      new FiniteSquarePotential( potentialsTandem.createTandem( 'finiteSquarePotential' ) ),
      new InfiniteSquarePotential( potentialsTandem.createTandem( 'infiniteSquarePotential' ) ),
      new InfiniteStepPotential( potentialsTandem.createTandem( 'infiniteStepPotential' ) ),
      new AsymmetricTrianglePotential( potentialsTandem.createTandem( 'asymmetricTrianglePotential' ) ),
      new HarmonicOscillatorPotential( potentialsTandem.createTandem( 'harmonicOscillatorPotential' ) ),
      new AnharmonicOscillatorPotential( potentialsTandem.createTandem( 'anharmonicOscillatorPotential' ) ),
      new CoulombPotential( potentialsTandem.createTandem( 'coulombPotential' ) )
    ];

    super( {
      potential: potentials[ 0 ],
      potentials: potentials,
      tandem: tandem
    } );
  }
}

quantumBoundStates.register( 'OneWellModel', OneWellModel );