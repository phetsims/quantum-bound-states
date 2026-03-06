// Copyright 2025-2026, University of Colorado Boulder

/**
 * ManyWellsModel is the top-level model for the 'Many Wells' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FiniteSquarePotential from '../../common/model/potentials/FiniteSquarePotential.js';
import QBSModel from '../../common/model/QBSModel.js';
import QBSConstants from '../../common/QBSConstants.js';
import quantumBoundStates from '../../quantumBoundStates.js';

export default class ManyWellsModel extends QBSModel {

  public readonly numberOfWellsProperty: NumberProperty;

  public constructor( tandem: Tandem ) {

    const potentialsTandem = tandem.createTandem( 'potentials' );
    const finiteSquarePotential = new FiniteSquarePotential( potentialsTandem.createTandem( 'finiteSquarePotential' ) );

    super( {
      potential: finiteSquarePotential,
      potentials: [ finiteSquarePotential ],
      hasAverageProbabilityDensityOfBandGraph: true,
      tandem: tandem
    } );

    this.numberOfWellsProperty = new NumberProperty( QBSConstants.NUMBER_OF_WELLS_RANGE.defaultValue, {
      numberType: 'Integer',
      range: QBSConstants.NUMBER_OF_WELLS_RANGE,
      tandem: tandem.createTandem( 'numberOfWellsProperty' )
    } );
    //TODO this.numberOfWellsProperty.link to update potentials
  }
}

quantumBoundStates.register( 'ManyWellsModel', ManyWellsModel );