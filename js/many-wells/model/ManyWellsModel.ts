// Copyright 2025-2026, University of Colorado Boulder

/**
 * ManyWellsModel is the top-level model for the 'Many Wells' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import FiniteSquareWell from '../../common/model/potentials/FiniteSquareWell.js';
import QBSModel from '../../common/model/QBSModel.js';
import quantumBoundStates from '../../quantumBoundStates.js';

export default class ManyWellsModel extends QBSModel {

  public constructor( tandem: Tandem ) {

    const squareFiniteWell = new FiniteSquareWell( tandem.createTandem( 'squareFiniteWell' ) );

    super( {
      potential: squareFiniteWell,
      potentials: [ squareFiniteWell ],
      graphType: 'averageProbabilityDensityOfBand',
      graphTypes: [ 'averageProbabilityDensityOfBand', 'probabilityDensity', 'waveFunction' ],
      tandem: tandem
    } );
  }
}

quantumBoundStates.register( 'ManyWellsModel', ManyWellsModel );