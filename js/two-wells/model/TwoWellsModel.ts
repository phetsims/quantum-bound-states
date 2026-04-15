// Copyright 2025-2026, University of Colorado Boulder

/**
 * TwoWellsModel is the top-level model for the 'Two Wells' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FiniteSquarePotential, { FiniteSquarePotentialOptions } from '../../common/model/potentials/FiniteSquarePotential.js';
import MorsePotential, { MorsePotentialOptions } from '../../common/model/potentials/MorsePotential.js';
import PoschlTellerPotential, { PoschlTellerPotentialOptions } from '../../common/model/potentials/PoschlTellerPotential.js';
import { QuantumPotentialOptions } from '../../common/model/potentials/QuantumPotential.js';
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
      range: new Range( 1, 1 )
    } );

    // Effectively constant
    const electricFieldProperty = new NumberProperty( 0, {
      units: voltsPerNanometerUnit,
      range: new Range( 0, 0 )
    } );

    // Shared by all quantum potentials
    const quantumPotentialOptions: Partial<QuantumPotentialOptions> = {
      numberOfWellsProperty: numberOfWellsProperty,
      electricFieldProperty: electricFieldProperty
    };

    const potentialsTandem = tandem.createTandem( 'potentials' );

    const potentials = [
      new FiniteSquarePotential( combineOptions<FiniteSquarePotentialOptions>( {}, quantumPotentialOptions, {
        wellWidth: WELL_WIDTH_RANGE.defaultValue,
        wellWidthRange: WELL_WIDTH_RANGE,
        separation: SEPARATION_RANGE.defaultValue,
        separationRange: SEPARATION_RANGE,
        tandem: potentialsTandem.createTandem( 'finiteSquarePotential' )
      } ) ),
      new PoschlTellerPotential( combineOptions<PoschlTellerPotentialOptions>( {}, quantumPotentialOptions, {
        //TODO Other Properties?
        tandem: potentialsTandem.createTandem( 'poschlTellerPotential' )
      } ) ),
      new MorsePotential( combineOptions<MorsePotentialOptions>( {}, quantumPotentialOptions, {
        //TODO Other Properties?
        tandem: potentialsTandem.createTandem( 'morsePotential' )
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
