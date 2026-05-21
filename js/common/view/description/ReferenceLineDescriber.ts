// Copyright 2026, University of Colorado Boulder

/**
 * ReferenceLineDescriber creates accessible responses for the Reference Line.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import FluentUtils from '../../../../../chipper/js/browser/FluentUtils.js';
import { toFixed } from '../../../../../dot/js/util/toFixed.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import QuantumPotential from '../../model/potentials/QuantumPotential.js';
import QuantumStateGraph from '../../model/QuantumStateGraph.js';
import ReferenceLine from '../../model/ReferenceLine.js';
import WaveFunctionGraph from '../../model/WaveFunctionGraph.js';
import QBSConstants from '../../QBSConstants.js';

export default class ReferenceLineDescriber {

  public constructor( private readonly referenceLine: ReferenceLine,
                      private readonly potentialProperty: TReadOnlyProperty<QuantumPotential>,
                      private readonly selectedGraphProperty: TReadOnlyProperty<QuantumStateGraph>,
                      private readonly probabilityDensityGraph: QuantumStateGraph,
                      private readonly waveFunctionGraph: WaveFunctionGraph
  ) {
    // All fields are defined and initialized via constructor params.
  }

  public getAccessibleObjectResponse(): string {

    // Create an ordered list of the phrases that will be joined to form the accessible response.
    // Start with the phrases that are always present.
    const phrases = [
      QuantumBoundStatesFluent.a11y.referenceLine.accessibleObjectResponse.positionPhrase.format( {
        value: toFixed( this.referenceLine.xProperty.value, QBSConstants.X_DECIMAL_PLACES )
      } ),
      QuantumBoundStatesFluent.a11y.referenceLine.accessibleObjectResponse.potentialEnergyPhrase.format( {
        value: 0 // TODO
      } )
    ];

    // Add the phrases that conditionally present, based on the selected graph and which plots are visible.
    if ( this.selectedGraphProperty.value === this.probabilityDensityGraph ) {
      phrases.push( QuantumBoundStatesFluent.a11y.referenceLine.accessibleObjectResponse.probabilityDensityPhrase.format( {
        value: 0 // TODO
      } ) );
    }
    else if ( this.selectedGraphProperty.value === this.waveFunctionGraph ) {

      if ( this.waveFunctionGraph.realPartVisibleProperty.value ) {
        phrases.push( QuantumBoundStatesFluent.a11y.referenceLine.accessibleObjectResponse.realPartPhrase.format( {
          value: 0 //TODO
        } ) );
      }
      if ( this.waveFunctionGraph.imaginaryPartVisibleProperty.value ) {
        phrases.push( QuantumBoundStatesFluent.a11y.referenceLine.accessibleObjectResponse.imaginaryPartPhrase.format( {
          value: 0 //TODO
        } ) );
      }

      if ( this.waveFunctionGraph.magnitudeVisibleProperty.value ) {
        phrases.push( QuantumBoundStatesFluent.a11y.referenceLine.accessibleObjectResponse.magnitudePhrase.format( {
          value: 0 //TODO
        } ) );
      }
    }

    return FluentUtils.joinFirstAndSecond( QuantumBoundStatesFluent.a11y.referenceLine.accessibleObjectResponse.joinPattern, phrases );
  }
}