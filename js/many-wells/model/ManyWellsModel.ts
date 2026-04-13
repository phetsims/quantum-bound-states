// Copyright 2025-2026, University of Colorado Boulder

/**
 * ManyWellsModel is the top-level model for the 'Many Wells' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import AnharmonicOscillatorPotential from '../../common/model/potentials/AnharmonicOscillatorPotential.js';
import FiniteSquarePotential from '../../common/model/potentials/FiniteSquarePotential.js';
import QBSModel from '../../common/model/QBSModel.js';
import { voltsPerNanometerUnit } from '../../common/model/units/voltsPerNanometerUnit.js';
import QBSConstants from '../../common/QBSConstants.js';

export default class ManyWellsModel extends QBSModel {

  public readonly numberOfWellsProperty: NumberProperty;

  public readonly electricFieldProperty: NumberProperty;

  public readonly yAxisZoomLevelProperty: NumberProperty;

  public constructor( tandem: Tandem ) {

    const potentialsTandem = tandem.createTandem( 'potentials' );

    const potentials = [
      new FiniteSquarePotential( {
        tandem: potentialsTandem.createTandem( 'finiteSquarePotential' )
      } ),
      new AnharmonicOscillatorPotential( potentialsTandem.createTandem( 'anharmonicOscillatorPotential' ) )
    ];

    super( {
      potentials: potentials,
      hasAverageProbabilityDensityOfBandGraph: true,
      tandem: tandem
    } );

    this.numberOfWellsProperty = new NumberProperty( QBSConstants.NUMBER_OF_WELLS_RANGE.defaultValue, {
      numberType: 'Integer',
      range: QBSConstants.NUMBER_OF_WELLS_RANGE,
      tandem: tandem.createTandem( 'numberOfWellsProperty' )
    } );

    this.numberOfWellsProperty.link( numberOfWells => {
      //TODO update potentials
    } );

    this.electricFieldProperty = new NumberProperty( QBSConstants.ELECTRIC_FIELD_RANGE.defaultValue, {
      numberType: 'FloatingPoint',
      range: QBSConstants.ELECTRIC_FIELD_RANGE,
      units: voltsPerNanometerUnit,
      tandem: tandem.createTandem( 'electricFieldProperty' )
    } );

    this.electricFieldProperty.link( electricField => {
      //TODO update potentials
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
