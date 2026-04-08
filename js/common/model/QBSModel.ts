// Copyright 2025-2026, University of Colorado Boulder

/**
 * QBSModel is the base class for the top-level model in this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import TModel from '../../../../joist/js/TModel.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import QBSConstants from '../QBSConstants.js';
import AverageProbabilityDensityOfBandGraph from './AverageProbabilityDensityOfBandGraph.js';
import EnergyDiagram from './EnergyDiagram.js';
import Magnifier from './Magnifier.js';
import InfiniteSquarePotential from './potentials/InfiniteSquarePotential.js';
import InfiniteStepPotential from './potentials/InfiniteStepPotential.js';
import Potential from './potentials/Potential.js';
import ProbabilityDensityGraph from './ProbabilityDensityGraph.js';
import QuantumStateGraph from './QuantumStateGraph.js';
import ReferenceLine from './ReferenceLine.js';
import InfiniteSquareWellSolution from './solver/analytical-solutions/InfiniteSquareWellSolution.js';
import InfiniteStepSolution from './solver/analytical-solutions/InfiniteStepSolution.js';
import { BoundStateResult } from './solver/BoundStateResult.js';
import NumerovSolver from './solver/NumerovSolver.js';
import XGrid from './solver/XGrid.js';
import Time from './Time.js';
import WaveFunctionGraph from './WaveFunctionGraph.js';

type SelfOptions = {
  potential?: Potential;
  potentials: Potential[];
  hasAverageProbabilityDensityOfBandGraph?: boolean;
};

export type QBSModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class QBSModel implements TModel {

  public readonly time: Time;

  // The quantum potential that is currently selected.
  public readonly potentialProperty: Property<Potential>;

  // Result from NumerovSolver for the selected quantum potential.
  public readonly boundStateResultProperty: Property<BoundStateResult>;

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
      hasAverageProbabilityDensityOfBandGraph: false
    }, providedOptions );

    this.time = new Time( options.tandem.createTandem( 'time' ) );

    this.xGrid = new XGrid( QBSConstants.ALL_GRAPHS_X_RANGE.min, QBSConstants.ALL_GRAPHS_X_RANGE.max, 1001 );

    this.potentialProperty = new Property( options.potential, {
      validValues: options.potentials,
      phetioValueType: Potential.PotentialIO,
      tandem: options.tandem.createTandem( 'potentialProperty' ),
      phetioFeatured: true
    } );

    const potentialFunction = ( x: number ) => this.potentialProperty.value.getPotentialEnergyAt( x ); // nm => eV
    const mass = 1; //TODO electron masses
    //TODO Range depends on the y-axis range and the type of potential. Only look for energy values in the range that's visible on the graph.
    const energyMin = 0; //TODO eV
    const energyMax = 10; //TODO eV

    // Solve for bound states, dispatching to analytical solutions where available.
    const solveBoundStates = ( potential: Potential ): BoundStateResult => {
      //TODO Analytic and numeric solutions have different methods of computing potential energy.
      if ( potential instanceof InfiniteSquarePotential ) {

        // Use analytic solution because using Numerov would require constraining x-range to the interior of the well.
        return InfiniteSquareWellSolution.solve( this.xGrid, potential.wellWidth, mass, energyMin, energyMax );
      }
      else if ( potential instanceof InfiniteStepPotential ) {

        // Use analytic solution because using Numerov would require constraining x-range to the interior of the well.
        return InfiniteStepSolution.solve( this.xGrid, potential.wellWidth, potential.stepHeight, mass, energyMin, energyMax );
      }
      else {
        return NumerovSolver.solve( this.xGrid, potentialFunction, mass, energyMin, energyMax );
      }
    };

    this.boundStateResultProperty = new Property( solveBoundStates( options.potential ) );

    this.potentialProperty.lazyLink( potential => {
      if ( !isSettingPhetioStateProperty.value ) {
        this.boundStateResultProperty.value = solveBoundStates( potential );
        this.energyLevelProperty.reset();
      }
    } );

    this.energyDiagram = new EnergyDiagram( this.xGrid, this.boundStateResultProperty, options.tandem.createTandem( 'energyDiagram' ) );

    this.energyLevelProperty = new NumberProperty( this.potentialProperty.value.getGroundStateIndex(), {
      numberType: 'Integer',
      range: getEnergyLevelRange( this.potentialProperty.value.getGroundStateIndex(), this.boundStateResultProperty.value.energies.length ),
      tandem: options.tandem.createTandem( 'energyLevelProperty' ),
      phetioFeatured: true,
      phetioReadOnly: true
    } );

    // When potential is changed, adjust energy level range and set to the ground state.
    this.potentialProperty.lazyLink( potential => {
      if ( !isSettingPhetioStateProperty.value ) {
        const energyLevelRange = getEnergyLevelRange( potential.getGroundStateIndex(), this.boundStateResultProperty.value.energies.length );
        this.energyLevelProperty.setValueAndRange( energyLevelRange.min, energyLevelRange );
      }
    } );

    // When boundStateResult is changed, adjust the energy level range. If the current energy level no longer exists,
    // set to the ground state.
    this.boundStateResultProperty.lazyLink( boundStateResult => {
      if ( !isSettingPhetioStateProperty.value ) {
        const energyLevelRange = getEnergyLevelRange( this.potentialProperty.value.getGroundStateIndex(), this.boundStateResultProperty.value.energies.length );
        if ( energyLevelRange.contains( this.energyLevelProperty.value ) ) {
          this.energyLevelProperty.rangeProperty.value = energyLevelRange;
        }
        else {
          this.energyLevelProperty.setValueAndRange( energyLevelRange.min, energyLevelRange );
        }
      }
    } );

    const quantumStateGraphs: QuantumStateGraph[] = [];
    const quantumStateGraphsTandem = options.tandem.createTandem( 'quantumStateGraphsTandem' );

    if ( options.hasAverageProbabilityDensityOfBandGraph ) {
      this.averageProbabilityDensityOfBandGraph = new AverageProbabilityDensityOfBandGraph(
        quantumStateGraphsTandem.createTandem( 'averageProbabilityDensityOfBandGraph' ) );
      quantumStateGraphs.push( this.averageProbabilityDensityOfBandGraph );
    }

    this.probabilityDensityGraph = new ProbabilityDensityGraph( quantumStateGraphsTandem.createTandem( 'probabilityDensityGraph' ) );
    quantumStateGraphs.push( this.probabilityDensityGraph );

    this.waveFunctionGraph = new WaveFunctionGraph( quantumStateGraphsTandem.createTandem( 'waveFunctionGraph' ) );
    quantumStateGraphs.push( this.waveFunctionGraph );

    this.quantumStateGraphProperty = new Property( quantumStateGraphs[ 0 ], {
      validValues: quantumStateGraphs,
      tandem: options.tandem.createTandem( 'quantumStateGraphProperty' ),
      phetioValueType: QuantumStateGraph.QuantumStateGraphIO,
      phetioFeatured: true
    } );

    this.curvesVisibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'curvesVisibleProperty' ),
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
    this.potentialProperty.reset();
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

function getEnergyLevelRange( groundStateIndex: number, numberOfEigenvalue: number ): Range {
  return new Range( groundStateIndex, groundStateIndex + numberOfEigenvalue - 1 );
}
