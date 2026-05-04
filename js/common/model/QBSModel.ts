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
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import QBSConstants from '../QBSConstants.js';
import QBSQueryParameters from '../QBSQueryParameters.js';
import AverageProbabilityDensityOfBandGraph from './AverageProbabilityDensityOfBandGraph.js';
import EnergyDiagram from './EnergyDiagram.js';
import Magnifier from './Magnifier.js';
import QuantumPotential from './potentials/QuantumPotential.js';
import ProbabilityDensityGraph from './ProbabilityDensityGraph.js';
import QuantumStateGraph from './QuantumStateGraph.js';
import ReferenceLine from './ReferenceLine.js';
import { BoundStateResult } from './solver/BoundStateResult.js';
import XGrid from './solver/XGrid.js';
import SuperpositionCoefficients from './SuperpositionCoefficients.js';
import Time from './Time.js';
import WaveFunctionGraph from './WaveFunctionGraph.js';

type SelfOptions = {

  // Set of quantum potential instances supported by the model.
  potentials: QuantumPotential[];

  // Quantum potential instance that is initially selected.
  potential?: QuantumPotential;

  // Whether this model has the 'Average Probability Density of Band' graph
  hasAverageProbabilityDensityOfBandGraph?: boolean;

  // Whether energyLevelProperty is instrumented for PhET-iO. In the Superposition screen, there is no concept of
  // a selected energy level, and any energy level with a non-zero superposition coefficient contributes to the
  // wave function computation.
  energyLevelPropertyInstrumented?: boolean;

  // Properties that are shared by all potentials. QBSModel is responsible for resetting these.
  numberOfWellsProperty: NumberProperty;
  electronMassesProperty: NumberProperty;
  electricFieldProperty: NumberProperty;
};

