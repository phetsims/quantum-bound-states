// Copyright 2026, University of Colorado Boulder

/**
 * AverageProbabilityDensityOfBandGraph is the model for the 'Average Probability Density of Band' graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QBSGraph from './QBSGraph.js';

export default class AverageProbabilityDensityOfBandGraph extends QBSGraph {

  public constructor( tandem: Tandem ) {
    super( tandem );
  }
}

quantumBoundStates.register( 'AverageProbabilityDensityOfBandGraph', AverageProbabilityDensityOfBandGraph );