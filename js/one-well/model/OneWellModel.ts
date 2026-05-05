// Copyright 2025-2026, University of Colorado Boulder

/**
 * OneWellModel is the top-level model for the 'One Well' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import { roundToInterval } from '../../../../dot/js/util/roundToInterval.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import AsymmetricTrianglePotential, { AsymmetricTrianglePotentialOptions } from '../../common/model/potentials/AsymmetricTrianglePotential.js';
import CoulombPotential, { CoulombPotentialOptions } from '../../common/model/potentials/CoulombPotential.js';
import FiniteSquarePotential, { FiniteSquarePotentialOptions } from '../../common/model/potentials/FiniteSquarePotential.js';
import HarmonicOscillatorPotential, { HarmonicOscillatorPotentialOptions } from '../../common/model/potentials/HarmonicOscillatorPotential.js';
import InfiniteSquarePotential, { InfiniteSquarePotentialOptions } from '../../common/model/potentials/InfiniteSquarePotential.js';
import InfiniteStepPotential, { InfiniteStepPotentialOptions } from '../../common/model/potentials/InfiniteStepPotential.js';
import MorsePotential, { MorsePotentialOptions } from '../../common/model/potentials/MorsePotential.js';
import PoschlTellerPotential, { PoschlTellerPotentialOptions } from '../../common/model/potentials/PoschlTellerPotential.js';
import { QuantumPotentialOptions } from '../../common/model/potentials/QuantumPotential.js';
import QBSModel from '../../common/model/QBSModel.js';
import { electronMassesUnit } from '../../common/model/units/electronMassesUnit.js';
import { electronVoltsUnit } from '../../common/model/units/electronVoltsUnit.js';
import { voltsPerNanometerUnit } from '../../common/model/units/voltsPerNanometerUnit.js';
import QBSConstants from '../../common/QBSConstants.js';

export default class OneWellModel extends QBSModel {

  // How much the y-axis range of the Energy Diagram should shift from its baseline range (when the selected potential's y-offset is zero).
  public readonly energyRangeShiftProperty: NumberProperty;

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

    // Shared by all quantum potentials
    const quantumPotentialOptions: Partial<QuantumPotentialOptions> = {
      numberOfWellsProperty: numberOfWellsProperty,
      electricFieldProperty: electricFieldProperty,
      xOffsetRange: new RangeWithValue( -3, 3, 0 ),
      yOffsetRange: new RangeWithValue( -10, 10, 0 ) //TODO This assumes that all potentials have energyAxisRange.getLength() === 20
    };

    const potentialsTandem = tandem.createTandem( 'potentials' );

    // Quantum potentials, in the order that they appear in PotentialComboBox.
    const potentials = [
      new InfiniteSquarePotential( combineOptions<InfiniteSquarePotentialOptions>( {}, quantumPotentialOptions, {
        tandem: potentialsTandem.createTandem( 'infiniteSquarePotential' )
      } ) ),
      new FiniteSquarePotential( combineOptions<FiniteSquarePotentialOptions>( {}, quantumPotentialOptions, {
        tandem: potentialsTandem.createTandem( 'finiteSquarePotential' )
      } ) ),
      new InfiniteStepPotential( combineOptions<InfiniteStepPotentialOptions>( {}, quantumPotentialOptions, {
        tandem: potentialsTandem.createTandem( 'infiniteStepPotential' )
      } ) ),
      new AsymmetricTrianglePotential( combineOptions<AsymmetricTrianglePotentialOptions>( {}, quantumPotentialOptions, {
        tandem: potentialsTandem.createTandem( 'asymmetricTrianglePotential' )
      } ) ),
      new HarmonicOscillatorPotential( combineOptions<HarmonicOscillatorPotentialOptions>( {}, quantumPotentialOptions, {
        tandem: potentialsTandem.createTandem( 'harmonicOscillatorPotential' )
      } ) ),
      new PoschlTellerPotential( combineOptions<PoschlTellerPotentialOptions>( {}, quantumPotentialOptions, {
        //TODO Other Properties?
        tandem: potentialsTandem.createTandem( 'poschlTellerPotential' )
      } ) ),
      new MorsePotential( combineOptions<MorsePotentialOptions>( {}, quantumPotentialOptions, {
        //TODO Other Properties?
        tandem: potentialsTandem.createTandem( 'morsePotential' )
      } ) ),
      new CoulombPotential( combineOptions<CoulombPotentialOptions>( {}, quantumPotentialOptions, {
        tandem: potentialsTandem.createTandem( 'coulombPotential' )
      } ) )
    ];

    super( {
      numberOfWellsProperty: numberOfWellsProperty,
      electronMassesProperty: electronMassesProperty,
      electricFieldProperty: electricFieldProperty,
      potentials: potentials,
      tandem: tandem
    } );

    this.energyRangeShiftProperty = new NumberProperty( this.potentialProperty.value.yOffsetProperty.value, {
      units: electronVoltsUnit,
      range: this.potentialProperty.value.yOffsetProperty.range
      // PhET-iO instrumentation is not necessary.
    } );

    // Update y-offset of the selected potential so that the potential does not appear to move on the Energy Diagram.
    this.energyRangeShiftProperty.lazyLink( energyAxisShift => {
      this.potentialProperty.value.yOffsetProperty.value = roundToInterval( -energyAxisShift, QBSConstants.Y_OFFSET_INTERVAL );
      console.log( 'energyAxisShift = ' + energyAxisShift );
    } );

    // Synchronize energy range shift with the y-offset of the selected potential.
    const yOffsetListener = ( yOffset: number ) => {
      this.energyRangeShiftProperty.value = roundToInterval( -yOffset, QBSConstants.Y_OFFSET_INTERVAL );
    };
    this.potentialProperty.link( ( potential, previousPotential ) => {

      const energyRangeShift = roundToInterval( -potential.yOffsetProperty.value, QBSConstants.Y_OFFSET_INTERVAL );
      this.energyRangeShiftProperty.setValueAndRange( energyRangeShift, potential.yOffsetProperty.range );
      
      if ( previousPotential && previousPotential.yOffsetProperty.hasListener( yOffsetListener ) ) {
        previousPotential.yOffsetProperty.unlink( yOffsetListener );
      }
      potential.yOffsetProperty.lazyLink( yOffsetListener );
    } );
  }
}
