// Copyright 2025-2026, University of Colorado Boulder

/**
 * OneWellModel is the top-level model for the 'One Well' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import AnharmonicOscillatorPotential from '../../common/model/potentials/AnharmonicOscillatorPotential.js';
import AsymmetricTrianglePotential from '../../common/model/potentials/AsymmetricTrianglePotential.js';
import CoulombPotential from '../../common/model/potentials/CoulombPotential.js';
import FiniteSquarePotential from '../../common/model/potentials/FiniteSquarePotential.js';
import HarmonicOscillatorPotential from '../../common/model/potentials/HarmonicOscillatorPotential.js';
import InfiniteSquarePotential from '../../common/model/potentials/InfiniteSquarePotential.js';
import InfiniteStepPotential from '../../common/model/potentials/InfiniteStepPotential.js';
import QBSModel from '../../common/model/QBSModel.js';
import { electronMassesUnit } from '../../common/model/units/electronMassesUnit.js';
import QBSConstants from '../../common/QBSConstants.js';

export default class OneWellModel extends QBSModel {

  public constructor( tandem: Tandem ) {

    const numberOfWellsProperty = new NumberProperty( 1, {
      range: new Range( 1, 1 ),
      tandem: tandem.createTandem( 'numberOfWellsProperty' ),
      phetioFeatured: true,
      phetioReadOnly: true
    } );

    const electronMassesProperty = new NumberProperty( QBSConstants.ELECTRON_MASSES_RANGE.defaultValue, {
      numberType: 'FloatingPoint',
      units: electronMassesUnit,
      range: QBSConstants.ELECTRON_MASSES_RANGE,
      tandem: tandem.createTandem( 'electronMassesProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'The number of electron masses.'
    } );

    const potentialsTandem = tandem.createTandem( 'potentials' );

    const potentials = [
      new FiniteSquarePotential( {
        numberOfWellsProperty: numberOfWellsProperty,
        tandem: potentialsTandem.createTandem( 'finiteSquarePotential' )
      } ),
      new InfiniteSquarePotential( {
        numberOfWellsProperty: numberOfWellsProperty,
        tandem: potentialsTandem.createTandem( 'infiniteSquarePotential' )
      } ),
      new InfiniteStepPotential( {
        numberOfWellsProperty: numberOfWellsProperty,
        tandem: potentialsTandem.createTandem( 'infiniteStepPotential' )
      } ),
      new AsymmetricTrianglePotential( {
        numberOfWellsProperty: numberOfWellsProperty,
        tandem: potentialsTandem.createTandem( 'asymmetricTrianglePotential' )
      } ),
      new HarmonicOscillatorPotential( electronMassesProperty, {
        numberOfWellsProperty: numberOfWellsProperty,
        tandem: potentialsTandem.createTandem( 'harmonicOscillatorPotential' )
      } ),
      new AnharmonicOscillatorPotential( {
        numberOfWellsProperty: numberOfWellsProperty,
        tandem: potentialsTandem.createTandem( 'anharmonicOscillatorPotential' )
      } ),
      new CoulombPotential( {
        numberOfWellsProperty: numberOfWellsProperty,
        tandem: potentialsTandem.createTandem( 'coulombPotential' )
      } )
    ];

    super( {
      electronMassesProperty: electronMassesProperty,
      potentials: potentials,
      tandem: tandem
    } );
  }

  public override reset(): void {
    super.reset();
    this.electronMassesProperty.reset();
  }
}
