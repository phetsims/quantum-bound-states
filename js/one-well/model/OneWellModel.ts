// Copyright 2025-2026, University of Colorado Boulder

/**
 * OneWellModel is the top-level model for the 'One Well' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import FiniteSquareWell from '../../common/model/potentials/FiniteSquareWell.js';
import InfiniteSquareWell from '../../common/model/potentials/InfiniteSquareWell.js';
import QBSModel from '../../common/model/QBSModel.js';
import quantumBoundStates from '../../quantumBoundStates.js';

export default class OneWellModel extends QBSModel {

  public constructor( tandem: Tandem ) {

    const squareFiniteWell = new FiniteSquareWell( tandem.createTandem( 'squareFiniteWell' ) );
    const squareInfiniteWell = new InfiniteSquareWell( tandem.createTandem( 'squareInfiniteWell' ) );

    super( {
      potential: squareFiniteWell,
      potentials: [ squareFiniteWell, squareInfiniteWell ],
      graphType: 'probabilityDensity',
      graphTypes: [ 'probabilityDensity', 'waveFunction' ],
      tandem: tandem
    } );
  }
}

quantumBoundStates.register( 'OneWellModel', OneWellModel );