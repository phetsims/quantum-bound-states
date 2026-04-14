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
import AnharmonicOscillatorPotential from '../../common/model/potentials/AnharmonicOscillatorPotential.js';
import DoubleSquarePotential from '../../common/model/potentials/DoubleSquarePotential.js';
import FiniteSquarePotential from '../../common/model/potentials/FiniteSquarePotential.js';
import HarmonicOscillatorPotential from '../../common/model/potentials/HarmonicOscillatorPotential.js';
import InfiniteSquarePotential from '../../common/model/potentials/InfiniteSquarePotential.js';
import QBSModel from '../../common/model/QBSModel.js';
import { electronMassesUnit } from '../../common/model/units/electronMassesUnit.js';
import { SuperpositionConfigurationType, SuperpositionConfigurationTypeValues } from './SuperpositionConfigurationType.js';

export default class SuperpositionModel extends QBSModel {

  public readonly superpositionConfigurationTypeProperty: Property<SuperpositionConfigurationType>;
  public readonly superpositionPresetProperty: NumberProperty;
  public readonly superpositionCustomProperty: NumberProperty;

  public constructor( tandem: Tandem ) {

    //TODO move electronMassesProperty to QBSModel?
    const electronMassesProperty = new NumberProperty( 1, {
      numberType: 'FloatingPoint',
      units: electronMassesUnit,
      range: new Range( 0.5, 1.1 ),
      tandem: tandem.createTandem( 'electronMassesProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'The number of electron masses.'
    } );

    const potentialsTandem = tandem.createTandem( 'potentials' );

    const potentials = [
      new FiniteSquarePotential( {
        tandem: potentialsTandem.createTandem( 'finiteSquarePotential' )
      } ),
      new InfiniteSquarePotential( potentialsTandem.createTandem( 'infiniteSquarePotential' ) ),
      new HarmonicOscillatorPotential( electronMassesProperty, potentialsTandem.createTandem( 'harmonicOscillatorPotential' ) ),
      new AnharmonicOscillatorPotential( {
        tandem: potentialsTandem.createTandem( 'anharmonicOscillatorPotential' )
      } ),
      new DoubleSquarePotential( potentialsTandem.createTandem( 'doubleSquarePotential' ) )
    ];

    super( {
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
