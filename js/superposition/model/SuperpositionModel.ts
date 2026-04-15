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
import Tandem from '../../../../tandem/js/Tandem.js';
import PoschlTellerPotential from '../../common/model/potentials/PoschlTellerPotential.js';
import MorsePotential from '../../common/model/potentials/MorsePotential.js';
import DoubleSquarePotential from '../../common/model/potentials/DoubleSquarePotential.js';
import FiniteSquarePotential from '../../common/model/potentials/FiniteSquarePotential.js';
import HarmonicOscillatorPotential from '../../common/model/potentials/HarmonicOscillatorPotential.js';
import InfiniteSquarePotential from '../../common/model/potentials/InfiniteSquarePotential.js';
import QBSModel from '../../common/model/QBSModel.js';
import { electronMassesUnit } from '../../common/model/units/electronMassesUnit.js';
import { voltsPerNanometerUnit } from '../../common/model/units/voltsPerNanometerUnit.js';
import { SuperpositionConfigurationType, SuperpositionConfigurationTypeValues } from './SuperpositionConfigurationType.js';

export default class SuperpositionModel extends QBSModel {

  public readonly superpositionConfigurationTypeProperty: Property<SuperpositionConfigurationType>;
  public readonly superpositionPresetProperty: NumberProperty;
  public readonly superpositionCustomProperty: NumberProperty;

  public constructor( tandem: Tandem ) {

    // Effectively constant
    const numberOfWellsProperty = new NumberProperty( 1, {
      range: new Range( 1, 1 )
    } );

    const electronMassesProperty = new NumberProperty( 1, {
      numberType: 'FloatingPoint',
      units: electronMassesUnit,
      range: new Range( 0.5, 1.1 ),
      tandem: tandem.createTandem( 'electronMassesProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'The number of electron masses.'
    } );

    // Effectively constant
    const electricFieldProperty = new NumberProperty( 0, {
      units: voltsPerNanometerUnit,
      range: new Range( 0, 0 )
    } );

    const potentialsTandem = tandem.createTandem( 'potentials' );

    const potentials = [
      new InfiniteSquarePotential( {
        numberOfWellsProperty: numberOfWellsProperty,
        tandem: potentialsTandem.createTandem( 'infiniteSquarePotential' )
      } ),
      new FiniteSquarePotential( {
        numberOfWellsProperty: numberOfWellsProperty,
        electricFieldProperty: electricFieldProperty,
        tandem: potentialsTandem.createTandem( 'finiteSquarePotential' )
      } ),
      new HarmonicOscillatorPotential( {
        numberOfWellsProperty: numberOfWellsProperty,
        tandem: potentialsTandem.createTandem( 'harmonicOscillatorPotential' )
      } ),
      new PoschlTellerPotential( {
        numberOfWellsProperty: numberOfWellsProperty,
        electricFieldProperty: electricFieldProperty,
        //TODO Other Properties?
        tandem: potentialsTandem.createTandem( 'poschlTellerPotential' )
      } ),
      new MorsePotential( {
        numberOfWellsProperty: numberOfWellsProperty,
        //TODO Other Properties?
        tandem: potentialsTandem.createTandem( 'morsePotential' )
      } ),
      new DoubleSquarePotential( {
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
