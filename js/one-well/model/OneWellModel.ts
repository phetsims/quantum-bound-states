// Copyright 2025-2026, University of Colorado Boulder

/**
 * OneWellModel is the top-level model for the 'One Well' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import { kilogramsUnit } from '../../../../scenery-phet/js/units/kilogramsUnit.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
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

  public readonly electronMassesProperty: NumberProperty;
  public readonly massProperty: TReadOnlyProperty<number>;

  public constructor( tandem: Tandem ) {

    const potentialsTandem = tandem.createTandem( 'potentials' );

    const potentials = [
      new FiniteSquarePotential( potentialsTandem.createTandem( 'finiteSquarePotential' ) ),
      new InfiniteSquarePotential( potentialsTandem.createTandem( 'infiniteSquarePotential' ) ),
      new InfiniteStepPotential( potentialsTandem.createTandem( 'infiniteStepPotential' ) ),
      new AsymmetricTrianglePotential( potentialsTandem.createTandem( 'asymmetricTrianglePotential' ) ),
      new HarmonicOscillatorPotential( potentialsTandem.createTandem( 'harmonicOscillatorPotential' ) ),
      new AnharmonicOscillatorPotential( potentialsTandem.createTandem( 'anharmonicOscillatorPotential' ) ),
      new CoulombPotential( potentialsTandem.createTandem( 'coulombPotential' ) )
    ];

    super( {
      potentials: potentials,
      tandem: tandem
    } );

    this.electronMassesProperty = new NumberProperty( 1, {
      numberType: 'FloatingPoint',
      units: electronMassesUnit,
      range: new Range( 0.5, 1.1 ),
      tandem: tandem.createTandem( 'electronMassesProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'The number of electron masses, used to compute the value of massProperty.'
    } );

    this.massProperty = new DerivedProperty( [ this.electronMassesProperty ],
      electronMasses => electronMasses * QBSConstants.ELECTRON_MASS, {
        units: kilogramsUnit,
        tandem: tandem.createTandem( 'massProperty' ),
        phetioValueType: NumberIO,
        phetioFeatured: true
      } );
    this.massProperty.lazyLink( mass => {
      //TODO update potentials
    } );
  }

  public override reset(): void {
    super.reset();
    this.electronMassesProperty.reset();
  }
}
