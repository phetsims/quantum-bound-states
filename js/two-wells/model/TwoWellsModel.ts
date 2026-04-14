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

const NUMBER_OF_WELLS = 2;
const WELL_WIDTH_RANGE = new RangeWithValue( 0.1, 3, 1 );
const SEPARATION_RANGE = new RangeWithValue( 0.05, 0.7, 0.1 );

export default class TwoWellsModel extends QBSModel {

  public constructor( tandem: Tandem ) {

    // Effectively constant and not PhET-iO instrumented.
    const numberOfWellsProperty = new NumberProperty( NUMBER_OF_WELLS, {
      numberType: 'Integer',
      range: new Range( NUMBER_OF_WELLS, NUMBER_OF_WELLS )
    } );

    const potentialsTandem = tandem.createTandem( 'potentials' );

    const potentials = [
      new FiniteSquarePotential( {
        numberOfWellsProperty: numberOfWellsProperty,
        wellWidth: WELL_WIDTH_RANGE.defaultValue,
        wellWidthRange: WELL_WIDTH_RANGE,
        separation: SEPARATION_RANGE.defaultValue,
        separationRange: SEPARATION_RANGE,
        tandem: potentialsTandem.createTandem( 'finiteSquarePotential' )
      } ),
      new AnharmonicOscillatorPotential( {
        numberOfWellsProperty: numberOfWellsProperty,
        //TODO Other Properties?
        tandem: potentialsTandem.createTandem( 'anharmonicOscillatorPotential' )
      } )
    ];

    super( {
      numberOfWellsProperty: numberOfWellsProperty,
      potentials: potentials,
      tandem: tandem
    } );
  }
}
