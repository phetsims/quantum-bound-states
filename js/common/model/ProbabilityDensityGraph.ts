// Copyright 2026, University of Colorado Boulder

//TODO Move model stuff from ProbabilityDensityGraphNode to ProbabilityDensityGraph.
/**
 * ProbabilityDensityGraph is the model for the 'Probability Density' graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSModel from './QBSModel.js';
import QuantumStateGraph from './QuantumStateGraph.js';

export default class ProbabilityDensityGraph extends QuantumStateGraph {

  public readonly probabilityDensityValuesProperty: TReadOnlyProperty<number[]>;

  public constructor( model: QBSModel, tandem: Tandem ) {

    super( tandem );

    this.probabilityDensityValuesProperty = new DerivedProperty(
      [ model.boundStateResultProperty, model.energyLevelProperty ],
      ( boundStateResult, energyLevel ) => {
        const groundStateIndex = model.potentialProperty.value.groundStateIndex;
        const waveFunctionsIndex = model.energyLevelProperty.value - groundStateIndex;
        const waveFunctions = model.boundStateResultProperty.value.waveFunctions;
        affirm( waveFunctionsIndex >= 0 && waveFunctions.length, `waveFunctionsIndex out of range: ${waveFunctionsIndex}` );
        return waveFunctions[ waveFunctionsIndex ].map( x => x * x );
      }
    );
  }
}
