// Copyright 2026, University of Colorado Boulder

/**
 * WaveFunctionGraph is the model for the 'Wave Function' graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumStateGraph from './QuantumStateGraph.js';

export default class WaveFunctionGraph extends QuantumStateGraph {

  public constructor( tandem: Tandem ) {
    super( tandem );
  }
}

quantumBoundStates.register( 'WaveFunctionGraph', WaveFunctionGraph );