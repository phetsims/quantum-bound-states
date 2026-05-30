// Copyright 2026, University of Colorado Boulder

/**
 * ReferenceLineDescriber creates core descriptions for the Reference Line.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import FluentUtils from '../../../../../chipper/js/browser/FluentUtils.js';
import { toFixed } from '../../../../../dot/js/util/toFixed.js';
import { toFixedNumber } from '../../../../../dot/js/util/toFixedNumber.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import QBSModel from '../../model/QBSModel.js';
import QBSConstants from '../../QBSConstants.js';

export default class ReferenceLineDescriber {

  //TODO elimate coupling to QBSModel? Or is that OK/necessary for description?
  public constructor( private readonly model: QBSModel ) {
    // All fields are defined and initialized via constructor params.
  }

  public getAccessibleObjectResponse(): string {

    const x = this.model.referenceLine.xProperty.value;

    // Create an ordered list of the phrases that will be joined to form the accessible response.
    // Start with the phrases that are always present.
    const phrases = [
      QuantumBoundStatesFluent.a11y.referenceLine.accessibleObjectResponse.positionPhrase.format( {
        value: toFixedNumber( x, QBSConstants.X_DECIMAL_PLACES )
      } ),
      QuantumBoundStatesFluent.a11y.referenceLine.accessibleObjectResponse.potentialEnergyPhrase.format( {
        value: potentialEnergyToString( this.model.getPotentialEnergyAt( x ) )
      } )
    ];

    // Add the phrases that conditionally present, based on the selected graph and which plots are visible.
    if ( this.model.curvesVisibleProperty.value ) {
      if ( this.model.selectedGraphProperty.value === this.model.probabilityDensityGraph ) {
        phrases.push( QuantumBoundStatesFluent.a11y.referenceLine.accessibleObjectResponse.probabilityDensityPhrase.format( {
          value: toFixedNumber( this.model.getProbabilityDensityAt( x ), QBSConstants.PROBABILITY_DENSITY_DECIMAL_PLACES )
        } ) );
      }
      else if ( this.model.selectedGraphProperty.value === this.model.waveFunctionGraph ) {

        if ( this.model.waveFunctionGraph.realPartVisibleProperty.value ) {
          phrases.push( QuantumBoundStatesFluent.a11y.referenceLine.accessibleObjectResponse.realPartPhrase.format( {
            value: toFixedNumber( this.model.getRealPartAt( x ), QBSConstants.REAL_PART_DECIMAL_PLACES )
          } ) );
        }

        if ( this.model.waveFunctionGraph.imaginaryPartVisibleProperty.value ) {
          phrases.push( QuantumBoundStatesFluent.a11y.referenceLine.accessibleObjectResponse.imaginaryPartPhrase.format( {
            value: toFixedNumber( this.model.getImaginaryPartAt( x ), QBSConstants.IMAGINARY_PART_DECIMAL_PLACES )
          } ) );
        }

        if ( this.model.waveFunctionGraph.magnitudeVisibleProperty.value ) {
          phrases.push( QuantumBoundStatesFluent.a11y.referenceLine.accessibleObjectResponse.magnitudePhrase.format( {
            value: toFixedNumber( this.model.getMagnitudeAt( x ), QBSConstants.MAGNITUDE_DECIMAL_PLACES )
          } ) );
        }

        if ( this.model.waveFunctionGraph.magnitudeVisibleProperty.value && this.model.waveFunctionGraph.phaseVisibleProperty.value ) {
          phrases.push( QuantumBoundStatesFluent.a11y.referenceLine.accessibleObjectResponse.phasePhrase.format( {
            value: toFixedNumber( this.model.getPhaseAt( x ), QBSConstants.PHASE_DECIMAL_PLACES )
          } ) );
        }
      }
    }

    return FluentUtils.joinFirstAndSecond( QuantumBoundStatesFluent.a11y.referenceLine.accessibleObjectResponse.joinPattern, phrases );
  }
}

/**
 * Maps a potential energy value to a core-description string, accounting for infinite values.
 */
function potentialEnergyToString( potentialEnergy: number ): string | number {
  if ( potentialEnergy === QBSConstants.EFFECTIVELY_INFINITE_POTENTIAL_ENERGY ) {
    return QuantumBoundStatesFluent.a11y.values.positiveInfinityStringProperty.value;
  }
  else if ( potentialEnergy === -QBSConstants.EFFECTIVELY_INFINITE_POTENTIAL_ENERGY ) {
    return QuantumBoundStatesFluent.a11y.values.negativeInfinityStringProperty.value;
  }
  else {
    return toFixed( potentialEnergy, QBSConstants.POTENTIAL_ENERGY_DECIMALS );
  }
}