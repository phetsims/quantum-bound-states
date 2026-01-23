// Copyright 2025, University of Colorado Boulder

/**
 * OneWellModel is the top-level model for the 'One Well' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import QBSModel from '../../common/model/QBSModel.js';
import quantumBoundStates from '../../quantumBoundStates.js';

export default class OneWellModel extends QBSModel {

  public constructor( tandem: Tandem ) {
    super( tandem );
  }
}

quantumBoundStates.register( 'OneWellModel', OneWellModel );