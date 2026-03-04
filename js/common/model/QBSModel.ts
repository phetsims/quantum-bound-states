// Copyright 2025-2026, University of Colorado Boulder

/**
 * QBSModel is the base class for the top-level model in this sim. It includes the model elements and functionality
 * that is common to all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import TModel from '../../../../joist/js/TModel.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { kilogramsUnit } from '../../../../scenery-phet/js/units/kilogramsUnit.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QBSConstants from '../QBSConstants.js';
import AverageProbabilityDensityOfBandGraph from './AverageProbabilityDensityOfBandGraph.js';
import { electronMassesUnit } from './electronMassesUnit.js';
import EnergyDiagram from './EnergyDiagram.js';
import Magnifier from './Magnifier.js';
import Potential from './potentials/Potential.js';
import ProbabilityDensityGraph from './ProbabilityDensityGraph.js';
import QuantumStateGraph from './QuantumStateGraph.js';
import ReferenceLine from './ReferenceLine.js';
import Time from './Time.js';
import WaveFunctionGraph from './WaveFunctionGraph.js';

type SelfOptions = {
  potential: Potential;
  potentials: Potential[];
  hasAverageProbabilityDensityOfBandGraph?: boolean;
};

export type QBSModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class QBSModel implements TModel {

  public readonly time: Time;

  //TODO Core description refers to this as "potential type".
  public readonly potentialProperty: Property<Potential>;

  public readonly energyLevelProperty: NumberProperty;

  public readonly electronMassesProperty: NumberProperty;
  public readonly massProperty: TReadOnlyProperty<number>;

  public readonly energyDiagram: EnergyDiagram;
  public readonly averageProbabilityDensityOfBandGraph?: AverageProbabilityDensityOfBandGraph;
  public readonly probabilityDensityGraph: ProbabilityDensityGraph;
  public readonly waveFunctionGraph: WaveFunctionGraph;
  public readonly selectedGraphProperty: Property<QuantumStateGraph>;

  public readonly magnifier: Magnifier;
  public readonly referenceLine: ReferenceLine;

  protected constructor( providedOptions: QBSModelOptions ) {

    const options = optionize<QBSModelOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      hasAverageProbabilityDensityOfBandGraph: false
    }, providedOptions );

    this.time = new Time( options.tandem.createTandem( 'time' ) );

    this.potentialProperty = new Property( options.potential, {
      validValues: options.potentials,
      phetioValueType: Potential.PotentialIO,
      tandem: options.tandem.createTandem( 'potentialProperty' ),
      phetioFeatured: true
    } );

    this.electronMassesProperty = new NumberProperty( 1, {
      numberType: 'FloatingPoint',
      units: electronMassesUnit,
      range: new Range( 0.5, 1.1 ),
      tandem: options.tandem.createTandem( 'electronMassesProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'The number of electron masses, used to compute the value of massProperty.'
    } );

    this.massProperty = new DerivedProperty( [ this.electronMassesProperty ],
      electronMasses => electronMasses * QBSConstants.ELECTRON_MASS, {
        units: kilogramsUnit,
        tandem: options.tandem.createTandem( 'massProperty' ),
        phetioValueType: NumberIO
      } );

    this.energyDiagram = new EnergyDiagram( options.tandem.createTandem( 'energyDiagram' ) );

    const graphs: QuantumStateGraph[] = [];
    const graphsTandem = options.tandem.createTandem( 'graphs' );

    if ( options.hasAverageProbabilityDensityOfBandGraph ) {
      this.averageProbabilityDensityOfBandGraph = new AverageProbabilityDensityOfBandGraph( graphsTandem.createTandem( 'averageProbabilityDensityOfBandGraph' ) );
      graphs.push( this.averageProbabilityDensityOfBandGraph );
    }

    this.probabilityDensityGraph = new ProbabilityDensityGraph( graphsTandem.createTandem( 'probabilityDensityGraph' ) );
    graphs.push( this.probabilityDensityGraph );

    this.waveFunctionGraph = new WaveFunctionGraph( graphsTandem.createTandem( 'waveFunctionGraph' ) );
    graphs.push( this.waveFunctionGraph );

    this.selectedGraphProperty = new Property( graphs[ 0 ], {
      validValues: graphs,
      tandem: options.tandem.createTandem( 'selectedGraphProperty' ),
      phetioValueType: QuantumStateGraph.QuantumStateGraphIO,
      phetioFeatured: true
    } );

    this.energyLevelProperty = new NumberProperty( 1, {
      numberType: 'Integer',
      range: new Range( 1, 25 ), //TODO initial value must be computed, value is dynamic depending on selected potential
      tandem: options.tandem.createTandem( 'energyLevelProperty' ),
      phetioFeatured: true,
      phetioReadOnly: true
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
    this.electronMassesProperty.reset();
    this.energyDiagram.reset();
    this.averageProbabilityDensityOfBandGraph && this.averageProbabilityDensityOfBandGraph.reset();
    this.probabilityDensityGraph.reset();
    this.waveFunctionGraph.reset();
    this.selectedGraphProperty.reset();
    this.magnifier.reset();
    this.referenceLine.reset();
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

quantumBoundStates.register( 'QBSModel', QBSModel );