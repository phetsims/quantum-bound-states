// Copyright 2026, University of Colorado Boulder

/**
 * AverageProbabilityDensityOfBandGraph is the model for the 'Average Probability Density of Band' graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import QuantumStateGraph from './QuantumStateGraph.js';

export default class AverageProbabilityDensityOfBandGraph extends QuantumStateGraph {

  public constructor( tandem: Tandem ) {
    super( tandem );
  }

  //TODO Compute values using this algorithm from BSAverageProbabilityDensityPlotter.java updateProbabilityDensitySeries
  /**
   * Updates the probability density series to display
   * the average probability density of all selected energy levels
   * (those energy levels with non-zero superposition coefficients).
   * <p>
   * If energy levels E1, E2, E3 are selected, then average probability density is computed as:
   * <code>
   * ( |Psi1(x,t)|^2 + |Psi2(x,t)|^2 + |Psi3(x,t)|^2 ) / 3
   * </code>
   */
}
