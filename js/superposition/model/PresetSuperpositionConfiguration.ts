// Copyright 2026, University of Colorado Boulder

/**
 * PresetSuperpositionConfiguration is a superposition configuration whose coefficients cannot be changed.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import SuperpositionCoefficient from '../../common/model/SuperpositionCoefficient.js';
import SuperpositionCoefficients from '../../common/model/SuperpositionCoefficients.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import SuperpositionConfiguration, { SuperpositionConfigurationOptions } from './SuperpositionConfiguration.js';

type SelfOptions = EmptySelfOptions;

type SuperpositionPresetOptions = SelfOptions &
  StrictOmit<SuperpositionConfigurationOptions, 'superpositionConfigurationType'>;

export default class PresetSuperpositionConfiguration extends SuperpositionConfiguration {

  private constructor( superpositionCoefficients: SuperpositionCoefficients, providedOptions: SuperpositionPresetOptions ) {

    const options = optionize<SuperpositionPresetOptions, SelfOptions, SuperpositionConfigurationOptions>()( {
      superpositionConfigurationType: 'preset'
    }, providedOptions );

    super( superpositionCoefficients, options );
  }

  public static createPresets( groundStateIndexProperty: TReadOnlyProperty<number>, parentTandem: Tandem ): PresetSuperpositionConfiguration[] {
    return [
      PresetSuperpositionConfiguration.createPreset1( groundStateIndexProperty, parentTandem ),
      PresetSuperpositionConfiguration.createPreset2( groundStateIndexProperty, parentTandem ),
      PresetSuperpositionConfiguration.createPreset3( groundStateIndexProperty, parentTandem ),
      PresetSuperpositionConfiguration.createPreset4( groundStateIndexProperty, parentTandem ),
      PresetSuperpositionConfiguration.createPresetLocalizedParticle( groundStateIndexProperty, parentTandem )
    ];
  }

  /**
   * Creates preset cΨ1 + cΨ2
   */
  private static createPreset1( groundStateIndexProperty: TReadOnlyProperty<number>, parentTandem: Tandem ): PresetSuperpositionConfiguration {

    const coefficients = new SuperpositionCoefficients( [
      new SuperpositionCoefficient( 0.71, 0 ),
      new SuperpositionCoefficient( 0.71, 0 )
    ] );

    return new PresetSuperpositionConfiguration( coefficients, {
      visualNameProperty: new DerivedStringProperty( [
        groundStateIndexProperty,
        QuantumBoundStatesFluent.superpositionConfigurations.preset1.groundState0StringProperty,
        QuantumBoundStatesFluent.superpositionConfigurations.preset1.groundState1StringProperty
      ], ( groundStateIndex, groundState0String, groundState1String ) => groundStateIndex === 0 ? groundState0String : groundState1String ),
      accessibleNameProperty: QuantumBoundStatesFluent.a11y.superpositionConfigurations.preset1.createProperty( {
        groundStateIndex: groundStateIndexProperty.derived( index => index === 0 ? 0 : 1 )
      } ),
      tandem: parentTandem.createTandem( 'preset1' )
    } );
  }

  /**
   * Creates preset cΨ1 + cΨ3
   */
  private static createPreset2( groundStateIndexProperty: TReadOnlyProperty<number>, parentTandem: Tandem ): PresetSuperpositionConfiguration {

    const coefficients = new SuperpositionCoefficients( [
      new SuperpositionCoefficient( 0.71, 0 ),
      SuperpositionCoefficient.ZERO_COEFFICIENT,
      new SuperpositionCoefficient( 0.71, 0 )
    ] );
    affirm( coefficients.isNormalized(), 'coefficients must be normalized' );

    return new PresetSuperpositionConfiguration( coefficients, {
      visualNameProperty: new DerivedStringProperty( [
        groundStateIndexProperty,
        QuantumBoundStatesFluent.superpositionConfigurations.preset2.groundState0StringProperty,
        QuantumBoundStatesFluent.superpositionConfigurations.preset2.groundState1StringProperty
      ], ( groundStateIndex, groundState0String, groundState1String ) => groundStateIndex === 0 ? groundState0String : groundState1String ),
      accessibleNameProperty: QuantumBoundStatesFluent.a11y.superpositionConfigurations.preset2.createProperty( {
        groundStateIndex: groundStateIndexProperty.derived( index => index === 0 ? 0 : 1 )
      } ),
      tandem: parentTandem.createTandem( 'preset2' )
    } );
  }

  /**
   * Creates preset cΨ1 - cΨ2
   */
  private static createPreset3( groundStateIndexProperty: TReadOnlyProperty<number>, parentTandem: Tandem ): PresetSuperpositionConfiguration {

    const coefficients = new SuperpositionCoefficients( [
      new SuperpositionCoefficient( 0.71, 0 ),
      new SuperpositionCoefficient( 0.71, 1 ) // 1 * Math.PI, which results in amplitude of -magnitude
    ] );
    affirm( coefficients.isNormalized(), 'coefficients must be normalized' );

    return new PresetSuperpositionConfiguration( coefficients, {
      visualNameProperty: new DerivedStringProperty( [
        groundStateIndexProperty,
        QuantumBoundStatesFluent.superpositionConfigurations.preset3.groundState0StringProperty,
        QuantumBoundStatesFluent.superpositionConfigurations.preset3.groundState1StringProperty
      ], ( groundStateIndex, groundState0String, groundState1String ) => groundStateIndex === 0 ? groundState0String : groundState1String ),
      accessibleNameProperty: QuantumBoundStatesFluent.a11y.superpositionConfigurations.preset3.createProperty( {
        groundStateIndex: groundStateIndexProperty.derived( index => index === 0 ? 0 : 1 )
      } ),
      tandem: parentTandem.createTandem( 'preset3' )
    } );
  }

  /**
   * Creates preset cΨ1 + cΨ2 + cΨ3
   */
  private static createPreset4( groundStateIndexProperty: TReadOnlyProperty<number>, parentTandem: Tandem ): PresetSuperpositionConfiguration {

    const coefficients = new SuperpositionCoefficients( [
      new SuperpositionCoefficient( 0.58, 0 ),
      new SuperpositionCoefficient( 0.58, 0 ),
      new SuperpositionCoefficient( 0.58, 0 )
    ] );
    affirm( coefficients.isNormalized(), 'coefficients must be normalized' );

    return new PresetSuperpositionConfiguration( coefficients, {
      visualNameProperty: new DerivedStringProperty( [
        groundStateIndexProperty,
        QuantumBoundStatesFluent.superpositionConfigurations.preset4.groundState0StringProperty,
        QuantumBoundStatesFluent.superpositionConfigurations.preset4.groundState1StringProperty
      ], ( groundStateIndex, groundState0String, groundState1String ) => groundStateIndex === 0 ? groundState0String : groundState1String ),
      accessibleNameProperty: QuantumBoundStatesFluent.a11y.superpositionConfigurations.preset4.createProperty( {
        groundStateIndex: groundStateIndexProperty.derived( index => index === 0 ? 0 : 1 )
      } ),
      tandem: parentTandem.createTandem( 'preset4' )
    } );
  }

  /**
   * Creates preset 'Localized Particle'
   */
  private static createPresetLocalizedParticle( groundStateIndexProperty: TReadOnlyProperty<number>, parentTandem: Tandem ): PresetSuperpositionConfiguration {

    const coefficients = new SuperpositionCoefficients( [
      //TODO What are the coefficients for Localized Particle?
      SuperpositionCoefficient.GROUND_STATE_COEFFICIENT
    ] );
    affirm( coefficients.isNormalized(), 'coefficients must be normalized' );

    return new PresetSuperpositionConfiguration( coefficients, {
      visualNameProperty: QuantumBoundStatesFluent.superpositionConfigurations.preset5StringProperty,
      tandem: parentTandem.createTandem( 'localizedParticle' )
    } );
  }
}