// Copyright 2025-2026, University of Colorado Boulder

/**
 * ManyWellsModel is the top-level model for the 'Many Wells' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FiniteSquarePotential, { FiniteSquarePotentialOptions } from '../../common/model/potentials/FiniteSquarePotential.js';
import PoschlTellerPotential, { PoschlTellerPotentialOptions } from '../../common/model/potentials/PoschlTellerPotential.js';
import { QuantumPotentialOptions } from '../../common/model/potentials/QuantumPotential.js';
import QBSModel from '../../common/model/QBSModel.js';
import { electronMassesUnit } from '../../common/model/units/electronMassesUnit.js';
import { voltsPerNanometerUnit } from '../../common/model/units/voltsPerNanometerUnit.js';

const WELL_WIDTH_RANGE = new RangeWithValue( 0.1, 0.5, 0.5 );
const POSCHL_TELLER_WELL_WIDTH_RANGE = new RangeWithValue( 0.1, 1.5, 0.2 );
const POSCHL_TELLER_SPACING_RANGE = new RangeWithValue( 0.05, 0.7, 0.7 );

export default class ManyWellsModel extends QBSModel {

  public readonly yAxisZoomLevelProperty: NumberProperty;

  public constructor( tandem: Tandem ) {

    const numberOfWellsProperty = new NumberProperty( 5, {
      numberType: 'Integer',
      range: new Range( 1, 10 ),
      tandem: tandem.createTandem( 'numberOfWellsProperty' )
    } );

    const electronMassesProperty = new NumberProperty( 1, {
      numberType: 'FloatingPoint',
      units: electronMassesUnit,
      range: new Range( 1, 1 )
      // No PhET-iO instrumentation, since it's effectively a constant.
    } );

    const electricFieldProperty = new NumberProperty( 0, {
      numberType: 'FloatingPoint',
      range: new Range( -1, 1 ),
      units: voltsPerNanometerUnit,
      tandem: tandem.createTandem( 'electricFieldProperty' )
    } );

    // Shared by all quantum potentials
    const quantumPotentialOptions: Partial<QuantumPotentialOptions> = {
      numberOfWellsProperty: numberOfWellsProperty,
      electricFieldProperty: electricFieldProperty
    };

    const potentialsTandem = tandem.createTandem( 'potentials' );

    const potentials = [
      new FiniteSquarePotential( combineOptions<FiniteSquarePotentialOptions>( {}, quantumPotentialOptions, {
        wellWidthRange: WELL_WIDTH_RANGE,
        tandem: potentialsTandem.createTandem( 'finiteSquarePotential' )
      } ) ),
      new PoschlTellerPotential( combineOptions<PoschlTellerPotentialOptions>( {}, quantumPotentialOptions, {
        wellWidthRange: POSCHL_TELLER_WELL_WIDTH_RANGE,
        spacingRange: POSCHL_TELLER_SPACING_RANGE,
        tandem: potentialsTandem.createTandem( 'poschlTellerPotential' )
      } ) )
    ];

    super( {
      numberOfWellsProperty: numberOfWellsProperty,
      electronMassesProperty: electronMassesProperty,
      electricFieldProperty: electricFieldProperty,
      potentials: potentials,
      hasAverageProbabilityDensityOfBandGraph: true,
      tandem: tandem
    } );

    this.yAxisZoomLevelProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      range: new Range( 0, 2 ) //TODO How many zoom levels are needed?
    } );
    //TODO Derive yAxisScaleProperty from yAxisZoomLevelProperty
  }

  public override reset(): void {
    super.reset();
    this.yAxisZoomLevelProperty.reset();
  }
}
