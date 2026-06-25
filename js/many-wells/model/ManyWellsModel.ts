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
import FiniteSquarePotential from '../../common/model/potentials/FiniteSquarePotential.js';
import PoschlTellerPotential from '../../common/model/potentials/PoschlTellerPotential.js';
import QBSModel from '../../common/model/QBSModel.js';
import { electronMassesUnit } from '../../../../scenery-phet/js/units/electronMassesUnit.js';
import { voltsPerNanometerUnit } from '../../../../scenery-phet/js/units/voltsPerNanometerUnit.js';
import QBSConstants from '../../common/QBSConstants.js';

export default class ManyWellsModel extends QBSModel {

  public readonly yAxisZoomLevelProperty: NumberProperty;

  public constructor( tandem: Tandem ) {

    const numberOfWellsProperty = new NumberProperty( 3, {
      numberType: 'Integer',
      range: new Range( 1, 8 ),
      tandem: tandem.createTandem( 'numberOfWellsProperty' ),
      phetioFeatured: true
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
      numberType: 'FloatingPoint',
      range: new Range( -1, 1 ),
      units: voltsPerNanometerUnit,
      tandem: tandem.createTandem( 'electricFieldProperty' ),
      phetioFeatured: true
    } );

    // Group all potentials under a parent tandem.
    const potentialsTandem = tandem.createTandem( 'potentials' );

    const potentials = [
      new FiniteSquarePotential( {
        numberOfWellsProperty: numberOfWellsProperty,
        electronMassesProperty: electronMassesProperty,
        electricFieldProperty: electricFieldProperty,
        wellWidthRange: new RangeWithValue( 0.35, 0.55, 0.45 ),
        wellWidthDecimalPlaces: QBSConstants.WELL_WIDTH_DECIMAL_PLACES_MANY_WELLS,
        wellDepthRange: new RangeWithValue( 5, 15, 9 ),
        separationRange: new RangeWithValue( 0.05, 0.25, 0.1 ),
        tandem: potentialsTandem.createTandem( 'finiteSquarePotential' )
      } ),
      new PoschlTellerPotential( {
        numberOfWellsProperty: numberOfWellsProperty,
        electronMassesProperty: electronMassesProperty,
        electricFieldProperty: electricFieldProperty,
        wellWidthRange: new RangeWithValue( 0.2, 0.2, 0.2 ), // effectively constant
        wellDepthRange: new RangeWithValue( 6, 11, 10 ),
        spacingRange: new RangeWithValue( 0.3, 0.8, 0.5 ),
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

    this.yAxisZoomLevelProperty = new NumberProperty( 0, {
      numberType: 'Integer',
      range: new Range( 0, 1 ),
      tandem: this.energyDiagram.tandem.createTandem( 'yAxisZoomLevelProperty' ),
      phetioFeatured: true
    } );
  }

  public override reset(): void {
    super.reset();
    this.yAxisZoomLevelProperty.reset();
  }
}
