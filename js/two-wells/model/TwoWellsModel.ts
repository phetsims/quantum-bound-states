// Copyright 2025-2026, University of Colorado Boulder

/**
 * TwoWellsModel is the top-level model for the 'Two Wells' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import AnharmonicOscillatorPotential from '../../common/model/potentials/AnharmonicOscillatorPotential.js';
import FiniteSquarePotential from '../../common/model/potentials/FiniteSquarePotential.js';
import QBSModel from '../../common/model/QBSModel.js';
import { electronMassesUnit } from '../../common/model/units/electronMassesUnit.js';
import { voltsPerNanometerUnit } from '../../common/model/units/voltsPerNanometerUnit.js';

const WELL_WIDTH_RANGE = new RangeWithValue( 0.1, 3, 1 );
const SEPARATION_RANGE = new RangeWithValue( 0.05, 0.7, 0.1 );

export default class TwoWellsModel extends QBSModel {

  public constructor( tandem: Tandem ) {

    // Effectively constant
    const numberOfWellsProperty = new NumberProperty( 2, {
      numberType: 'Integer',
      range: new Range( 2, 2 )
    } );

    // Effectively constant
    const electronMassesProperty = new NumberProperty( 1, {
      numberType: 'FloatingPoint',
      units: electronMassesUnit,
      range: new Range( 1, 1 ),
      tandem: tandem.createTandem( 'electronMassesProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'The number of electron masses.'
    } );

    // Effectively constant
    const electricFieldProperty = new NumberProperty( 0, {
      units: voltsPerNanometerUnit,
      range: new Range( 0, 0 ),
      tandem: tandem.createTandem( 'electricFieldProperty' ),
      phetioFeatured: true,
      phetioReadOnly: true
    } );

    const potentialsTandem = tandem.createTandem( 'potentials' );

    const potentials = [
      new FiniteSquarePotential( {
        numberOfWellsProperty: numberOfWellsProperty,
        electricFieldProperty: electricFieldProperty,
        wellWidth: WELL_WIDTH_RANGE.defaultValue,
        wellWidthRange: WELL_WIDTH_RANGE,
        separation: SEPARATION_RANGE.defaultValue,
        separationRange: SEPARATION_RANGE,
        tandem: potentialsTandem.createTandem( 'finiteSquarePotential' )
      } ),
      new AnharmonicOscillatorPotential( {
        numberOfWellsProperty: numberOfWellsProperty,
        electricFieldProperty: electricFieldProperty,
        //TODO Other Properties?
        tandem: potentialsTandem.createTandem( 'anharmonicOscillatorPotential' )
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
}
