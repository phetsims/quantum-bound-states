// Copyright 2025-2026, University of Colorado Boulder

/**
 * QBSModel is the base class for the top-level model in this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import TModel from '../../../../joist/js/TModel.js';
import affirm, { affirmCallback, isAffirmEnabled } from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import QBSConstants from '../QBSConstants.js';
import QBSQueryParameters from '../QBSQueryParameters.js';
import EnergyDiagram from './EnergyDiagram.js';
import Magnifier from './Magnifier.js';
import QuantumPotential from './potentials/QuantumPotential.js';
import ProbabilityDensityGraph from './ProbabilityDensityGraph.js';
import QBSTime from './QBSTime.js';
import QuantumStateGraph from './QuantumStateGraph.js';
import ReferenceLine from './ReferenceLine.js';
import BoundStateResult from './solvers/BoundStateResult.js';
import XGrid from './solvers/XGrid.js';
import SuperpositionCoefficients from './SuperpositionCoefficients.js';
import { TimeEvolvedSuperposition, TimeEvolvedSuperpositionIO } from './TimeEvolvedSuperposition.js';
import WaveFunctionGraph from './WaveFunctionGraph.js';

type SelfOptions = {

  // Set of quantum potential instances supported by the model.
  potentials: QuantumPotential[];

  // Quantum potential instance that is initially selected.
  potential?: QuantumPotential;

  // Properties that are shared by all potentials. QBSModel is responsible for resetting these.
  numberOfWellsProperty: NumberProperty;
  electronMassesProperty: NumberProperty;
  electricFieldProperty: NumberProperty;
};

export type QBSModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class QBSModel implements TModel {

  public readonly time: QBSTime;

  // The quantum potential that is currently selected.
  public readonly potentialProperty: Property<QuantumPotential>;
  public readonly potentials: QuantumPotential[];

  // Properties that are shared by all potentials.
  public readonly numberOfWellsProperty: NumberProperty;
  public readonly electronMassesProperty: NumberProperty;
  public readonly electricFieldProperty: NumberProperty;

  public readonly superpositionCoefficientsProperty: Property<SuperpositionCoefficients>;

  // Result for configuration of the selected quantum potential.
  public readonly boundStateResultProperty: Property<BoundStateResult>;

  // Constant grid of x-coordinates, used for all graphs.
  public readonly xGrid: XGrid;

  // Index (aka quantum number) of the selected energy level
  //TODO This is irrelevant for Superposition screen.
  public readonly selectedEnergyLevelIndexProperty: NumberProperty;

  // Number of nodes in the Probability Density curve. This is equal to the 1-based index into BoundStateResult.energies
  // that corresponds to selectedEnergyLevelIndexProperty, and therefore corresponds to what is displayed in the
  // Probability Density graph.
  //TODO This is irrelevant for Superposition screen.
  public readonly numberOfNodesProperty: TReadOnlyProperty<number>;

  // Index (aka quantum number) of the highlighted energy level. null if there is no energy level highlighted.
  public readonly highlightedEnergyLevelIndexProperty: Property<number | null>;

  // Energy diagram
  public readonly energyDiagram: EnergyDiagram;

  // The possible QuantumStateGraphs.
  public readonly probabilityDensityGraph: ProbabilityDensityGraph;
  public readonly waveFunctionGraph: WaveFunctionGraph;

  // The QuantumStateGraph that is currently selected and displayed.
  public readonly selectedGraphProperty: Property<QuantumStateGraph>;

  // Whether curves are visible on the QuantumStateGraphs. Applies to all graphs.
  public readonly curvesVisibleProperty: Property<boolean>;

  // y-axis values for plotting components of the time-dependent wave function
  public readonly timeEvolvedSuperpositionProperty: TReadOnlyProperty<TimeEvolvedSuperposition>;

  public readonly magnifier: Magnifier;
  public readonly referenceLine: ReferenceLine;

  protected constructor( providedOptions: QBSModelOptions ) {

    const options = optionize<QBSModelOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      potential: providedOptions.potentials[ 0 ]
    }, providedOptions );

    this.numberOfWellsProperty = options.numberOfWellsProperty;
    this.electronMassesProperty = options.electronMassesProperty;
    this.electricFieldProperty = options.electricFieldProperty;

    this.time = new QBSTime( options.tandem.createTandem( 'time' ) );

    this.xGrid = new XGrid( {
      xMin: QBSConstants.ALL_GRAPHS_X_RANGE.min,
      xMax: QBSConstants.ALL_GRAPHS_X_RANGE.max,
      numberOfPoints: QBSQueryParameters.numberOfPoints,
      tandem: options.tandem.createTandem( 'xGrid' )
    } );

    this.potentialProperty = new Property( options.potential, {
      validValues: options.potentials,
      phetioValueType: QuantumPotential.QuantumPotentialIO,
      tandem: options.tandem.createTandem( 'potentialProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'The selected quantum potential'
    } );
    this.potentials = options.potentials;

    this.boundStateResultProperty = new Property( solveBoundState( options.potential, this.xGrid ), {
      tandem: options.tandem.createTandem( 'boundStateResultProperty' ),
      phetioValueType: BoundStateResult.BoundStateResultIO,
      phetioFeatured: true,
      phetioReadOnly: true,
      phetioDocumentation: 'Bound state information for the selected quantum potential. See BoundStateResultIO for details.'
    } );

    this.superpositionCoefficientsProperty = new Property( new SuperpositionCoefficients() );

    this.energyDiagram = new EnergyDiagram( this, options.tandem.createTandem( 'energyDiagram' ) );

    this.selectedEnergyLevelIndexProperty = new NumberProperty( this.potentialProperty.value.groundStateIndex, {
      numberType: 'Integer',
      range: getEnergyLevelIndexRange( this.potentialProperty.value.groundStateIndex, this.boundStateResultProperty.value.energies.length ),
      tandem: options.tandem.createTandem( 'selectedEnergyLevelIndexProperty' ),
      phetioFeatured: true,
      phetioReadOnly: true,
      phetioDocumentation: 'Energy level index of the selected potential'
    } );

    this.highlightedEnergyLevelIndexProperty = new Property<number | null>( null, {

      // This is transient and not needed for PhET-iO state. But instrumenting it will prevent reports of
      // State Wrapper problems during QA.
      tandem: options.tandem.createTandem( 'highlightedEnergyLevelIndexProperty' ),
      phetioValueType: NullableIO( NumberIO ),
      phetioFeatured: true,
      phetioReadOnly: true,
      phetioDocumentation: 'Energy level index of the highlighted potential'
    } );

    // When the bound state changes, clear the highlighted energy level.
    this.boundStateResultProperty.lazyLink( () => {
      if ( !isSettingPhetioStateProperty.value ) {
        this.highlightedEnergyLevelIndexProperty.value = null;
      }
    } );

    const potentialChangedListener = () => {
      this.boundStateResultProperty.value = solveBoundState( this.potentialProperty.value, this.xGrid );
    };
    this.potentialProperty.value.changedEmitter.addListener( potentialChangedListener );

    this.potentialProperty.lazyLink( ( potential, previousPotential ) => {

      // Move potentialChangedListener to the new potential.
      if ( previousPotential.changedEmitter.hasListener( potentialChangedListener ) ) {
        previousPotential.changedEmitter.removeListener( potentialChangedListener );
      }
      potential.changedEmitter.addListener( potentialChangedListener );

      if ( !isSettingPhetioStateProperty.value ) {

        // Recompute the bound state.
        this.boundStateResultProperty.value = solveBoundState( this.potentialProperty.value, this.xGrid );

        // Adjust energy level index range and set to the ground state.
        const energyLevelIndexRange = getEnergyLevelIndexRange( potential.groundStateIndex, this.boundStateResultProperty.value.energies.length );
        this.selectedEnergyLevelIndexProperty.setValueAndRange( energyLevelIndexRange.min, energyLevelIndexRange );
      }
    } );

    // When boundStateResult is changed, adjust the energy level index range. If the current energy level no longer exists,
    // set to the ground state.
    this.boundStateResultProperty.lazyLink( boundStateResult => {
      if ( !isSettingPhetioStateProperty.value ) {
        const energyLevelIndexRange = getEnergyLevelIndexRange( this.potentialProperty.value.groundStateIndex, boundStateResult.energies.length );
        if ( energyLevelIndexRange.contains( this.selectedEnergyLevelIndexProperty.value ) ) {
          this.selectedEnergyLevelIndexProperty.rangeProperty.value = energyLevelIndexRange;
        }
        else {
          this.selectedEnergyLevelIndexProperty.setValueAndRange( energyLevelIndexRange.min, energyLevelIndexRange );
        }
      }
    } );

    this.timeEvolvedSuperpositionProperty = new DerivedProperty(
      [ this.time.currentTimeProperty, this.boundStateResultProperty, this.selectedEnergyLevelIndexProperty ],
      ( currentTime, boundStateResult, selectedEnergyLevelIndex ) =>
        getTimeEvolvedSuperposition( currentTime, this.xGrid, boundStateResult, selectedEnergyLevelIndex, this.potentialProperty.value.groundStateIndex ), {
        tandem: options.tandem.createTandem( 'timeEvolvedSuperpositionProperty' ),
        phetioValueType: TimeEvolvedSuperpositionIO,
        phetioFeatured: true
      } );

    this.numberOfNodesProperty = new DerivedProperty( [ this.selectedEnergyLevelIndexProperty ],
      selectedEnergyLevelIndex => selectedEnergyLevelIndex - this.potentialProperty.value.groundStateIndex + 1 );

    // Group all quantum state graphs under a parent tandem.
    const quantumStateGraphsTandem = options.tandem.createTandem( 'quantumStateGraphs' );

    this.probabilityDensityGraph = new ProbabilityDensityGraph( this, quantumStateGraphsTandem.createTandem( 'probabilityDensityGraph' ) );
    this.waveFunctionGraph = new WaveFunctionGraph( this, quantumStateGraphsTandem.createTandem( 'waveFunctionGraph' ) );

    this.selectedGraphProperty = new Property<QuantumStateGraph>( this.probabilityDensityGraph, {
      // The order of validValues determines the order of radio buttons in QuatumStateGraphRadioButtonGroup.
      validValues: [ this.probabilityDensityGraph, this.waveFunctionGraph ],
      tandem: options.tandem.createTandem( 'selectedGraphProperty' ),
      phetioValueType: QuantumStateGraph.QuantumStateGraphIO,
      phetioFeatured: true
    } );

    this.curvesVisibleProperty = new BooleanProperty( true, {
      tandem: quantumStateGraphsTandem.createTandem( 'curvesVisibleProperty' ),
      phetioFeatured: true
    } );

    this.magnifier = new Magnifier( options.tandem.createTandem( 'magnifier' ) );

    this.referenceLine = new ReferenceLine( options.tandem.createTandem( 'referenceLine' ) );

    // Changing any of these Properties restarts the simulation time.
    Multilink.multilink( [ this.boundStateResultProperty ], () => {
      if ( !isSettingPhetioStateProperty.value ) {
        this.time.restart();
      }
    } );
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    this.time.reset();
    this.numberOfWellsProperty.reset();
    this.electronMassesProperty.reset();
    this.electricFieldProperty.reset();
    this.potentialProperty.reset();
    this.potentials.forEach( potential => potential.reset() );
    this.superpositionCoefficientsProperty.reset(); //TODO Should this be reset?
    this.selectedEnergyLevelIndexProperty.reset();
    this.highlightedEnergyLevelIndexProperty.reset();
    this.energyDiagram.reset();
    this.probabilityDensityGraph.reset();
    this.waveFunctionGraph.reset();
    this.selectedGraphProperty.reset();
    this.magnifier.reset();
    this.referenceLine.reset();
    this.curvesVisibleProperty.reset();
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    if ( this.time.isPlayingProperty.value ) {
      this.time.step( dt );
    }
  }

  /**
   * Determines whether the specified energy level (aka quantum number) is valid for the current configuration
   * of the selected quantum potential.
   */
  public isValidEnergyLevelIndex( energyLevelIndex: number ): boolean {
    const groundStateIndex = this.potentialProperty.value.groundStateIndex;
    const energiesIndex = energyLevelIndex - groundStateIndex;
    const energies = this.boundStateResultProperty.value.energies;
    return ( energiesIndex >= 0 && energiesIndex < energies.length );
  }

  /**
   * Gets the energy (in eV) at a given energy level for the selected quantum potential.
   */
  public getEnergyAtEnergyLevel( energyLevelIndex: number ): number {
    const energies = this.boundStateResultProperty.value.energies;
    const groundStateIndex = this.potentialProperty.value.groundStateIndex;
    const index = energyLevelIndex - groundStateIndex;
    affirmCallback( () => index >= 0 && index < energies.length, `index out of range: ${index}` );
    return energies[ index ];
  }

  /**
   * Gets the time-independent wave function values for a specified energy level.
   */
  public getWaveFunctionsForEnergyLevel( energyLevelIndex: number ): number[] {
    const groundStateIndex = this.potentialProperty.value.groundStateIndex;
    const waveFunctionsIndex = energyLevelIndex - groundStateIndex;
    const waveFunctions = this.boundStateResultProperty.value.waveFunctions;
    affirmCallback( () => waveFunctionsIndex >= 0 && waveFunctionsIndex < waveFunctions.length, `waveFunctionIndex out of range: ${waveFunctionsIndex}` );
    return waveFunctions[ waveFunctionsIndex ];
  }

  //TODO This only works for superposition states with 1 non-zero coefficient, so it should eventually go away.
  //TODO  And replaced by something that determines the range based on the superposition state.
  /**
   * Gets the y-axis range (energy range) that will fit the time-independent wave function curve for the
   * specified energy level.
   */
  public getWaveFunctionRangeForEnergyLevel( energyLevelIndex: number ): Range {
    const selectedWaveFunctionValues = this.getWaveFunctionsForEnergyLevel( energyLevelIndex );

    //TODO It would be more performant to return maxWaveFunctionValues: number[] as part of BoundStateResult
    const minY = Math.min( ...selectedWaveFunctionValues );
    const maxY = Math.max( ...selectedWaveFunctionValues );
    const maxAbsY = Math.max( Math.abs( minY ), Math.abs( maxY ) );

    // Guard against maxAbsY === 0 or NaN, which occurs when the wave function is all zeros (the placeholder used
    // for the no-bound-state edge case, see https://github.com/phetsims/quantum-bound-states/issues/56). A degenerate
    // Range(0,0) propagates to setYTickSpacing(0), crashing bamboo's forEachSpacing with NaN.
    const safeMaxAbsY = ( maxAbsY > 0 && Number.isFinite( maxAbsY ) ) ? maxAbsY : 1;
    return new Range( -safeMaxAbsY, safeMaxAbsY );
  }

  /**
   * Gets the y-axis range (energy range) that will fit the time-independent probability density curve for the
   * specified energy level.
   */
  public getProbabilityDensityRangeForEnergyLevel( energyLevelIndex: number ): Range {
    const waveFunctionRange = this.getWaveFunctionRangeForEnergyLevel( energyLevelIndex );
    return new Range( 0, waveFunctionRange.max * waveFunctionRange.max );
  }

  /**
   * Gets the index of the energy level that is closest to some energy value, within some threshold.  If there is no
   * energy level within the threshold, then null is returned. This implementation was adapted from BSModel.java.
   */
  public getClosestEnergyLevelIndex( energy: number, threshold: number ): number | null {
    let index = -1;
    const energies = this.boundStateResultProperty.value.energies;
    if ( energies.length === 1 ) {
      if ( Math.abs( energies[ 0 ] - energy ) <= threshold ) {
        index = 0;
      }
    }
    else {
      for ( let i = 1; i < energies.length; i++ ) {
        const currentEnergy = energies[ i ];
        if ( energy === currentEnergy ) {
          index = i;
          break;
        }
        else if ( energy < currentEnergy ) {
          const lowerEnergy = energies[ i - 1 ];
          const currentEnergyDifference = Math.abs( currentEnergy - energy );
          const lowerEnergyDifference = Math.abs( energy - lowerEnergy );
          if ( currentEnergyDifference <= lowerEnergyDifference && currentEnergyDifference <= threshold ) {
            index = i;
            break;
          }
          else if ( currentEnergyDifference > lowerEnergyDifference && lowerEnergyDifference <= threshold ) {
            index = i - 1;
            break;
          }
        }
      }
    }

    // Adjust for the ground state index.
    return ( index === -1 ) ? null : index + this.potentialProperty.value.groundStateIndex;
  }

  /**
   * Gets the closest potential energy value at the specified position.
   */
  public getPotentialEnergyAt( x: number ): number {
    const index = this.xGrid.getClosestIndex( x );
    return this.boundStateResultProperty.value.potentials[ index ];
  }

  /**
   * Gets the closest probability density value at the specified position.
   */
  public getProbabilityDensityAt( x: number ): number {
    const index = this.xGrid.getClosestIndex( x );
    return this.timeEvolvedSuperpositionProperty.value.probabilityDensityValues[ index ];
  }

  /**
   * Gets the closest real part value for the wave function at the specified position.
   */
  public getRealPartAt( x: number ): number {
    const index = this.xGrid.getClosestIndex( x );
    return this.timeEvolvedSuperpositionProperty.value.realPartValues[ index ];
  }

  /**
   * Gets the closest imaginary part value for the wave function at the specified position.
   */
  public getImaginaryPartAt( x: number ): number {
    const index = this.xGrid.getClosestIndex( x );
    return this.timeEvolvedSuperpositionProperty.value.imaginaryPartValues[ index ];
  }

  /**
   * Gets the closest magnitude value for the wave function at the specified position.
   */
  public getMagnitudeAt( x: number ): number {
    const index = this.xGrid.getClosestIndex( x );
    return this.timeEvolvedSuperpositionProperty.value.magnitudeValues[ index ];
  }

  /**
   * Gets the closest phase value for the wave function at the specified position.
   */
  public getPhaseAt( x: number ): number {
    const index = this.xGrid.getClosestIndex( x );
    return this.timeEvolvedSuperpositionProperty.value.phaseValues[ index ];
  }
}

