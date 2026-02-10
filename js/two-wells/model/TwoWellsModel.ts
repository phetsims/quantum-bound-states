// Copyright 2025-2026, University of Colorado Boulder

/**
 * TwoWellsModel is the top-level model for the 'Two Wells' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import FiniteSquareWell from '../../common/model/potentials/FiniteSquareWell.js';
import QBSModel from '../../common/model/QBSModel.js';
import quantumBoundStates from '../../quantumBoundStates.js';

export default class TwoWellsModel extends QBSModel {

  public constructor( tandem: Tandem ) {

    const squareFiniteWell = new FiniteSquareWell( tandem.createTandem( 'squareFiniteWell' ) );

    super( {
      potential: squareFiniteWell,
      potentials: [ squareFiniteWell ],
      graphType: 'probabilityDensity',
      graphTypes: [ 'probabilityDensity', 'waveFunction' ],
      tandem: tandem
    } );
  }
}

quantumBoundStates.register( 'TwoWellsModel', TwoWellsModel );