export type QBSModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class QBSModel implements TModel {

  public readonly time: Time;

  // The quantum potential that is currently selected.
  public readonly potentialProperty: Property<QuantumPotential>;
  private readonly potentials: QuantumPotential[];

  //TODO This is a temporary implementation of superposition coefficients that does not address phase.
  public readonly superpositionCoefficients: SuperpositionCoefficients;

  // Properties that are shared by all potentials.
  public readonly numberOfWellsProperty: NumberProperty;
  public readonly electronMassesProperty: NumberProperty;
  public readonly electricFieldProperty: NumberProperty;

  // Result for configuration of the selected quantum potential.
  public readonly boundStateResultProperty: Property<BoundStateResult>;

  // Time-independent wave function values for the selected potential and selected energy level.
  public readonly selectedWaveFunctionValuesProperty: TReadOnlyProperty<number[]>;

  // Constant grid of x-coordinates, used for all graphs.
  public readonly xGrid: XGrid;

  // The selected energy level.
  public readonly energyLevelProperty: NumberProperty;

  // Energy diagram
  public readonly energyDiagram: EnergyDiagram;

  // The possible QuantumStateGraphs.
  public readonly averageProbabilityDensityOfBandGraph?: AverageProbabilityDensityOfBandGraph;
  public readonly probabilityDensityGraph: ProbabilityDensityGraph;
  public readonly waveFunctionGraph: WaveFunctionGraph;

  // The QuantumStateGraph that is currently selected and displayed.
  public readonly quantumStateGraphProperty: Property<QuantumStateGraph>;

  // Whether curves are visible on the QuantumStateGraphs. Applies to all graphs.
  public readonly curvesVisibleProperty: Property<boolean>;

  public readonly magnifier: Magnifier;
  public readonly referenceLine: ReferenceLine;

  protected constructor( providedOptions: QBSModelOptions ) {

    const options = optionize<QBSModelOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      potential: providedOptions.potentials[ 0 ],
      energyLevelPropertyInstrumented: true,
      hasAverageProbabilityDensityOfBandGraph: false
    }, providedOptions );

    this.numberOfWellsProperty = options.numberOfWellsProperty;
    this.electronMassesProperty = options.electronMassesProperty;
    this.electricFieldProperty = options.electricFieldProperty;

    this.time = new Time( options.tandem.createTandem( 'time' ) );

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
      phetioFeatured: true
    } );
    this.potentials = options.potentials;

    this.boundStateResultProperty = new Property( solveBoundState( options.potential, this.xGrid, this.electronMassesProperty.value ) );

    this.energyDiagram = new EnergyDiagram( this, options.tandem.createTandem( 'energyDiagram' ) );

    this.energyLevelProperty = new NumberProperty( this.potentialProperty.value.groundStateIndex, {
      numberType: 'Integer',
      range: getEnergyLevelRange( this.potentialProperty.value.groundStateIndex, this.boundStateResultProperty.value.energies.length ),
      tandem: options.energyLevelPropertyInstrumented ? options.tandem.createTandem( 'energyLevelProperty' ) : Tandem.OPT_OUT,
      phetioFeatured: true,
      phetioReadOnly: true
    } );

    this.superpositionCoefficients = new SuperpositionCoefficients();

    //TODO This is not appropriate for the Superposition screen, which has no concept of 'selected energy level'.
    if ( options.energyLevelPropertyInstrumented ) {
      Multilink.multilink( [ this.energyLevelProperty, this.boundStateResultProperty ],
        ( energyLevel, boundStateResult ) => {
          this.superpositionCoefficients.setOneCoefficient( energyLevel, boundStateResult.energies.length );
        } );
    }

    const potentialChangedListener = () => {
      this.boundStateResultProperty.value = solveBoundState( this.potentialProperty.value, this.xGrid, this.electronMassesProperty.value );
    };
    this.potentialProperty.value.propertyChangedEmitter.addListener( potentialChangedListener );

    this.potentialProperty.lazyLink( ( potential, previousPotential ) => {
      previousPotential.propertyChangedEmitter.removeListener( potentialChangedListener );
      potential.propertyChangedEmitter.addListener( potentialChangedListener );
      if ( !isSettingPhetioStateProperty.value ) {

        // Recompute the bound state.
        this.boundStateResultProperty.value = solveBoundState( this.potentialProperty.value, this.xGrid, this.electronMassesProperty.value );

        // Adjust energy level range and set to the ground state.
        const energyLevelRange = getEnergyLevelRange( potential.groundStateIndex, this.boundStateResultProperty.value.energies.length );
        this.energyLevelProperty.setValueAndRange( energyLevelRange.min, energyLevelRange );
      }
    } );

    // When boundStateResult is changed, adjust the energy level range. If the current energy level no longer exists,
    // set to the ground state.
    this.boundStateResultProperty.lazyLink( boundStateResult => {
      if ( !isSettingPhetioStateProperty.value ) {
        const energyLevelRange = getEnergyLevelRange( this.potentialProperty.value.groundStateIndex, boundStateResult.energies.length );
        if ( energyLevelRange.contains( this.energyLevelProperty.value ) ) {
          this.energyLevelProperty.rangeProperty.value = energyLevelRange;
        }
        else {
          this.energyLevelProperty.setValueAndRange( energyLevelRange.min, energyLevelRange );
        }
      }
    } );

    this.selectedWaveFunctionValuesProperty = new DerivedProperty(
      [ this.boundStateResultProperty, this.energyLevelProperty ],
      ( boundStateResult, energyLevel ) => {
        const groundStateIndex = this.potentialProperty.value.groundStateIndex;
        const waveFunctionsIndex = energyLevel - groundStateIndex;
        const waveFunctions = boundStateResult.waveFunctions;
        affirm( waveFunctionsIndex >= 0 && waveFunctions.length, `waveFunctionIndex out of range: ${waveFunctionsIndex}` );
        return waveFunctions[ waveFunctionsIndex ];
      } );

    // These Properties are owned by the top-level model - QBSModel and its subclasses. They are shared by all potentials,
    // so we do not get notification from the potentials when they change. Instead, we must listen for changes and
    // recompute the bound state.
    Multilink.multilink( [ this.numberOfWellsProperty, this.electronMassesProperty, this.electricFieldProperty ],
      ( numberOfWells, electronMasses, electricField ) => {
        this.boundStateResultProperty.value = solveBoundState( this.potentialProperty.value, this.xGrid, electronMasses );
      } );

    // The order of quantumStateGraphs determines the order of radio buttons in QuatumStateGraphRadioButtonGroup.
    const quantumStateGraphs: QuantumStateGraph[] = [];
    const quantumStateGraphsTandem = options.tandem.createTandem( 'quantumStateGraphs' );

    if ( options.hasAverageProbabilityDensityOfBandGraph ) {
      this.averageProbabilityDensityOfBandGraph = new AverageProbabilityDensityOfBandGraph(
        quantumStateGraphsTandem.createTandem( 'averageProbabilityDensityOfBandGraph' ) );
      quantumStateGraphs.push( this.averageProbabilityDensityOfBandGraph );
    }

    this.probabilityDensityGraph = new ProbabilityDensityGraph( this, quantumStateGraphsTandem.createTandem( 'probabilityDensityGraph' ) );
    quantumStateGraphs.push( this.probabilityDensityGraph );

    this.waveFunctionGraph = new WaveFunctionGraph( this, quantumStateGraphsTandem.createTandem( 'waveFunctionGraph' ) );
    quantumStateGraphs.push( this.waveFunctionGraph );

    //TODO Initial value should be quantumStateGraphs[ 0 ]
    this.quantumStateGraphProperty = new Property( this.waveFunctionGraph, {
      validValues: quantumStateGraphs,
      tandem: options.tandem.createTandem( 'quantumStateGraphProperty' ),
      phetioValueType: QuantumStateGraph.QuantumStateGraphIO,
      phetioFeatured: true
    } );

    this.curvesVisibleProperty = new BooleanProperty( true, {
      tandem: quantumStateGraphsTandem.createTandem( 'curvesVisibleProperty' ),
      phetioFeatured: true
    } );

    this.magnifier = new Magnifier( options.tandem.createTandem( 'magnifier' ) );

    this.referenceLine = new ReferenceLine( options.tandem.createTandem( 'referenceLine' ) );
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
    this.energyLevelProperty.reset();
    this.energyDiagram.reset();
    this.averageProbabilityDensityOfBandGraph && this.averageProbabilityDensityOfBandGraph.reset();
    this.probabilityDensityGraph.reset();
    this.waveFunctionGraph.reset();
    this.quantumStateGraphProperty.reset();
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
}

