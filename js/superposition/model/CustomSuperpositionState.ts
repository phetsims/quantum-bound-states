// Copyright 2026, University of Colorado Boulder

/**
 * CustomSuperpositionState is a superposition state whose coefficients can be customized.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import SuperpositionCoefficient from '../../common/model/SuperpositionCoefficient.js';
import SuperpositionState, { SuperpositionStateOptions } from '../../common/model/SuperpositionState.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';

type SelfOptions = EmptySelfOptions;

type CustomSuperpositionStateOptions = SelfOptions & SuperpositionStateOptions;

export default class CustomSuperpositionState extends SuperpositionState {

  public readonly numberOfCoefficientsProperty: NumberProperty;

  public constructor( providedOptions: CustomSuperpositionStateOptions ) {

    const options = providedOptions;

    //TODO Is this the correct initial value? A superposition state requires 2 non-zero coefficients.
    const coefficients = [
      SuperpositionCoefficient.GROUND_STATE_COEFFICIENT,
      SuperpositionCoefficient.ZERO_COEFFICIENT
    ];

    super( coefficients, providedOptions );

    this.numberOfCoefficientsProperty = new NumberProperty( coefficients.length, {
      range: new Range( 2, 50 ), // At least 2 coefficients are required for a superposition state.
      numberType: 'Integer',
      tandem: options.tandem.createTandem( 'numberOfCoefficientsProperty' )
    } );

    this.numberOfCoefficientsProperty.lazyLink( numberOfCoefficients => this.setNumberOfCoefficients( numberOfCoefficients ) );
  }

  /**
   * Creates the complete set of custom superposition states.
   */
  public static createStates( groundStateIndexProperty: TReadOnlyProperty<number>, parentTandem: Tandem ): CustomSuperpositionState[] {
    let customIndex = 1;
    return [
      //TODO Lots of work to do here.
      //TODO Is groundStateIndexProperty needed?
      new CustomSuperpositionState( {
        visualNameProperty: QuantumBoundStatesFluent.superpositionStates.custom1StringProperty,
        tandem: parentTandem.createTandem( `custom${customIndex++}` )
      } ),
      new CustomSuperpositionState( {
        visualNameProperty: QuantumBoundStatesFluent.superpositionStates.custom2StringProperty,
        tandem: parentTandem.createTandem( `custom${customIndex++}` )
      } ),
      new CustomSuperpositionState( {
        visualNameProperty: QuantumBoundStatesFluent.superpositionStates.custom3StringProperty,
        tandem: parentTandem.createTandem( `custom${customIndex++}` )
      } ),
      new CustomSuperpositionState( {
        visualNameProperty: QuantumBoundStatesFluent.superpositionStates.custom4StringProperty,
        tandem: parentTandem.createTandem( `custom${customIndex++}` )
      } ),
      new CustomSuperpositionState( {
        visualNameProperty: QuantumBoundStatesFluent.superpositionStates.custom5StringProperty,
        tandem: parentTandem.createTandem( `custom${customIndex++}` )
      } )
    ];
  }
}