/**
 * Gets the energy level range for the given ground state index and number of energy levels.
 */
function getEnergyLevelIndexRange( groundStateIndex: number, numberOfEnergyLevels: number ): Range {
  return new Range( groundStateIndex, groundStateIndex + numberOfEnergyLevels - 1 );
}

/**
 * Solve for bound state and validate the result.
 */
function solveBoundState( potential: QuantumPotential, xGrid: XGrid ): BoundStateResult {

  let result = potential.solveBoundState( xGrid );

  if ( isAffirmEnabled() ) {
    affirm( result.potentials.length === xGrid.xCoordinates.length &&
            result.energies.length > 0 &&
            result.waveFunctions.length === result.energies.length,
      `Invalid BoundStateResult for ${potential.toString()}\n` +
      `  solutionMethod = ${result.solutionMethod}\n` +
      `  xGrid.length = ${xGrid.xCoordinates.length}\n` +
      `  potentials.length = ${result.potentials.length}\n` +
      `  energies.length = ${result.energies.length}\n` +
      `  waveFunctions.length = ${result.waveFunctions.length}` );
  }

  // If the result was invalid, apply a workaround so that the sim does not crash in the built version.
  // This is necessary because the sim has a large number of parameters and (even with unit tests) there
  // may be configurations that yield an invalid result.
  if ( result.energies.length === 0 || result.waveFunctions.length === 0 ) {
    console.warn( `Invalid BoundStateResult for ${potential.toString()}` );
    result = new BoundStateResult( {
      potentials: result.potentials,
      energies: [ 0 ],
      waveFunctions: [ new Array( xGrid.xCoordinates.length ).fill( 0 ) ],
      solutionMethod: result.solutionMethod
    } );
  }

  return result;
}