/**
 * Gets the energy level range for the given ground state index and number of eigenvalues.
 */
function getEnergyLevelRange( groundStateIndex: number, numberOfEigenvalues: number ): Range {
  return new Range( groundStateIndex, groundStateIndex + numberOfEigenvalues - 1 );
}

/**
 * Solve for bound state and validate the result.
 */
function solveBoundState( potential: QuantumPotential, xGrid: XGrid, electronMasses: number ): BoundStateResult {

  const result = potential.solveBoundState( xGrid, electronMasses );

  //TODO Patch up problems so that the sim can continue to run. Eventually delete this code.
  if ( result.potentials.length !== xGrid.xCoordinates.length ) {
    logError( 'BoundStateResult has the wrong number of potentials: ' + potential.toString() );
    result.potentials = new Array( xGrid.xCoordinates.length ).fill( 0 );
  }
  if ( result.energies.length === 0 ) {
    logError( 'BoundStateResult has no energies: ' + potential.toString() );
    result.energies = [ 0 ];
    result.waveFunctions = [ new Array( xGrid.xCoordinates.length ).fill( 0 ) ];
  }
  if ( result.waveFunctions.length === 0 ) {
    logError( 'BoundStateResult has no wave functions: ' + potential.toString() );
    result.waveFunctions = new Array( result.energies.length ).fill( 0 );
  }

  // Validate the result.
  affirm( result.potentials.length > 0, 'BoundStateResult has no potentials: ' + potential.toString() );
  affirm( result.potentials.length === xGrid.xCoordinates.length, `BoundStateResult has the wrong number of potentials, ${result.potentials.length} != ${xGrid.xCoordinates.length}: ` + potential.toString() );
  affirm( result.energies.length > 0, 'BoundStateResult has no energies: ' + potential.toString() );
  affirm( result.waveFunctions.length > 0, 'BoundStateResult has no waveFunctions: ' + potential.toString() );
  affirm( result.energies.length === result.waveFunctions.length, 'BoundStateResult does not have a wave function for each energy: ' + potential.toString() );

  return result;
}

function logError( message: string ): void {
  console.log( `%c${message}`, 'color: red' );
}
