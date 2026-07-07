// Copyright 2026, University of Colorado Boulder

/**
 * CustomSuperpositionState is a superposition state whose coefficients can be customized.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import SuperpositionCoefficient from '../../common/model/SuperpositionCoefficient.js';
import SuperpositionState, { SuperpositionStateOptions } from '../../common/model/SuperpositionState.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';

export const CoefficientFormatValues = [ 'amplitude', 'magnitudeAndPhase' ] as const;
export type CoefficientFormat = ( typeof CoefficientFormatValues )[number];

type SelfOptions = EmptySelfOptions;

type CustomSuperpositionStateOptions = SelfOptions & SuperpositionStateOptions;

export default class CustomSuperpositionState extends SuperpositionState {

  // Every Custom state has this many coefficients.
  public static readonly NUMBER_OF_COEFFICIENTS = 48;

  // The format that will be used to display the coefficients in the Custom Superposition State dialog.
  // Included in the model for convenience.
  public readonly coefficientFormatProperty: Property<CoefficientFormat>;

  public constructor( providedOptions: CustomSuperpositionStateOptions ) {

    const options = providedOptions;

    const coefficients = [
      new SuperpositionCoefficient( 0.72, 0 ),
      new SuperpositionCoefficient( 0.72, 0 )
    ];
    for ( let i = coefficients.length; i < CustomSuperpositionState.NUMBER_OF_COEFFICIENTS; i++ ) {
       coefficients.push( SuperpositionCoefficient.ZERO_COEFFICIENT );
    }

    super( coefficients, options );

    this.normalize();

    this.coefficientFormatProperty = new StringUnionProperty( 'amplitude', {
      validValues: CoefficientFormatValues,
      tandem: options.tandem.createTandem( 'coefficientFormatProperty' )
    } );
  }

  //TODO Is this being called?
  public override reset(): void {
    super.reset();
    this.coefficientFormatProperty.reset();
  }

  /**
   * Override to verify that Custom states always have the same fixed number of coefficients.
   */
  public override setCoefficients( coefficients: SuperpositionCoefficient[] ): void {
    affirm( coefficients.length === CustomSuperpositionState.NUMBER_OF_COEFFICIENTS, `coefficients.length must be ${CustomSuperpositionState.NUMBER_OF_COEFFICIENTS}` );
    super.setCoefficients( coefficients );
  }

  /**
   * Creates the complete set of custom superposition states.
   */
  public static createStates( parentTandem: Tandem ): CustomSuperpositionState[] {
    let customIndex = 1;
    return [
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