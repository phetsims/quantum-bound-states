// Copyright 2026, University of Colorado Boulder

/**
 * WaveFunctionGraph is the model for the Wave Function graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QBSGraph from './QBSGraph.js';

export default class WaveFunctionGraph extends QBSGraph {

  public constructor( tandem: Tandem ) {
    super( tandem );
  }
}

quantumBoundStates.register( 'WaveFunctionGraph', WaveFunctionGraph );