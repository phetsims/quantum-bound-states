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
import { electronMassesUnit } from '../../common/model/units/electronMassesUnit.js';
import { voltsPerNanometerUnit } from '../../common/model/units/voltsPerNanometerUnit.js';

const WELL_WIDTH_RANGE = new RangeWithValue( 0.1, 0.5, 0.5 );
const SEPARATION_RANGE = new RangeWithValue( 0.05, 0.2, 0.1 );

export default class ManyWellsModel extends QBSModel {

  public readonly yAxisZoomLevelProperty: NumberProperty;

  public constructor( tandem: Tandem ) {

    const numberOfWellsProperty = new NumberProperty( 5, {
      numberType: 'Integer',
      range: new Range( 1, 10 ),
      tandem: tandem.createTandem( 'numberOfWellsProperty' )
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

    const electricFieldProperty = new NumberProperty( 0, {
      numberType: 'FloatingPoint',
      range: new Range( -1, 1 ),
      units: voltsPerNanometerUnit,
      tandem: tandem.createTandem( 'electricFieldProperty' )
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
