// Copyright 2026, University of Colorado Boulder

//TODO Move model stuff from ProbabilityDensityGraphNode to ProbabilityDensityGraph.
/**
 * ProbabilityDensityGraph is the model for the 'Probability Density' graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumStateGraph from './QuantumStateGraph.js';

export default class ProbabilityDensityGraph extends QuantumStateGraph {

  public constructor( tandem: Tandem ) {
    super( tandem );
  }
}
