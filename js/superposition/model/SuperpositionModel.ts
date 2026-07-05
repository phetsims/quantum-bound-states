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
import { electronMassesUnit } from '../../../../scenery-phet/js/units/electronMassesUnit.js';
import { voltsPerNanometerUnit } from '../../../../scenery-phet/js/units/voltsPerNanometerUnit.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import DoubleSquarePotential from '../../common/model/potentials/DoubleSquarePotential.js';
import FiniteSquarePotential from '../../common/model/potentials/FiniteSquarePotential.js';
import HarmonicOscillatorPotential from '../../common/model/potentials/HarmonicOscillatorPotential.js';
import InfiniteSquarePotential from '../../common/model/potentials/InfiniteSquarePotential.js';
import MorsePotential from '../../common/model/potentials/MorsePotential.js';
import PoschlTellerPotential from '../../common/model/potentials/PoschlTellerPotential.js';
import QBSModel from '../../common/model/QBSModel.js';
import SuperpositionState from '../../common/model/SuperpositionState.js';
import CustomSuperpositionState from './CustomSuperpositionState.js';
import PresetSuperpositionState from './PresetSuperpositionState.js';
import { SuperpositionStateType, SuperpositionStateTypeValues } from './SuperpositionStateType.js';

export default class SuperpositionModel extends QBSModel {

  // Whether a preset or custom superposition state is selected
  public readonly superpositionStateTypeProperty: Property<SuperpositionStateType>;

  // The selected preset superposition state
  public readonly presetSuperpositionStateProperty: Property<PresetSuperpositionState>;

  // The selected custom superposition state
  public readonly customSuperpositionStateProperty: Property<CustomSuperpositionState>;

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

    // Group all potentials under a parent tandem.
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

    this.superpositionStateTypeProperty = new StringUnionProperty( 'preset', {
      validValues: SuperpositionStateTypeValues,
      tandem: tandem.createTandem( 'superpositionStateTypeProperty' ),
      phetioFeatured: true
    } );

    const groundStateIndexProperty = this.potentialProperty.derived( potential => potential.groundStateIndex );

    // Group all superposition states under a parent tandem.
    const superpositionStatesTandem = tandem.createTandem( 'superpositionStates' );

    const presetSuperpositionStates = PresetSuperpositionState.createStates( groundStateIndexProperty,
      superpositionStatesTandem.createTandem( 'presets' ) );

    this.presetSuperpositionStateProperty = new Property<PresetSuperpositionState>( presetSuperpositionStates[ 0 ], {
      validValues: presetSuperpositionStates,
      tandem: tandem.createTandem( 'presetSuperpositionStateProperty' ),
      phetioFeatured: true,
      phetioValueType: SuperpositionState.SuperpositionStateIO //TODO SuperpositionState.SuperpositionStateIO
    } );

    const customSuperpositionStates = CustomSuperpositionState.createStates( groundStateIndexProperty,
      superpositionStatesTandem.createTandem( 'custom' ) );

    this.customSuperpositionStateProperty = new Property<CustomSuperpositionState>( customSuperpositionStates[ 0 ], {
      validValues: customSuperpositionStates,
      tandem: tandem.createTandem( 'customSuperpositionStateProperty' ),
      phetioFeatured: true,
      phetioValueType: SuperpositionState.SuperpositionStateIO //TODO SuperpositionState.SuperpositionStateIO
    } );
  }

  public override reset(): void {
    super.reset();
    this.superpositionStateTypeProperty.reset();
    this.presetSuperpositionStateProperty.reset();
    this.customSuperpositionStateProperty.reset();
  }
}
