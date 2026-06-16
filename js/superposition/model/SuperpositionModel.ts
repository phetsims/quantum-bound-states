// Copyright 2025-2026, University of Colorado Boulder

/**
 * SuperpositionModel is the top-level model for the 'Superposition' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import Range from '../../../../dot/js/Range.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import DoubleSquarePotential from '../../common/model/potentials/DoubleSquarePotential.js';
import FiniteSquarePotential from '../../common/model/potentials/FiniteSquarePotential.js';
import HarmonicOscillatorPotential from '../../common/model/potentials/HarmonicOscillatorPotential.js';
import InfiniteSquarePotential from '../../common/model/potentials/InfiniteSquarePotential.js';
import MorsePotential from '../../common/model/potentials/MorsePotential.js';
import PoschlTellerPotential from '../../common/model/potentials/PoschlTellerPotential.js';
import QBSModel from '../../common/model/QBSModel.js';
import { electronMassesUnit } from '../../common/model/units/electronMassesUnit.js';
import { voltsPerNanometerUnit } from '../../common/model/units/voltsPerNanometerUnit.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import SuperpositionConfiguration from './SuperpositionConfiguration.js';
import { SuperpositionConfigurationType, SuperpositionConfigurationTypeValues } from './SuperpositionConfigurationType.js';
import SuperpositionCustom from './SuperpositionCustom.js';
import SuperpositionPreset from './SuperpositionPreset.js';

export default class SuperpositionModel extends QBSModel {

  public readonly superpositionConfigurationTypeProperty: Property<SuperpositionConfigurationType>;
  public readonly superpositionPresetProperty: Property<SuperpositionPreset>;
  public readonly superpositionCustomProperty: Property<SuperpositionCustom>;

  public constructor( tandem: Tandem ) {

    const numberOfWellsProperty = new NumberProperty( 1, {
      numberType: 'Integer',
      range: new Range( 1, 1 ), // effectively constant
      phetioFeatured: true,
      phetioReadOnly: true
    } );

    const electronMassesProperty = new NumberProperty( 1, {
      numberType: 'FloatingPoint',
      units: electronMassesUnit,
      range: new Range( 1, 1 ), // effectively constant
      tandem: tandem.createTandem( 'electronMassesProperty' ),
      phetioFeatured: true,
      phetioReadOnly: true
    } );

    const electricFieldProperty = new NumberProperty( 0, {
      units: voltsPerNanometerUnit,
      range: new Range( 0, 0 ), // effectively constant
      tandem: tandem.createTandem( 'electricFieldProperty' ),
      phetioFeatured: true,
      phetioReadOnly: true
    } );

    const potentialsTandem = tandem.createTandem( 'potentials' );

    const potentials = [
      new InfiniteSquarePotential( {
        numberOfWellsProperty: numberOfWellsProperty,
        electronMassesProperty: electronMassesProperty,
        electricFieldProperty: electricFieldProperty,
        tandem: potentialsTandem.createTandem( 'infiniteSquarePotential' )
      } ),
      new FiniteSquarePotential( {
        numberOfWellsProperty: numberOfWellsProperty,
        electronMassesProperty: electronMassesProperty,
        electricFieldProperty: electricFieldProperty,
        tandem: potentialsTandem.createTandem( 'finiteSquarePotential' )
      } ),
      new HarmonicOscillatorPotential( electronMassesProperty, {
        numberOfWellsProperty: numberOfWellsProperty,
        electronMassesProperty: electronMassesProperty,
        electricFieldProperty: electricFieldProperty,
        tandem: potentialsTandem.createTandem( 'harmonicOscillatorPotential' )
      } ),
      new PoschlTellerPotential( {
        numberOfWellsProperty: numberOfWellsProperty,
        electronMassesProperty: electronMassesProperty,
        electricFieldProperty: electricFieldProperty,
        tandem: potentialsTandem.createTandem( 'poschlTellerPotential' )
      } ),
      new MorsePotential( {
        numberOfWellsProperty: numberOfWellsProperty,
        electronMassesProperty: electronMassesProperty,
        electricFieldProperty: electricFieldProperty,
        tandem: potentialsTandem.createTandem( 'morsePotential' )
      } ),
      new DoubleSquarePotential( {
        // This potential has its own numberOfWellsProperty.
        electronMassesProperty: electronMassesProperty,
        electricFieldProperty: electricFieldProperty,
        tandem: potentialsTandem.createTandem( 'doubleSquarePotential' )
      } )
    ];

    super( {
      numberOfWellsProperty: numberOfWellsProperty,
      electronMassesProperty: electronMassesProperty,
      electricFieldProperty: electricFieldProperty,
      energyLevelPropertyInstrumented: false,
      potentials: potentials,
      tandem: tandem
    } );

    this.superpositionConfigurationTypeProperty = new StringUnionProperty( 'preset', {
      validValues: SuperpositionConfigurationTypeValues,
      tandem: tandem.createTandem( 'superpositionConfigurationTypeProperty' ),
      phetioFeatured: true
    } );

    const groundStateIndexProperty = new DerivedProperty( [ this.potentialProperty ], potential => potential.groundStateIndex );

    //TODO Make this mess go away.
    let presetIndex = 1;
    const presetConfigurationsTandem = tandem.createTandem( 'presetConfigurationsTandem' );
    const superpositionPresets: SuperpositionPreset[] = [
      new SuperpositionPreset( {
        nameProperty: new DerivedStringProperty( [
          groundStateIndexProperty,
          QuantumBoundStatesFluent.superpositionConfigurations.preset1.groundState0StringProperty,
          QuantumBoundStatesFluent.superpositionConfigurations.preset1.groundState1StringProperty
        ], ( groundStateIndex, groundState0String, groundState1String ) => groundStateIndex === 0 ? groundState0String : groundState1String ),
        accessibleNameProperty: QuantumBoundStatesFluent.a11y.superpositionConfigurations.preset1.createProperty( {
          groundStateIndex: groundStateIndexProperty.derived( index => index === 0 ? 0 : 1 )
        } ),
        tandemPrefix: `preset${presetIndex}`,
        tandem: presetConfigurationsTandem.createTandem( `preset${presetIndex++}` )
      } ),
      new SuperpositionPreset( {
        nameProperty: new DerivedStringProperty( [
          groundStateIndexProperty,
          QuantumBoundStatesFluent.superpositionConfigurations.preset2.groundState0StringProperty,
          QuantumBoundStatesFluent.superpositionConfigurations.preset2.groundState1StringProperty
        ], ( groundStateIndex, groundState0String, groundState1String ) => groundStateIndex === 0 ? groundState0String : groundState1String ),
        accessibleNameProperty: QuantumBoundStatesFluent.a11y.superpositionConfigurations.preset2.createProperty( {
          groundStateIndex: groundStateIndexProperty.derived( index => index === 0 ? 0 : 1 )
        } ),
        tandemPrefix: `preset${presetIndex}`,
        tandem: presetConfigurationsTandem.createTandem( `preset${presetIndex++}` )
      } ),
      new SuperpositionPreset( {
        nameProperty: new DerivedStringProperty( [
          groundStateIndexProperty,
          QuantumBoundStatesFluent.superpositionConfigurations.preset3.groundState0StringProperty,
          QuantumBoundStatesFluent.superpositionConfigurations.preset3.groundState1StringProperty
        ], ( groundStateIndex, groundState0String, groundState1String ) => groundStateIndex === 0 ? groundState0String : groundState1String ),
        accessibleNameProperty: QuantumBoundStatesFluent.a11y.superpositionConfigurations.preset3.createProperty( {
          groundStateIndex: groundStateIndexProperty.derived( index => index === 0 ? 0 : 1 )
        } ),
        tandemPrefix: `preset${presetIndex}`,
        tandem: presetConfigurationsTandem.createTandem( `preset${presetIndex++}` )
      } ),
      new SuperpositionPreset( {
        nameProperty: new DerivedStringProperty( [
          groundStateIndexProperty,
          QuantumBoundStatesFluent.superpositionConfigurations.preset4.groundState0StringProperty,
          QuantumBoundStatesFluent.superpositionConfigurations.preset4.groundState1StringProperty
        ], ( groundStateIndex, groundState0String, groundState1String ) => groundStateIndex === 0 ? groundState0String : groundState1String ),
        accessibleNameProperty: QuantumBoundStatesFluent.a11y.superpositionConfigurations.preset4.createProperty( {
          groundStateIndex: groundStateIndexProperty.derived( index => index === 0 ? 0 : 1 )
        } ),
        tandemPrefix: `preset${presetIndex}`,
        tandem: presetConfigurationsTandem.createTandem( `preset${presetIndex++}` )
      } ),
      new SuperpositionPreset( {
        nameProperty: QuantumBoundStatesFluent.superpositionConfigurations.preset5StringProperty,
        tandemPrefix: `preset${presetIndex}`,
        tandem: presetConfigurationsTandem.createTandem( `preset${presetIndex++}` )
      } )
    ];

    //TODO Make this mess go away.
    let customIndex = 1;
    const customConfigurationsTandem = tandem.createTandem( 'customConfigurations' );
    const superpositionCustoms: SuperpositionCustom[] = [
      new SuperpositionCustom( {
        nameProperty: QuantumBoundStatesFluent.superpositionConfigurations.custom1StringProperty,
        tandemPrefix: `custom${customIndex}`,
        tandem: customConfigurationsTandem.createTandem( `custom${customIndex++}` )
      } ),
      new SuperpositionCustom( {
        nameProperty: QuantumBoundStatesFluent.superpositionConfigurations.custom2StringProperty,
        tandemPrefix: `custom${customIndex}`,
        tandem: customConfigurationsTandem.createTandem( `custom${customIndex++}` )
      } ),
      new SuperpositionCustom( {
        nameProperty: QuantumBoundStatesFluent.superpositionConfigurations.custom3StringProperty,
        tandemPrefix: `custom${customIndex}`,
        tandem: customConfigurationsTandem.createTandem( `custom${customIndex++}` )
      } ),
      new SuperpositionCustom( {
        nameProperty: QuantumBoundStatesFluent.superpositionConfigurations.custom4StringProperty,
        tandemPrefix: `custom${customIndex}`,
        tandem: customConfigurationsTandem.createTandem( `custom${customIndex++}` )
      } ),
      new SuperpositionCustom( {
        nameProperty: QuantumBoundStatesFluent.superpositionConfigurations.custom5StringProperty,
        tandemPrefix: `custom${customIndex}`,
        tandem: customConfigurationsTandem.createTandem( `custom${customIndex++}` )
      } )
    ];

    this.superpositionPresetProperty = new Property<SuperpositionPreset>( superpositionPresets[ 0 ], {
      validValues: superpositionPresets,
      tandem: tandem.createTandem( 'superpositionPresetProperty' ),
      phetioFeatured: true,
      phetioValueType: SuperpositionConfiguration.SuperpositionConfigurationIO
    } );

    this.superpositionCustomProperty = new Property<SuperpositionCustom>( superpositionCustoms[ 0 ], {
      validValues: superpositionCustoms,
      tandem: tandem.createTandem( 'superpositionCustomProperty' ),
      phetioFeatured: true,
      phetioValueType: SuperpositionConfiguration.SuperpositionConfigurationIO
    } );
  }

  public override reset(): void {
    super.reset();
    this.superpositionConfigurationTypeProperty.reset();
    this.superpositionPresetProperty.reset();
    this.superpositionCustomProperty.reset();
  }
}
