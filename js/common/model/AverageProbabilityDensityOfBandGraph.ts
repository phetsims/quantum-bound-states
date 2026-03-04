// Copyright 2026, University of Colorado Boulder

/**
 * AverageProbabilityDensityOfBandGraph is the model for the 'Average Probability Density of Band' graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumStateGraph from './QuantumStateGraph.js';

export default class AverageProbabilityDensityOfBandGraph extends QuantumStateGraph {

  public constructor( tandem: Tandem ) {
    super( tandem );
  }
}

quantumBoundStates.register( 'AverageProbabilityDensityOfBandGraph', AverageProbabilityDensityOfBandGraph );