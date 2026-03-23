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
import Potential from './potentials/Potential.js';
import ProbabilityDensityGraph from './ProbabilityDensityGraph.js';
import QuantumStateGraph from './QuantumStateGraph.js';
import ReferenceLine from './ReferenceLine.js';
import { BoundStateResult } from './solver/BoundStateResult.js';
import NumerovSolver from './solver/NumerovSolver.js';
import XGrid from './solver/XGrid.js';
import Time from './Time.js';
import WavefunctionGraph from './WavefunctionGraph.js';

type SelfOptions = {
  potential?: Potential;
  potentials: Potential[];
  hasAverageProbabilityDensityOfBandGraph?: boolean;
};

export type QBSModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class QBSModel implements TModel {

  public readonly time: Time;

  // Constant grid of x-coordinates, used for all graphs.
  public readonly xGrid: XGrid;

  public readonly boundStateResultProperty: Property<BoundStateResult>;

  public readonly energyDiagram: EnergyDiagram;
  public readonly energyLevelProperty: NumberProperty;
  public readonly potentialProperty: Property<Potential>; //TODO Core description refers to this as "potential type".

  // The possible QuantumStateGraphs.
  public readonly averageProbabilityDensityOfBandGraph?: AverageProbabilityDensityOfBandGraph;
  public readonly probabilityDensityGraph: ProbabilityDensityGraph;
  public readonly wavefunctionGraph: WavefunctionGraph;

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
    const mass = 1; // electron masses
    //TODO Range depends on the y-axis range and the type of potential. Only look for energy values in the range that's visible on the graph.
    const energyMin = 0; // eV
    const energyMax = 10; // eV

    const boundStateResult = NumerovSolver.solveNumerov( this.xGrid, potentialFunction, mass, energyMin, energyMax );

    this.boundStateResultProperty = new Property( boundStateResult );

    this.energyDiagram = new EnergyDiagram( this.xGrid, this.boundStateResultProperty, options.tandem.createTandem( 'energyDiagram' ) );

    this.energyLevelProperty = new NumberProperty( 1, {
      numberType: 'Integer',
      range: new Range( 1, 25 ), //TODO initial value must be computed, value is dynamic depending on selected potential
      tandem: options.tandem.createTandem( 'energyLevelProperty' ),
      phetioFeatured: true,
      phetioReadOnly: true
    } );

    // When potential is changed, reset energy level.
    this.potentialProperty.lazyLink( () => {
      if ( !isSettingPhetioStateProperty.value ) {
        this.energyLevelProperty.reset();
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

    this.wavefunctionGraph = new WavefunctionGraph( quantumStateGraphsTandem.createTandem( 'wavefunctionGraph' ) );
    quantumStateGraphs.push( this.wavefunctionGraph );

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
    this.wavefunctionGraph.reset();
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
