// Copyright 2025-2026, University of Colorado Boulder

/**
 * TwoWellsModel is the top-level model for the 'Two Wells' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import FiniteSquarePotential from '../../common/model/potentials/FiniteSquarePotential.js';
import PoschlTellerPotential from '../../common/model/potentials/PoschlTellerPotential.js';
import QBSModel from '../../common/model/QBSModel.js';
import { electronMassesUnit } from '../../../../scenery-phet/js/units/electronMassesUnit.js';
import { voltsPerNanometerUnit } from '../../../../scenery-phet/js/units/voltsPerNanometerUnit.js';

export default class TwoWellsModel extends QBSModel {

  public constructor( tandem: Tandem ) {

    const numberOfWellsProperty = new NumberProperty( 2, {
      numberType: 'Integer',
      range: new Range( 2, 2 ), // effectively constant
      tandem: tandem.createTandem( 'numberOfWellsProperty' ),
      phetioFeatured: true,
      phetioReadOnly: true
    } );

    const electronMassesProperty = new NumberProperty( 1, {
      numberType: 'FloatingPoint',
      units: electronMassesUnit,
      range: new Range( 1, 1 ), // effectively constant
      tandem: tandem.createTandem( 'electronMassesProperty' ),
      phetioFeatured: true,
      phetioReadOnly: true
    } );

    const electricFieldProperty = new NumberProperty( 0, {
      units: voltsPerNanometerUnit,
      range: new Range( 0, 0 ), // effectively constant
      tandem: tandem.createTandem( 'electricFieldProperty' ),
      phetioFeatured: true,
      phetioReadOnly: true
    } );

    const potentialsTandem = tandem.createTandem( 'potentials' );

    const potentials = [
      new FiniteSquarePotential( {
        numberOfWellsProperty: numberOfWellsProperty,
        electronMassesProperty: electronMassesProperty,
        electricFieldProperty: electricFieldProperty,
        wellWidthRange: new RangeWithValue( 0.5, 2.5, 1 ),
        wellDepthRange: new RangeWithValue( 1, 15, 9 ),
        separationRange: new RangeWithValue( 0.05, 0.7, 0.4 ),
        tandem: potentialsTandem.createTandem( 'finiteSquarePotential' )
      } ),
      new PoschlTellerPotential( {
        numberOfWellsProperty: numberOfWellsProperty,
        electronMassesProperty: electronMassesProperty,
        electricFieldProperty: electricFieldProperty,
        wellWidthRange: new RangeWithValue( 0.2, 0.2, 0.2 ), // effectively constant
        wellDepthRange: new RangeWithValue( 1, 11, 10 ),
        spacingRange: new RangeWithValue( 0.25, 3, 1 ),
        tandem: potentialsTandem.createTandem( 'poschlTellerPotential' )
      } )
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
