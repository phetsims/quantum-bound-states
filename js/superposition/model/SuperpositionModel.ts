// Copyright 2025-2026, University of Colorado Boulder

/**
 * SuperpositionModel is the top-level model for the 'Superposition' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import QBSModel from '../../common/model/QBSModel.js';
import quantumBoundStates from '../../quantumBoundStates.js';

export default class SuperpositionModel extends QBSModel {

  public constructor( tandem: Tandem ) {
    super( {
      graphTypes: [ 'probabilityDensity', 'waveFunction' ],
      tandem: tandem
    } );
  }
}

quantumBoundStates.register( 'SuperpositionModel', SuperpositionModel );