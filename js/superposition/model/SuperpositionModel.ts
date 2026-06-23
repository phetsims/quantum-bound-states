// Copyright 2025-2026, University of Colorado Boulder

/**
 * SuperpositionModel is the top-level model for the 'Superposition' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

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
import { electronMassesUnit } from '../../../../scenery-phet/js/units/electronMassesUnit.js';
import { voltsPerNanometerUnit } from '../../../../scenery-phet/js/units/voltsPerNanometerUnit.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';
import CustomSuperpositionConfiguration from './CustomSuperpositionConfiguration.js';
import PresetSuperpositionConfiguration from './PresetSuperpositionConfiguration.js';
import SuperpositionConfiguration from './SuperpositionConfiguration.js';
import { SuperpositionConfigurationType, SuperpositionConfigurationTypeValues } from './SuperpositionConfigurationType.js';

export default class SuperpositionModel extends QBSModel {

  // Whether a preset or custom superposition configuration is selectable.
  public readonly superpositionConfigurationTypeProperty: Property<SuperpositionConfigurationType>;

  // The selected preset superposition configuration
  public readonly presetSuperpositionConfigurationProperty: Property<PresetSuperpositionConfiguration>;

  // The selected custom superposition configuration
  public readonly customSuperpositionConfigurationProperty: Property<CustomSuperpositionConfiguration>;

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
      potentials: potentials,
      tandem: tandem
    } );

    const superpositionConfigurationsTandem = tandem.createTandem( 'superpositionConfigurations' );

    this.superpositionConfigurationTypeProperty = new StringUnionProperty( 'preset', {
      validValues: SuperpositionConfigurationTypeValues,
      tandem: superpositionConfigurationsTandem.createTandem( 'superpositionConfigurationTypeProperty' ),
      phetioFeatured: true
    } );

    const groundStateIndexProperty = this.potentialProperty.derived( potential => potential.groundStateIndex );

    //TODO Make this mess go away.
    let presetIndex = 1;
    const presetsTandem = superpositionConfigurationsTandem.createTandem( 'presets' );
    const presetSuperpositionConfigurations: PresetSuperpositionConfiguration[] = [
      new PresetSuperpositionConfiguration( {
        nameProperty: new DerivedStringProperty( [
          groundStateIndexProperty,
          QuantumBoundStatesFluent.superpositionConfigurations.preset1.groundState0StringProperty,
          QuantumBoundStatesFluent.superpositionConfigurations.preset1.groundState1StringProperty
        ], ( groundStateIndex, groundState0String, groundState1String ) => groundStateIndex === 0 ? groundState0String : groundState1String ),
        accessibleNameProperty: QuantumBoundStatesFluent.a11y.superpositionConfigurations.preset1.createProperty( {
          groundStateIndex: groundStateIndexProperty.derived( index => index === 0 ? 0 : 1 )
        } ),
        tandem: presetsTandem.createTandem( `preset${presetIndex++}` )
      } ),
      new PresetSuperpositionConfiguration( {
        nameProperty: new DerivedStringProperty( [
          groundStateIndexProperty,
          QuantumBoundStatesFluent.superpositionConfigurations.preset2.groundState0StringProperty,
          QuantumBoundStatesFluent.superpositionConfigurations.preset2.groundState1StringProperty
        ], ( groundStateIndex, groundState0String, groundState1String ) => groundStateIndex === 0 ? groundState0String : groundState1String ),
        accessibleNameProperty: QuantumBoundStatesFluent.a11y.superpositionConfigurations.preset2.createProperty( {
          groundStateIndex: groundStateIndexProperty.derived( index => index === 0 ? 0 : 1 )
        } ),
        tandem: presetsTandem.createTandem( `preset${presetIndex++}` )
      } ),
      new PresetSuperpositionConfiguration( {
        nameProperty: new DerivedStringProperty( [
          groundStateIndexProperty,
          QuantumBoundStatesFluent.superpositionConfigurations.preset3.groundState0StringProperty,
          QuantumBoundStatesFluent.superpositionConfigurations.preset3.groundState1StringProperty
        ], ( groundStateIndex, groundState0String, groundState1String ) => groundStateIndex === 0 ? groundState0String : groundState1String ),
        accessibleNameProperty: QuantumBoundStatesFluent.a11y.superpositionConfigurations.preset3.createProperty( {
          groundStateIndex: groundStateIndexProperty.derived( index => index === 0 ? 0 : 1 )
        } ),
        tandem: presetsTandem.createTandem( `preset${presetIndex++}` )
      } ),
      new PresetSuperpositionConfiguration( {
        nameProperty: new DerivedStringProperty( [
          groundStateIndexProperty,
          QuantumBoundStatesFluent.superpositionConfigurations.preset4.groundState0StringProperty,
          QuantumBoundStatesFluent.superpositionConfigurations.preset4.groundState1StringProperty
        ], ( groundStateIndex, groundState0String, groundState1String ) => groundStateIndex === 0 ? groundState0String : groundState1String ),
        accessibleNameProperty: QuantumBoundStatesFluent.a11y.superpositionConfigurations.preset4.createProperty( {
          groundStateIndex: groundStateIndexProperty.derived( index => index === 0 ? 0 : 1 )
        } ),
        tandem: presetsTandem.createTandem( `preset${presetIndex++}` )
      } ),
      new PresetSuperpositionConfiguration( {
        nameProperty: QuantumBoundStatesFluent.superpositionConfigurations.preset5StringProperty,
        tandem: presetsTandem.createTandem( `preset${presetIndex++}` )
      } )
    ];

    //TODO Make this mess go away.
    let customIndex = 1;
    const customTandem = superpositionConfigurationsTandem.createTandem( 'custom' );
    const customSuperpositionConfigurations: CustomSuperpositionConfiguration[] = [
      new CustomSuperpositionConfiguration( {
        nameProperty: QuantumBoundStatesFluent.superpositionConfigurations.custom1StringProperty,
        tandem: customTandem.createTandem( `custom${customIndex++}` )
      } ),
      new CustomSuperpositionConfiguration( {
        nameProperty: QuantumBoundStatesFluent.superpositionConfigurations.custom2StringProperty,
        tandem: customTandem.createTandem( `custom${customIndex++}` )
      } ),
      new CustomSuperpositionConfiguration( {
        nameProperty: QuantumBoundStatesFluent.superpositionConfigurations.custom3StringProperty,
        tandem: customTandem.createTandem( `custom${customIndex++}` )
      } ),
      new CustomSuperpositionConfiguration( {
        nameProperty: QuantumBoundStatesFluent.superpositionConfigurations.custom4StringProperty,
        tandem: customTandem.createTandem( `custom${customIndex++}` )
      } ),
      new CustomSuperpositionConfiguration( {
        nameProperty: QuantumBoundStatesFluent.superpositionConfigurations.custom5StringProperty,
        tandem: customTandem.createTandem( `custom${customIndex++}` )
      } )
    ];

    this.presetSuperpositionConfigurationProperty = new Property<PresetSuperpositionConfiguration>( presetSuperpositionConfigurations[ 0 ], {
      validValues: presetSuperpositionConfigurations,
      tandem: presetsTandem.createTandem( 'presetSuperpositionConfigurationProperty' ),
      phetioFeatured: true,
      phetioValueType: SuperpositionConfiguration.SuperpositionConfigurationIO
    } );

    this.customSuperpositionConfigurationProperty = new Property<CustomSuperpositionConfiguration>( customSuperpositionConfigurations[ 0 ], {
      validValues: customSuperpositionConfigurations,
      tandem: customTandem.createTandem( 'customSuperpositionConfigurationProperty' ),
      phetioFeatured: true,
      phetioValueType: SuperpositionConfiguration.SuperpositionConfigurationIO
    } );
  }

  public override reset(): void {
    super.reset();
    this.superpositionConfigurationTypeProperty.reset();
    this.presetSuperpositionConfigurationProperty.reset();
    this.customSuperpositionConfigurationProperty.reset();
  }
}