/**
 * TODO document
 */
function getTimeEvolvedSuperposition( currentTime: number, // femtoseconds
                                      xGrid: XGrid,
                                      boundStateResult: BoundStateResult,
                                      selectedEnergyLevelIndex: number,
                                      groundStateIndex: number ): TimeEvolvedSuperposition {

  const numberOfEnergyLevels = boundStateResult.energies.length;
  const numberOfPoints = xGrid.numberOfPoints;

  //TODO Temporary: All superpositionCoefficient amplitudes are zero except for the selected energy level.
  //TODO In QPPW this was superpositionConfigProperty: Property<SuperpositionConfig>
  const superpositionMagnitudeValues = new Array( numberOfEnergyLevels ).fill( 0 );
  superpositionMagnitudeValues[ selectedEnergyLevelIndex - groundStateIndex ] = 1;
  const superpositionPhaseValues = new Array( numberOfEnergyLevels ).fill( 0 ); //TODO

  // Initialize arrays
  const realPartValues = new Array( numberOfPoints ).fill( 0 );
  const imaginaryPartValues = new Array( numberOfPoints ).fill( 0 );
  const magnitudeValues = new Array( numberOfPoints );
  const phaseValues = new Array( numberOfPoints );
  const probabilityDensityValues = new Array( numberOfPoints );

  // Compute time-evolved superposition: ψ(x,t) = Σ c_n * e^(iφ_n) * ψ_n(x) * e^(-iE_n*t/ℏ)

  for ( let n = 0; n < numberOfEnergyLevels; n++ ) {
    const amplitude = superpositionMagnitudeValues[ n ];
    if ( amplitude !== 0 ) {

      const initialPhase = superpositionPhaseValues[ n ];
      const waveFunction = boundStateResult.waveFunctions[ n ];
      const energy = boundStateResult.energies[ n ];

      // Convert current time (in fs) to units of time used in the model (natural time unit).
      const modelTime = currentTime / QBSTime.NATURAL_TIME_UNIT_FS;

      // Time evolution phase for this eigenstate: -E_n*t/ℏ
      const timePhase = -energy * modelTime / QBSConstants.HBAR;

      // Total phase: initial phase + time evolution phase
      const totalPhase = initialPhase + timePhase;

      // Complex coefficient: c_n * e^(i*totalPhase) = c_n * (cos(totalPhase) + i*sin(totalPhase))
      const realCoefficient = amplitude * Math.cos( totalPhase );
      const imaginaryCoefficient = amplitude * Math.sin( totalPhase );

      // Accumulate the contribution of superposition to each y value.
      for ( let i = 0; i < numberOfPoints; i++ ) {
        realPartValues[ i ] += realCoefficient * waveFunction[ i ];
        imaginaryPartValues[ i ] += imaginaryCoefficient * waveFunction[ i ];
      }
    }
  }

  // Calculate magnitude, phase, and probability density.
  for ( let i = 0; i < numberOfPoints; i++ ) {
    magnitudeValues[ i ] = Math.sqrt( realPartValues[ i ] * realPartValues[ i ] + imaginaryPartValues[ i ] * imaginaryPartValues[ i ] );
    phaseValues[ i ] = Math.atan2( imaginaryPartValues[ i ], realPartValues[ i ] );
    probabilityDensityValues[ i ] = realPartValues[ i ] * realPartValues[ i ] + imaginaryPartValues[ i ] * imaginaryPartValues[ i ];
  }

  return {
    realPartValues: realPartValues,
    imaginaryPartValues: imaginaryPartValues,
    magnitudeValues: magnitudeValues,
    phaseValues: phaseValues,
    probabilityDensityValues: probabilityDensityValues
  };
}