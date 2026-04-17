// Copyright 2025-2026, University of Colorado Boulder

/**
 * SuperpositionModel is the top-level model for the 'Superposition' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import Range from '../../../../dot/js/Range.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PoschlTellerPotential, { PoschlTellerPotentialOptions } from '../../common/model/potentials/PoschlTellerPotential.js';
import MorsePotential, { MorsePotentialOptions } from '../../common/model/potentials/MorsePotential.js';
import DoubleSquarePotential from '../../common/model/potentials/DoubleSquarePotential.js';
import FiniteSquarePotential, { FiniteSquarePotentialOptions } from '../../common/model/potentials/FiniteSquarePotential.js';
import HarmonicOscillatorPotential, { HarmonicOscillatorPotentialOptions } from '../../common/model/potentials/HarmonicOscillatorPotential.js';
import InfiniteSquarePotential, { InfiniteSquarePotentialOptions } from '../../common/model/potentials/InfiniteSquarePotential.js';
import { QuantumPotentialOptions } from '../../common/model/potentials/QuantumPotential.js';
import QBSModel from '../../common/model/QBSModel.js';
import { electronMassesUnit } from '../../common/model/units/electronMassesUnit.js';
import { voltsPerNanometerUnit } from '../../common/model/units/voltsPerNanometerUnit.js';
import { SuperpositionConfigurationType, SuperpositionConfigurationTypeValues } from './SuperpositionConfigurationType.js';

export default class SuperpositionModel extends QBSModel {

  public readonly superpositionConfigurationTypeProperty: Property<SuperpositionConfigurationType>;
  public readonly superpositionPresetProperty: NumberProperty;
  public readonly superpositionCustomProperty: NumberProperty;

  public constructor( tandem: Tandem ) {

    const numberOfWellsProperty = new NumberProperty( 1, {
      range: new Range( 1, 1 )
      // No PhET-iO instrumentation, since it's effectively a constant.
    } );

    const electronMassesProperty = new NumberProperty( 1, {
      numberType: 'FloatingPoint',
      units: electronMassesUnit,
      range: new Range( 1, 1 )
      // No PhET-iO instrumentation, since it's effectively a constant.
    } );

    const electricFieldProperty = new NumberProperty( 0, {
      units: voltsPerNanometerUnit,
      range: new Range( 0, 0 )
      // No PhET-iO instrumentation, since it's effectively a constant.
    } );

    // Shared by all quantum potentials
    const quantumPotentialOptions: Partial<QuantumPotentialOptions> = {
      numberOfWellsProperty: numberOfWellsProperty,
      electricFieldProperty: electricFieldProperty
    };

    const potentialsTandem = tandem.createTandem( 'potentials' );

    const potentials = [
      new InfiniteSquarePotential( combineOptions<InfiniteSquarePotentialOptions>( {}, quantumPotentialOptions, {
        tandem: potentialsTandem.createTandem( 'infiniteSquarePotential' )
      } ) ),
      new FiniteSquarePotential( combineOptions<FiniteSquarePotentialOptions>( {}, quantumPotentialOptions, {
        tandem: potentialsTandem.createTandem( 'finiteSquarePotential' )
      } ) ),
      new HarmonicOscillatorPotential( combineOptions<HarmonicOscillatorPotentialOptions>( {}, quantumPotentialOptions, {
        tandem: potentialsTandem.createTandem( 'harmonicOscillatorPotential' )
      } ) ),
      new PoschlTellerPotential( combineOptions<PoschlTellerPotentialOptions>( {}, quantumPotentialOptions, {
        //TODO Other Properties?
        tandem: potentialsTandem.createTandem( 'poschlTellerPotential' )
      } ) ),
      new MorsePotential( combineOptions<MorsePotentialOptions>( {}, quantumPotentialOptions, {
        //TODO Other Properties?
        tandem: potentialsTandem.createTandem( 'morsePotential' )
      } ) ),
      new DoubleSquarePotential( {
        // This potential has its own numberOfWellsProperty.
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

    //TODO Using a number is temporary. This needs to be a richer type.
    this.superpositionPresetProperty = new NumberProperty( 1, {
      numberType: 'Integer',
      range: new Range( 1, 5 ),
      tandem: tandem.createTandem( 'superpositionPresetProperty' ),
      phetioFeatured: true
    } );

    //TODO Using a number is temporary. This needs to be a richer type.
    this.superpositionCustomProperty = new NumberProperty( 1, {
      numberType: 'Integer',
      range: new Range( 1, 5 ),
      tandem: tandem.createTandem( 'superpositionCustomProperty' ),
      phetioFeatured: true
    } );
  }

  public override reset(): void {
    super.reset();
    this.superpositionConfigurationTypeProperty.reset();
    this.superpositionPresetProperty.reset();
    this.superpositionCustomProperty.reset();
  }
}
