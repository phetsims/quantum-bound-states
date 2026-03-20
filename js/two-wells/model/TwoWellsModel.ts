// Copyright 2025-2026, University of Colorado Boulder

/**
 * TwoWellsModel is the top-level model for the 'Two Wells' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import AnharmonicOscillatorPotential from '../../common/model/potentials/AnharmonicOscillatorPotential.js';
import DoubleSquarePotential from '../../common/model/potentials/DoubleSquarePotential.js';
import QBSModel from '../../common/model/QBSModel.js';

export default class TwoWellsModel extends QBSModel {

  public constructor( tandem: Tandem ) {

    const potentialsTandem = tandem.createTandem( 'potentials' );

    const potentials = [
      new DoubleSquarePotential( potentialsTandem.createTandem( 'doubleSquarePotential' ) ),
      new AnharmonicOscillatorPotential( potentialsTandem.createTandem( 'anharmonicOscillatorPotential' ) )
    ];

    super( {
      potentials: potentials,
      tandem: tandem
    } );
  }
}
