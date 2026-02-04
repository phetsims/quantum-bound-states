// Copyright 2025-2026, University of Colorado Boulder

/**
 * QBSModel is the base class for the top-level model in this sim. It includes the model elements and functionality
 * that is common to all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import TModel from '../../../../joist/js/TModel.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import { GraphType, GraphTypeValues } from './GraphType.js';
import MagnifierTool from './MagnifierTool.js';
import ReferenceLine from './ReferenceLine.js';

type SelfOptions = {
  graphType?: GraphType;
  graphTypes?: GraphType[];
};

export type QBSModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class QBSModel implements TModel {

  public readonly magnifierTool: MagnifierTool;

  public readonly referenceLine: ReferenceLine;

  public readonly graphTypeProperty: Property<GraphType>;

  public readonly valuesVisibleProperty: Property<boolean>;
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

    this.magnifierTool = new MagnifierTool( options.tandem.createTandem( 'magnifierTool' ) );

    this.referenceLine = new ReferenceLine( options.tandem.createTandem( 'referenceLine' ) );

    this.graphTypeProperty = new StringUnionProperty( options.graphType, {
      validValues: options.graphTypes,
      tandem: options.tandem.createTandem( 'graphTypeProperty' ),
      phetioFeatured: true
    } );

    //TODO group *VisibleProperty under a parent tandem?

    this.valuesVisibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'valuesVisibleProperty' ),
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
    this.magnifierTool.reset();
    this.referenceLine.reset();
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
    //TODO
  }
}

quantumBoundStates.register( 'QBSModel', QBSModel );