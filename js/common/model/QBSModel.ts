// Copyright 2025-2026, University of Colorado Boulder

/**
 * QBSModel is the base class for the top-level model in this sim. It includes the model elements and functionality
 * that is common to all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
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
import { electronMassesUnit } from './electronMassesUnit.js';
import EnergyDiagram from './EnergyDiagram.js';
import Magnifier from './Magnifier.js';
import Potential from './potentials/Potential.js';
import ProbabilityDensityGraph from './ProbabilityDensityGraph.js';
import { QuantumStateRepresentation } from './QuantumStateRepresentation.js';
import ReferenceLine from './ReferenceLine.js';
import Time from './Time.js';
import WaveFunctionGraph from './WaveFunctionGraph.js';

type SelfOptions = {
  potential: Potential;
  potentials: Potential[];
  quantumStateRepresentation: QuantumStateRepresentation;
  quantumStateRepresentations: QuantumStateRepresentation[];
};

export type QBSModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class QBSModel implements TModel {

  public readonly time: Time;

  //TODO Core description refers to this as "potential type".
  public readonly potentialProperty: Property<Potential>;

  public readonly energyLevelRangeProperty: Property<Range>;
  public readonly energyLevelProperty: NumberProperty;

  public readonly electronMassesProperty: NumberProperty;
  public readonly massProperty: TReadOnlyProperty<number>;

  public readonly energyDiagram: EnergyDiagram;
  public readonly probabilityDensityGraph: ProbabilityDensityGraph;
  public readonly waveFunctionGraph: WaveFunctionGraph;
  public readonly quantumStateRepresentationProperty: Property<QuantumStateRepresentation>; //TODO Property<QuantumStateGraphNode>

  public readonly magnifier: Magnifier;
  public readonly referenceLine: ReferenceLine;

  public readonly valueLabelsVisibleProperty: Property<boolean>;
  public readonly realPartVisibleProperty: Property<boolean>;
  public readonly imaginaryPartVisibleProperty: Property<boolean>;
  public readonly magnitudeVisibleProperty: Property<boolean>;
  public readonly phaseVisibleProperty: Property<boolean>;

  protected constructor( providedOptions: QBSModelOptions ) {

    const options = optionize<QBSModelOptions, SelfOptions, PhetioObjectOptions>()( {
      //TODO
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

    this.probabilityDensityGraph = new ProbabilityDensityGraph( options.tandem.createTandem( 'probabilityDensityGraph' ) );

    this.waveFunctionGraph = new WaveFunctionGraph( options.tandem.createTandem( 'waveFunctionGraph' ) );

    this.quantumStateRepresentationProperty = new StringUnionProperty( options.quantumStateRepresentation, {
      validValues: options.quantumStateRepresentations,
      tandem: options.tandem.createTandem( 'quantumStateRepresentationProperty' ),
      phetioFeatured: true
    } );

    //TODO energyLevelRangeProperty is dynamic, so the initial value must be computed.
    this.energyLevelRangeProperty = new Property( new Range( 1, 25 ), {
      tandem: options.tandem.createTandem( 'energyLevelRangeProperty' ),
      phetioValueType: Range.RangeIO,
      phetioFeatured: true,
      phetioReadOnly: true
    } );

    this.energyLevelProperty = new NumberProperty( 1, {
      numberType: 'Integer',
      //TODO Range varies depending on the selected potential and how it is configured.
      range: this.energyLevelRangeProperty,
      tandem: options.tandem.createTandem( 'energyLevelProperty' ),
      phetioFeatured: true,
      phetioReadOnly: true
    } );

    this.magnifier = new Magnifier( options.tandem.createTandem( 'magnifier' ) );

    this.referenceLine = new ReferenceLine( options.tandem.createTandem( 'referenceLine' ) );

    //TODO group *VisibleProperty under a parent tandem? Or move some under model.waveFunction?

    this.valueLabelsVisibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'valueLabelsVisibleProperty' ),
      phetioFeatured: true
    } );

    this.realPartVisibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'realPartVisibleProperty' ),
      phetioFeatured: true
    } );

    this.imaginaryPartVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'imaginaryPartVisibleProperty' ),
      phetioFeatured: true
    } );

    this.magnitudeVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'magnitudeVisibleProperty' ),
      phetioFeatured: true
    } );

    this.phaseVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'phaseVisibleProperty' ),
      phetioFeatured: true
    } );
  }

  /**
   * Resets the model.
   */
  public reset(): void {

    this.time.reset();

    this.potentialProperty.reset();

    this.energyLevelRangeProperty.reset();
    this.energyLevelProperty.reset();
    this.electronMassesProperty.reset();

    this.energyDiagram.reset();
    this.probabilityDensityGraph.reset();
    this.waveFunctionGraph.reset();
    this.quantumStateRepresentationProperty.reset();

    this.magnifier.reset();
    this.referenceLine.reset();

    this.valueLabelsVisibleProperty.reset();
    this.realPartVisibleProperty.reset();
    this.imaginaryPartVisibleProperty.reset();
    this.magnitudeVisibleProperty.reset();
    this.phaseVisibleProperty.reset();
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