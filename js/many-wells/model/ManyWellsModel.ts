// Copyright 2025-2026, University of Colorado Boulder

/**
 * ManyWellsModel is the top-level model for the 'Many Wells' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import AnharmonicOscillatorPotential from '../../common/model/potentials/AnharmonicOscillatorPotential.js';
import FiniteSquarePotential from '../../common/model/potentials/FiniteSquarePotential.js';
import QBSModel from '../../common/model/QBSModel.js';
import QBSConstants from '../../common/QBSConstants.js';
import quantumBoundStates from '../../quantumBoundStates.js';

export default class ManyWellsModel extends QBSModel {

  public readonly numberOfWellsProperty: NumberProperty;

  public readonly electricFieldProperty: NumberProperty;

  public constructor( tandem: Tandem ) {

    const potentialsTandem = tandem.createTandem( 'potentials' );

    const potentials = [
      new FiniteSquarePotential( potentialsTandem.createTandem( 'finiteSquarePotential' ) ),
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
      tandem: tandem.createTandem( 'electricFieldProperty' )
    } );

    this.electricFieldProperty.link( electricField => {
      //TODO update potentials
    } );
  }

  public override reset(): void {
    super.reset();
    this.numberOfWellsProperty.reset();
    this.electricFieldProperty.reset();
  }
}

quantumBoundStates.register( 'ManyWellsModel', ManyWellsModel );