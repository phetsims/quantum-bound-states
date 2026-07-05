// Copyright 2026, University of Colorado Boulder

/**
 * PresetSuperpositionState is a superposition state whose coefficients cannot be changed.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import SuperpositionCoefficient from '../../common/model/SuperpositionCoefficient.js';
import SuperpositionState, { SuperpositionCoefficientsOptions } from '../../common/model/SuperpositionState.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';

type SelfOptions = EmptySelfOptions;

type PresetSuperpositionStateOptions = SelfOptions & SuperpositionCoefficientsOptions;

export default class PresetSuperpositionState extends SuperpositionState {

  private constructor( coefficients: SuperpositionCoefficient[], providedOptions: PresetSuperpositionStateOptions ) {

    super( coefficients, providedOptions );
  }

  /**
   * Creates the complete set of preset superposition states.
   */
  public static createStates( groundStateIndexProperty: TReadOnlyProperty<number>, parentTandem: Tandem ): PresetSuperpositionState[] {
    return [
      PresetSuperpositionState.createPreset1( groundStateIndexProperty, parentTandem ),
      PresetSuperpositionState.createPreset2( groundStateIndexProperty, parentTandem ),
      PresetSuperpositionState.createPreset3( groundStateIndexProperty, parentTandem ),
      PresetSuperpositionState.createPreset4( groundStateIndexProperty, parentTandem ),
      PresetSuperpositionState.createPresetLocalizedParticle( groundStateIndexProperty, parentTandem )
    ];
  }

  /**
   * Creates preset cΨ1 + cΨ2
   */
  private static createPreset1( groundStateIndexProperty: TReadOnlyProperty<number>, parentTandem: Tandem ): PresetSuperpositionState {

    const coefficients = [
      new SuperpositionCoefficient( 0.71, 0 ),
      new SuperpositionCoefficient( 0.71, 0 )
    ];

    const superpositionState = new PresetSuperpositionState( coefficients, {
      visualNameProperty: new DerivedStringProperty( [
        groundStateIndexProperty,
        QuantumBoundStatesFluent.superpositionStates.preset1.groundState0StringProperty,
        QuantumBoundStatesFluent.superpositionStates.preset1.groundState1StringProperty
      ], ( groundStateIndex, groundState0String, groundState1String ) => groundStateIndex === 0 ? groundState0String : groundState1String ),
      accessibleNameProperty: QuantumBoundStatesFluent.a11y.superpositionStates.preset1.createProperty( {
        groundStateIndex: groundStateIndexProperty.derived( index => index === 0 ? 0 : 1 )
      } ),
      tandem: parentTandem.createTandem( 'preset1' )
    } );
    affirm( superpositionState.isNormalized(), 'superpositionState must be normalized' );

    return superpositionState;
  }

  /**
   * Creates preset cΨ1 + cΨ3
   */
  private static createPreset2( groundStateIndexProperty: TReadOnlyProperty<number>, parentTandem: Tandem ): PresetSuperpositionState {

    const coefficients = [
      new SuperpositionCoefficient( 0.71, 0 ),
      SuperpositionCoefficient.ZERO_COEFFICIENT,
      new SuperpositionCoefficient( 0.71, 0 )
    ];

    const superpositionState = new PresetSuperpositionState( coefficients, {
      visualNameProperty: new DerivedStringProperty( [
        groundStateIndexProperty,
        QuantumBoundStatesFluent.superpositionStates.preset2.groundState0StringProperty,
        QuantumBoundStatesFluent.superpositionStates.preset2.groundState1StringProperty
      ], ( groundStateIndex, groundState0String, groundState1String ) => groundStateIndex === 0 ? groundState0String : groundState1String ),
      accessibleNameProperty: QuantumBoundStatesFluent.a11y.superpositionStates.preset2.createProperty( {
        groundStateIndex: groundStateIndexProperty.derived( index => index === 0 ? 0 : 1 )
      } ),
      tandem: parentTandem.createTandem( 'preset2' )
    } );
    affirm( superpositionState.isNormalized(), 'superpositionState must be normalized' );

    return superpositionState;
  }

  /**
   * Creates preset cΨ1 - cΨ2
   */
  private static createPreset3( groundStateIndexProperty: TReadOnlyProperty<number>, parentTandem: Tandem ): PresetSuperpositionState {

    const coefficients = [
      new SuperpositionCoefficient( 0.71, 0 ),
      new SuperpositionCoefficient( 0.71, 1 ) // 1 * Math.PI, which results in amplitude of -magnitude
    ];

    const superpositionState = new PresetSuperpositionState( coefficients, {
      visualNameProperty: new DerivedStringProperty( [
        groundStateIndexProperty,
        QuantumBoundStatesFluent.superpositionStates.preset3.groundState0StringProperty,
        QuantumBoundStatesFluent.superpositionStates.preset3.groundState1StringProperty
      ], ( groundStateIndex, groundState0String, groundState1String ) => groundStateIndex === 0 ? groundState0String : groundState1String ),
      accessibleNameProperty: QuantumBoundStatesFluent.a11y.superpositionStates.preset3.createProperty( {
        groundStateIndex: groundStateIndexProperty.derived( index => index === 0 ? 0 : 1 )
      } ),
      tandem: parentTandem.createTandem( 'preset3' )
    } );
    affirm( superpositionState.isNormalized(), 'superpositionState must be normalized' );

    return superpositionState;
  }

  /**
   * Creates preset cΨ1 + cΨ2 + cΨ3
   */
  private static createPreset4( groundStateIndexProperty: TReadOnlyProperty<number>, parentTandem: Tandem ): PresetSuperpositionState {

    const coefficients = [
      new SuperpositionCoefficient( 0.58, 0 ),
      new SuperpositionCoefficient( 0.58, 0 ),
      new SuperpositionCoefficient( 0.58, 0 )
    ];

    const superpositionState = new PresetSuperpositionState( coefficients, {
      visualNameProperty: new DerivedStringProperty( [
        groundStateIndexProperty,
        QuantumBoundStatesFluent.superpositionStates.preset4.groundState0StringProperty,
        QuantumBoundStatesFluent.superpositionStates.preset4.groundState1StringProperty
      ], ( groundStateIndex, groundState0String, groundState1String ) => groundStateIndex === 0 ? groundState0String : groundState1String ),
      accessibleNameProperty: QuantumBoundStatesFluent.a11y.superpositionStates.preset4.createProperty( {
        groundStateIndex: groundStateIndexProperty.derived( index => index === 0 ? 0 : 1 )
      } ),
      tandem: parentTandem.createTandem( 'preset4' )
    } );
    affirm( superpositionState.isNormalized(), 'superpositionState must be normalized' );

    return superpositionState;
  }

  /**
   * Creates preset 'Localized Particle'
   */
  private static createPresetLocalizedParticle( groundStateIndexProperty: TReadOnlyProperty<number>, parentTandem: Tandem ): PresetSuperpositionState {

    //TODO What are the coefficients for Localized Particle?
    const coefficients: SuperpositionCoefficient[] = [];
    for ( let i = 0; i < 10; i++ ) {
      coefficients.push( new SuperpositionCoefficient( 0.32, 0 ) );
    }

    const superpositionState = new PresetSuperpositionState( coefficients, {
      visualNameProperty: QuantumBoundStatesFluent.superpositionStates.preset5StringProperty,
      tandem: parentTandem.createTandem( 'localizedParticle' )
    } );
    superpositionState.normalize(); //TODO Should not need to do this.
    affirm( superpositionState.isNormalized(), 'superpositionState must be normalized' );

    return superpositionState;
  }
}