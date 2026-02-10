// Copyright 2025-2026, University of Colorado Boulder

/**
 * OneWellModel is the top-level model for the 'One Well' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import FiniteSquarePotential from '../../common/model/potentials/FiniteSquarePotential.js';
import InfiniteSquarePotential from '../../common/model/potentials/InfiniteSquarePotential.js';
import QBSModel from '../../common/model/QBSModel.js';
import quantumBoundStates from '../../quantumBoundStates.js';

export default class OneWellModel extends QBSModel {

  public constructor( tandem: Tandem ) {

    const potentialsTandem = tandem.createTandem( 'potentials' );
    const finiteSquarePotential = new FiniteSquarePotential( potentialsTandem.createTandem( 'finiteSquarePotential' ) );
    const infiniteSquarePotential = new InfiniteSquarePotential( potentialsTandem.createTandem( 'infiniteSquarePotential' ) );

    super( {
      potential: finiteSquarePotential,
      potentials: [ finiteSquarePotential, infiniteSquarePotential ],
      graphType: 'probabilityDensity',
      graphTypes: [ 'probabilityDensity', 'waveFunction' ],
      tandem: tandem
    } );
  }
}

quantumBoundStates.register( 'OneWellModel', OneWellModel );