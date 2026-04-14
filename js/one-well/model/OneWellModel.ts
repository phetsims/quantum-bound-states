// Copyright 2025-2026, University of Colorado Boulder

/**
 * OneWellModel is the top-level model for the 'One Well' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import MorsePotential from '../../common/model/potentials/MorsePotential.js';
import AsymmetricTrianglePotential from '../../common/model/potentials/AsymmetricTrianglePotential.js';
import CoulombPotential from '../../common/model/potentials/CoulombPotential.js';
import FiniteSquarePotential from '../../common/model/potentials/FiniteSquarePotential.js';
import HarmonicOscillatorPotential from '../../common/model/potentials/HarmonicOscillatorPotential.js';
import InfiniteSquarePotential from '../../common/model/potentials/InfiniteSquarePotential.js';
import InfiniteStepPotential from '../../common/model/potentials/InfiniteStepPotential.js';
import QBSModel from '../../common/model/QBSModel.js';
import { electronMassesUnit } from '../../common/model/units/electronMassesUnit.js';
import { voltsPerNanometerUnit } from '../../common/model/units/voltsPerNanometerUnit.js';

export default class OneWellModel extends QBSModel {

  public constructor( tandem: Tandem ) {

    const numberOfWellsProperty = new NumberProperty( 1, {
      range: new Range( 1, 1 ),
      tandem: tandem.createTandem( 'numberOfWellsProperty' ),
      phetioFeatured: true,
      phetioReadOnly: true
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
      new InfiniteStepPotential( {
        numberOfWellsProperty: numberOfWellsProperty,
        tandem: potentialsTandem.createTandem( 'infiniteStepPotential' )
      } ),
      new AsymmetricTrianglePotential( {
        numberOfWellsProperty: numberOfWellsProperty,
        tandem: potentialsTandem.createTandem( 'asymmetricTrianglePotential' )
      } ),
      new HarmonicOscillatorPotential( {
        numberOfWellsProperty: numberOfWellsProperty,
        electronMassesProperty: electronMassesProperty,
        tandem: potentialsTandem.createTandem( 'harmonicOscillatorPotential' )
      } ),
      new MorsePotential( {
        numberOfWellsProperty: numberOfWellsProperty,
        electricFieldProperty: electricFieldProperty,
        tandem: potentialsTandem.createTandem( 'anharmonicOscillatorPotential' )
      } ),
      new CoulombPotential( {
        numberOfWellsProperty: numberOfWellsProperty,
        tandem: potentialsTandem.createTandem( 'coulombPotential' )
      } )
    ];

    super( {
      numberOfWellsProperty: numberOfWellsProperty,
      electronMassesProperty: electronMassesProperty,
      electricFieldProperty: electricFieldProperty,
      potentials: potentials,
      tandem: tandem
    } );
  }

  public override reset(): void {
    super.reset();
    this.electronMassesProperty.reset();
  }
}
