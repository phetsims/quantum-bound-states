// Copyright 2025-2026, University of Colorado Boulder

/**
 * OneWellModel is the top-level model for the 'One Well' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import QBSModel from '../../common/model/QBSModel.js';
import SquareFiniteWell from '../../common/model/wells/SquareFiniteWell.js';
import SquareInfiniteWell from '../../common/model/wells/SquareInfiniteWell.js';
import quantumBoundStates from '../../quantumBoundStates.js';

export default class OneWellModel extends QBSModel {

  public constructor( tandem: Tandem ) {

    const squareFiniteWell = new SquareFiniteWell( tandem.createTandem( 'squareFiniteWell' ) );
    const squareInfiniteWell = new SquareInfiniteWell( tandem.createTandem( 'squareInfiniteWell' ) );

    super( {
      potentialWell: squareFiniteWell,
      potentialWells: [ squareFiniteWell, squareInfiniteWell ],
      graphType: 'probabilityDensity',
      graphTypes: [ 'probabilityDensity', 'waveFunction' ],
      tandem: tandem
    } );
  }
}

quantumBoundStates.register( 'OneWellModel', OneWellModel );