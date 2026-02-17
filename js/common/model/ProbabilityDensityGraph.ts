// Copyright 2026, University of Colorado Boulder

/**
 * ProbabilityDensityGraph is the model for the Probability Density graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QBSGraph from './QBSGraph.js';

export default class ProbabilityDensityGraph extends QBSGraph {

  public constructor( tandem: Tandem ) {
    super( tandem );
  }
}

quantumBoundStates.register( 'ProbabilityDensityGraph', ProbabilityDensityGraph );