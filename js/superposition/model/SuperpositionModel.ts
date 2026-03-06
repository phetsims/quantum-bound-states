// Copyright 2025-2026, University of Colorado Boulder

/**
 * SuperpositionModel is the top-level model for the 'Superposition' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FiniteSquarePotential from '../../common/model/potentials/FiniteSquarePotential.js';
import QBSModel from '../../common/model/QBSModel.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import { SuperpositionConfigurationType, SuperpositionConfigurationTypeValues } from './SuperpositionConfigurationType.js';

export default class SuperpositionModel extends QBSModel {

  public readonly superpositionConfigurationTypeProperty: Property<SuperpositionConfigurationType>;

  public constructor( tandem: Tandem ) {

    const potentialsTandem = tandem.createTandem( 'potentials' );
    const finiteSquarePotential = new FiniteSquarePotential( potentialsTandem.createTandem( 'finiteSquarePotential' ) );

    super( {
      potential: finiteSquarePotential,
      potentials: [ finiteSquarePotential ],
      tandem: tandem
    } );

    this.superpositionConfigurationTypeProperty = new StringUnionProperty( 'preset', {
      validValues: SuperpositionConfigurationTypeValues,
      tandem: tandem.createTandem( 'superpositionConfigurationTypeProperty' )
    } );
  }

  public override reset(): void {
    super.reset();
    this.superpositionConfigurationTypeProperty.reset();
  }
}

quantumBoundStates.register( 'SuperpositionModel', SuperpositionModel );