// Copyright 2025-2026, University of Colorado Boulder

/**
 * ManyWellsModel is the top-level model for the 'Many Wells' screen.
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
import { voltsPerNanometerUnit } from '../../common/model/units/voltsPerNanometerUnit.js';
import QBSConstants from '../../common/QBSConstants.js';

const NUMBER_OF_WELLS_RANGE = new RangeWithValue( 1, 10, 5 );
const WELL_WIDTH_RANGE = new RangeWithValue( 0.1, 0.5, 0.5 );
const SEPARATION_RANGE = new RangeWithValue( 0.05, 0.2, 0.1 );

export default class ManyWellsModel extends QBSModel {

  public readonly numberOfWellsProperty: NumberProperty;

  public readonly yAxisZoomLevelProperty: NumberProperty;

  public constructor( tandem: Tandem ) {

    const numberOfWellsProperty = new NumberProperty( NUMBER_OF_WELLS_RANGE.defaultValue, {
      numberType: 'Integer',
      range: NUMBER_OF_WELLS_RANGE,
      tandem: tandem.createTandem( 'numberOfWellsProperty' )
    } );

    const electricFieldProperty = new NumberProperty( QBSConstants.ELECTRIC_FIELD_RANGE.defaultValue, {
      numberType: 'FloatingPoint',
      range: QBSConstants.ELECTRIC_FIELD_RANGE,
      units: voltsPerNanometerUnit,
      tandem: tandem.createTandem( 'electricFieldProperty' )
    } );

    const potentialsTandem = tandem.createTandem( 'potentials' );

    const potentials = [
      new FiniteSquarePotential( {
        numberOfWells: numberOfWellsProperty.value,
        numberOfWellsRange: numberOfWellsProperty.range,
        wellWidth: WELL_WIDTH_RANGE.defaultValue,
        wellWidthRange: WELL_WIDTH_RANGE,
        separation: SEPARATION_RANGE.defaultValue,
        separationRange: SEPARATION_RANGE,
        electricFieldProperty: electricFieldProperty,
        tandem: potentialsTandem.createTandem( 'finiteSquarePotential' )
      } ),
      new AnharmonicOscillatorPotential( {
        numberOfWells: numberOfWellsProperty.value,
        numberOfWellsRange: numberOfWellsProperty.range,
        //TODO Other Properties?
        tandem: potentialsTandem.createTandem( 'anharmonicOscillatorPotential' )
      } )
    ];

    super( {
      electricFieldProperty: electricFieldProperty,
      potentials: potentials,
      hasAverageProbabilityDensityOfBandGraph: true,
      tandem: tandem
    } );

    this.numberOfWellsProperty = numberOfWellsProperty;

    this.numberOfWellsProperty.link( numberOfWells => {
      potentials.forEach( potential => {
        potential.numberOfWellsProperty.value = numberOfWells;
      } );
    } );

    this.yAxisZoomLevelProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      range: new Range( 0, 2 ) //TODO How many zoom levels are needed?
    } );
    //TODO Derive yAxisScaleProperty from yAxisZoomLevelProperty
  }

  public override reset(): void {
    super.reset();
    this.numberOfWellsProperty.reset();
    this.electricFieldProperty.reset();
    this.yAxisZoomLevelProperty.reset();
  }
}
