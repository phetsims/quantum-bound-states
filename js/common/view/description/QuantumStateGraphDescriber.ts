// Copyright 2026, University of Colorado Boulder

/**
 * QuantumStateGraphDescriber creates core descriptions for the Quantum State Graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import QBSModel from '../../model/QBSModel.js';

export default class QuantumStateGraphDescriber {

  private constructor() {
    // Not intended for instantiation.
  }

  /**
   * Gets the dynamic description when the graph is displaying the Probability Density.
   */
  public static getProbabilityDensityDescription( model: QBSModel ): TReadOnlyProperty<string> {
    return QuantumBoundStatesFluent.a11y.quantumStateGraph.accessibleParagraph.probabilityDensity.createProperty( {
      energyLevelIndex: model.selectedEnergyLevelIndexProperty,
      numberOfNodes: model.probabilityDensityGraph.numberOfNodesProperty
    } );
  }

  /**
   * Gets the dynamic description when the graph is displaying the Wave Function.
   */
  public static getWaveFunctionDescription( model: QBSModel ): TReadOnlyProperty<string> {
    return QuantumBoundStatesFluent.a11y.quantumStateGraph.accessibleParagraph.waveFunction.createProperty( {
      energyLevelIndex: model.selectedEnergyLevelIndexProperty
    } );
  }
}