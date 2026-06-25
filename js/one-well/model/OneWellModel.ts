// Copyright 2025-2026, University of Colorado Boulder

/**
 * OneWellModel is the top-level model for the 'One Well' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import { roundToInterval } from '../../../../dot/js/util/roundToInterval.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import AsymmetricTrianglePotential from '../../common/model/potentials/AsymmetricTrianglePotential.js';
import CoulombPotential from '../../common/model/potentials/CoulombPotential.js';
import FiniteSquarePotential from '../../common/model/potentials/FiniteSquarePotential.js';
import HarmonicOscillatorPotential from '../../common/model/potentials/HarmonicOscillatorPotential.js';
import InfiniteSquarePotential from '../../common/model/potentials/InfiniteSquarePotential.js';
import InfiniteStepPotential from '../../common/model/potentials/InfiniteStepPotential.js';
import MorsePotential from '../../common/model/potentials/MorsePotential.js';
import PoschlTellerPotential from '../../common/model/potentials/PoschlTellerPotential.js';
import QBSModel from '../../common/model/QBSModel.js';
import { electronMassesUnit } from '../../../../scenery-phet/js/units/electronMassesUnit.js';
import { electronVoltsUnit } from '../../../../scenery-phet/js/units/electronVoltsUnit.js';
import { voltsPerNanometerUnit } from '../../../../scenery-phet/js/units/voltsPerNanometerUnit.js';
import QBSConstants from '../../common/QBSConstants.js';

export default class OneWellModel extends QBSModel {

  // Energy offset of the selected potential.
  public readonly energyOffsetProperty: NumberProperty;

  public readonly harmonicOscillatorPotential: HarmonicOscillatorPotential;

  public constructor( tandem: Tandem ) {

    const numberOfWellsProperty = new NumberProperty( 1, {
      numberType: 'Integer',
      range: new Range( 1, 1 ), // effectively constant
      tandem: tandem.createTandem( 'numberOfWellsProperty' ),
      phetioFeatured: true,
      phetioReadOnly: true
    } );

    const electronMassesProperty = new NumberProperty( 1, {
      numberType: 'FloatingPoint',
      units: electronMassesUnit,
      range: new Range( 0.5, 1.1 ),
      tandem: tandem.createTandem( 'electronMassesProperty' ),
      phetioFeatured: true
    } );

    const electricFieldProperty = new NumberProperty( 0, {
      units: voltsPerNanometerUnit,
      range: new Range( 0, 0 ), // effectively constant
      tandem: tandem.createTandem( 'electricFieldProperty' ),
      phetioFeatured: true,
      phetioReadOnly: true
    } );

    // Default offset is zero eV, with ability to shift the range the same amount in both positive and negative directions.
    const yOffsetRange = new RangeWithValue( -10, 10, 0 );

    const potentialsTandem = tandem.createTandem( 'potentials' );

    const harmonicOscillatorPotential = new HarmonicOscillatorPotential( electronMassesProperty, {
      numberOfWellsProperty: numberOfWellsProperty,
      electronMassesProperty: electronMassesProperty,
      electricFieldProperty: electricFieldProperty,
      yOffsetRange: yOffsetRange,
      tandem: potentialsTandem.createTandem( 'harmonicOscillatorPotential' )
    } );

    // Quantum potentials, in the order that they appear in PotentialComboBox.
    const potentials = [
      new InfiniteSquarePotential( {
        numberOfWellsProperty: numberOfWellsProperty,
        electronMassesProperty: electronMassesProperty,
        electricFieldProperty: electricFieldProperty,
        yOffsetRange: yOffsetRange,
        tandem: potentialsTandem.createTandem( 'infiniteSquarePotential' )
      } ),
      new FiniteSquarePotential( {
        numberOfWellsProperty: numberOfWellsProperty,
        electronMassesProperty: electronMassesProperty,
        electricFieldProperty: electricFieldProperty,
        yOffsetRange: yOffsetRange,
        tandem: potentialsTandem.createTandem( 'finiteSquarePotential' )
      } ),
      new InfiniteStepPotential( {
        numberOfWellsProperty: numberOfWellsProperty,
        electronMassesProperty: electronMassesProperty,
        electricFieldProperty: electricFieldProperty,
        yOffsetRange: yOffsetRange,
        tandem: potentialsTandem.createTandem( 'infiniteStepPotential' )
      } ),
      new AsymmetricTrianglePotential( {
        numberOfWellsProperty: numberOfWellsProperty,
        electronMassesProperty: electronMassesProperty,
        electricFieldProperty: electricFieldProperty,
        yOffsetRange: yOffsetRange,
        tandem: potentialsTandem.createTandem( 'asymmetricTrianglePotential' )
      } ),
      harmonicOscillatorPotential,
      new PoschlTellerPotential( {
        numberOfWellsProperty: numberOfWellsProperty,
        electronMassesProperty: electronMassesProperty,
        electricFieldProperty: electricFieldProperty,
        yOffsetRange: yOffsetRange,
        tandem: potentialsTandem.createTandem( 'poschlTellerPotential' )
      } ),
      new MorsePotential( {
        numberOfWellsProperty: numberOfWellsProperty,
        electronMassesProperty: electronMassesProperty,
        electricFieldProperty: electricFieldProperty,
        yOffsetRange: yOffsetRange,
        tandem: potentialsTandem.createTandem( 'morsePotential' )
      } ),
      new CoulombPotential( {
        numberOfWellsProperty: numberOfWellsProperty,
        electronMassesProperty: electronMassesProperty,
        electricFieldProperty: electricFieldProperty,
        yOffsetRange: yOffsetRange,
        tandem: potentialsTandem.createTandem( 'coulombPotential' )
      } )
    ];

    super( {
      numberOfWellsProperty: numberOfWellsProperty,
      electronMassesProperty: electronMassesProperty,
      electricFieldProperty: electricFieldProperty,
      potentials: potentials,
      tandem: tandem
    } );

    this.harmonicOscillatorPotential = harmonicOscillatorPotential;

    this.energyOffsetProperty = new NumberProperty( this.potentialProperty.value.yOffsetProperty.value, {
      reentrant: true, // see QuantumPotential yOffsetProperty
      units: electronVoltsUnit,
      range: this.potentialProperty.value.yOffsetProperty.range,
      tandem: tandem.createTandem( 'energyOffsetProperty' ),
      phetioFeatured: true,
      phetioReadOnly: true,
      phetioDocumentation: 'Energy offset from zero eV of the selected potential'
    } );

    // Update y-offset of the selected potential so that the potential does not appear to move on the Energy Diagram.
    this.energyOffsetProperty.lazyLink( energyOffset => {
      this.potentialProperty.value.yOffsetProperty.value = roundToInterval( energyOffset, QBSConstants.Y_OFFSET_INTERVAL );
    } );

    // Synchronize energy range shift with the y-offset of the selected potential.
    const yOffsetListener = ( yOffset: number ) => {
      this.energyOffsetProperty.value = roundToInterval( yOffset, QBSConstants.Y_OFFSET_INTERVAL );
    };
    this.potentialProperty.link( ( potential, previousPotential ) => {
      if ( previousPotential && previousPotential.yOffsetProperty.hasListener( yOffsetListener ) ) {
        previousPotential.yOffsetProperty.unlink( yOffsetListener );
      }
      this.energyOffsetProperty.setValueAndRange( potential.yOffsetProperty.value, potential.yOffsetProperty.range );
      potential.yOffsetProperty.lazyLink( yOffsetListener );
    } );

    // Changing any of these Properties restarts the simulation time.
    Multilink.multilink( [ this.energyOffsetProperty ], () => {
      if ( !isSettingPhetioStateProperty.value ) {
        this.time.restart();
      }
    } );
  }

  public override reset(): void {
    super.reset();
    // Do not reset energyRangeShiftProperty.
  }
}
