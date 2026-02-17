// Copyright 2026, University of Colorado Boulder

/**
 * EnergyGraph is the model for the 'Energy' graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QBSGraph from './QBSGraph.js';

export default class EnergyGraph extends QBSGraph {

  public constructor( tandem: Tandem ) {
    super( tandem );
  }
}

quantumBoundStates.register( 'EnergyGraph', EnergyGraph );