// Copyright 2025-2026, University of Colorado Boulder

/**
 * ManyWellsModel is the top-level model for the 'Many Wells' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import FiniteSquarePotential from '../../common/model/potentials/FiniteSquarePotential.js';
import QBSModel from '../../common/model/QBSModel.js';
import quantumBoundStates from '../../quantumBoundStates.js';

export default class ManyWellsModel extends QBSModel {

  public constructor( tandem: Tandem ) {

    const potentialsTandem = tandem.createTandem( 'potentials' );
    const finiteSquarePotential = new FiniteSquarePotential( potentialsTandem.createTandem( 'finiteSquarePotential' ) );

    super( {
      potential: finiteSquarePotential,
      potentials: [ finiteSquarePotential ],
      quantumStateRepresentation: 'averageProbabilityDensityOfBand',
      quantumStateRepresentations: [ 'averageProbabilityDensityOfBand', 'probabilityDensity', 'waveFunction' ],
      tandem: tandem
    } );
  }
}

quantumBoundStates.register( 'ManyWellsModel', ManyWellsModel );