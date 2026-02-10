// Copyright 2025-2026, University of Colorado Boulder

/**
 * ManyWellsModel is the top-level model for the 'Many Wells' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import QBSModel from '../../common/model/QBSModel.js';
import SquareFiniteWell from '../../common/model/wells/SquareFiniteWell.js';
import quantumBoundStates from '../../quantumBoundStates.js';

export default class ManyWellsModel extends QBSModel {

  public constructor( tandem: Tandem ) {

    const squareFiniteWell = new SquareFiniteWell( tandem.createTandem( 'squareFiniteWell' ) );

    super( {
      potentialWell: squareFiniteWell,
      potentialWells: [ squareFiniteWell ],
      graphType: 'averageProbabilityDensityOfBand',
      graphTypes: [ 'averageProbabilityDensityOfBand', 'probabilityDensity', 'waveFunction' ],
      tandem: tandem
    } );
  }
}

quantumBoundStates.register( 'ManyWellsModel', ManyWellsModel );