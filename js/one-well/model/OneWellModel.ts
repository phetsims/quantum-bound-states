// Copyright 2025-2026, University of Colorado Boulder

/**
 * OneWellModel is the top-level model for the 'One Well' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import AsymmetricTrianglePotential, { AsymmetricTrianglePotentialOptions } from '../../common/model/potentials/AsymmetricTrianglePotential.js';
import CoulombPotential, { CoulombPotentialOptions } from '../../common/model/potentials/CoulombPotential.js';
import FiniteSquarePotential, { FiniteSquarePotentialOptions } from '../../common/model/potentials/FiniteSquarePotential.js';
import HarmonicOscillatorPotential, { HarmonicOscillatorPotentialOptions } from '../../common/model/potentials/HarmonicOscillatorPotential.js';
import InfiniteSquarePotential, { InfiniteSquarePotentialOptions } from '../../common/model/potentials/InfiniteSquarePotential.js';
import InfiniteStepPotential, { InfiniteStepPotentialOptions } from '../../common/model/potentials/InfiniteStepPotential.js';
import MorsePotential, { MorsePotentialOptions } from '../../common/model/potentials/MorsePotential.js';
import PoschlTellerPotential, { PoschlTellerPotentialOptions } from '../../common/model/potentials/PoschlTellerPotential.js';
import { QuantumPotentialOptions } from '../../common/model/potentials/QuantumPotential.js';
import QBSModel from '../../common/model/QBSModel.js';
import { electronMassesUnit } from '../../common/model/units/electronMassesUnit.js';
import { voltsPerNanometerUnit } from '../../common/model/units/voltsPerNanometerUnit.js';

export default class OneWellModel extends QBSModel {

  public constructor( tandem: Tandem ) {

    const numberOfWellsProperty = new NumberProperty( 1, {
      range: new Range( 1, 1 )
      // No PhET-iO instrumentation, since it's effectively a constant.
    } );

    const electronMassesProperty = new NumberProperty( 1, {
      numberType: 'FloatingPoint',
      units: electronMassesUnit,
      range: new Range( 0.5, 1.1 ),
      tandem: tandem.createTandem( 'electronMassesProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'The number of electron masses.'
    } );

    const electricFieldProperty = new NumberProperty( 0, {
      units: voltsPerNanometerUnit,
      range: new Range( 0, 0 )
      // No PhET-iO instrumentation, since it's effectively constant.
    } );

    const yOffsetRange = new RangeWithValue( -10, 10, 0 );

    // Shared by all quantum potentials
    const quantumPotentialOptions: Partial<QuantumPotentialOptions> = {
      numberOfWellsProperty: numberOfWellsProperty,
      electricFieldProperty: electricFieldProperty,
      yOffsetRange: yOffsetRange
    };

    const potentialsTandem = tandem.createTandem( 'potentials' );

    // Quantum potentials, in the order that they appear in PotentialComboBox.
    const potentials = [
      new InfiniteSquarePotential( combineOptions<InfiniteSquarePotentialOptions>( {}, quantumPotentialOptions, {
        tandem: potentialsTandem.createTandem( 'infiniteSquarePotential' )
      } ) ),
      new FiniteSquarePotential( combineOptions<FiniteSquarePotentialOptions>( {}, quantumPotentialOptions, {
        tandem: potentialsTandem.createTandem( 'finiteSquarePotential' )
      } ) ),
      new InfiniteStepPotential( combineOptions<InfiniteStepPotentialOptions>( {}, quantumPotentialOptions, {
        tandem: potentialsTandem.createTandem( 'infiniteStepPotential' )
      } ) ),
      new AsymmetricTrianglePotential( combineOptions<AsymmetricTrianglePotentialOptions>( {}, quantumPotentialOptions, {
        tandem: potentialsTandem.createTandem( 'asymmetricTrianglePotential' )
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
      new CoulombPotential( combineOptions<CoulombPotentialOptions>( {}, quantumPotentialOptions, {
        tandem: potentialsTandem.createTandem( 'coulombPotential' )
      } ) )
    ];

    super( {
      numberOfWellsProperty: numberOfWellsProperty,
      electronMassesProperty: electronMassesProperty,
      electricFieldProperty: electricFieldProperty,
      potentials: potentials,
      tandem: tandem
    } );
  }
}
