// Copyright 2025-2026, University of Colorado Boulder

/**
 * QBSModel is the base class for the top-level model in this sim. It includes the model elements and functionality
 * that is common to all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import Range from '../../../../dot/js/Range.js';
import TModel from '../../../../joist/js/TModel.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import { GraphType, GraphTypeValues } from './GraphType.js';
import MagnifierTool from './MagnifierTool.js';
import ReferenceLine from './ReferenceLine.js';
import Time from './Time.js';

type SelfOptions = {
  graphType?: GraphType;
  graphTypes?: GraphType[];
};

export type QBSModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class QBSModel implements TModel {

  public readonly time: Time;

  public readonly energyLevelRangeProperty: Property<Range>;
  public readonly energyLevelProperty: NumberProperty;

  public readonly massProperty: NumberProperty;

  public readonly magnifierTool: MagnifierTool;

  public readonly referenceLine: ReferenceLine;

  public readonly graphTypeProperty: Property<GraphType>;

  public readonly valueLabelsVisibleProperty: Property<boolean>;
  public readonly realPartVisibleProperty: Property<boolean>;
  public readonly imaginaryPartVisibleProperty: Property<boolean>;
  public readonly magnitudeVisibleProperty: Property<boolean>;
  public readonly phaseVisibleProperty: Property<boolean>;

  protected constructor( providedOptions: QBSModelOptions ) {

    const options = optionize<QBSModelOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      graphType: 'probabilityDensity',
      graphTypes: [ ...GraphTypeValues ]
    }, providedOptions );

    this.time = new Time( options.tandem.createTandem( 'time' ) );

    this.massProperty = new NumberProperty( 1, {
      numberType: 'FloatingPoint',
      units: 'm<sub>e</sub>', //TODO https://github.com/phetsims/quantum-bound-states/issues/11
      range: new Range( 0.5, 1.1 ),
      tandem: options.tandem.createTandem( 'massProperty' ),
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
      range: this.energyLevelRangeProperty,
      tandem: options.tandem.createTandem( 'energyLevelProperty' ),
      phetioFeatured: true,
      phetioReadOnly: true
    } );

    this.magnifierTool = new MagnifierTool( options.tandem.createTandem( 'magnifierTool' ) );

    this.referenceLine = new ReferenceLine( options.tandem.createTandem( 'referenceLine' ) );

    this.graphTypeProperty = new StringUnionProperty( options.graphType, {
      validValues: options.graphTypes,
      tandem: options.tandem.createTandem( 'graphTypeProperty' ),
      phetioFeatured: true
    } );

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
    this.energyLevelRangeProperty.reset();
    this.energyLevelProperty.reset();
    this.massProperty.reset();
    this.magnifierTool.reset();
    this.referenceLine.reset();
    this.graphTypeProperty.reset();

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
    this.time.currentTimeProperty.value += Time.FEMTOSECONDS_PER_SECOND * dt * this.time.timeSpeedFactorProperty.value;
  }
}

quantumBoundStates.register( 'QBSModel', QBSModel );