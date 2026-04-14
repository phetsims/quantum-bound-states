// Copyright 2025-2026, University of Colorado Boulder

/**
 * TwoWellsModel is the top-level model for the 'Two Wells' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

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

    const potentialsTandem = tandem.createTandem( 'potentials' );

    const potentials = [
      new FiniteSquarePotential( {
        numberOfWells: NUMBER_OF_WELLS,
        wellWidth: WELL_WIDTH_RANGE.defaultValue,
        wellWidthRange: WELL_WIDTH_RANGE,
        separation: SEPARATION_RANGE.defaultValue,
        separationRange: SEPARATION_RANGE,
        tandem: potentialsTandem.createTandem( 'finiteSquarePotential' )
      } ),
      new AnharmonicOscillatorPotential( {
        numberOfWells: NUMBER_OF_WELLS,
        //TODO Other Properties?
        tandem: potentialsTandem.createTandem( 'anharmonicOscillatorPotential' )
      } )
    ];

    super( {
      potentials: potentials,
      tandem: tandem
    } );
  }
}
