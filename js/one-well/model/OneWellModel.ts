// Copyright 2025-2026, University of Colorado Boulder

/**
 * OneWellModel is the top-level model for the 'One Well' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
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
        tandem: potentialsTandem.createTandem( 'finiteSquarePotential' )
      } ),
      new InfiniteSquarePotential( potentialsTandem.createTandem( 'infiniteSquarePotential' ) ),
      new InfiniteStepPotential( potentialsTandem.createTandem( 'infiniteStepPotential' ) ),
      new AsymmetricTrianglePotential( potentialsTandem.createTandem( 'asymmetricTrianglePotential' ) ),
      new HarmonicOscillatorPotential( electronMassesProperty, potentialsTandem.createTandem( 'harmonicOscillatorPotential' ) ),
      new AnharmonicOscillatorPotential( {
        tandem: potentialsTandem.createTandem( 'anharmonicOscillatorPotential' )
      } ),
      new CoulombPotential( potentialsTandem.createTandem( 'coulombPotential' ) )
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
