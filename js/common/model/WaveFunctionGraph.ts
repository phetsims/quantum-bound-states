// Copyright 2026, University of Colorado Boulder

/**
 * WaveFunctionGraph is the model for the wave function graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import QBSQueryParameters from '../QBSQueryParameters.js';
import QBSModel from './QBSModel.js';
import QuantumStateGraph from './QuantumStateGraph.js';
import { BoundStateResult } from './solver/BoundStateResult.js';
import NumerovSolver from './solver/NumerovSolver.js';
import XGrid from './solver/XGrid.js';

//TODO If we don't need probabilityDensityValues, rename this to TimeEvolvedWaveFunction.
type TimeEvolvedSuperposition = {
  realPartValues: number[];
  imaginaryPartValues: number[];
  magnitudeValues: number[];
  maxMagnitude: number;
  //TODO phaseValues: number[];
  probabilityDensityValues: number[];
};

export default class WaveFunctionGraph extends QuantumStateGraph {

  // Visibility of the wave function components
  public readonly realPartVisibleProperty: Property<boolean>;
  public readonly imaginaryPartVisibleProperty: Property<boolean>;
  public readonly magnitudeVisibleProperty: Property<boolean>;
  public readonly phaseVisibleProperty: Property<boolean>;

  // y-axis values for plotting wave function real part
  public readonly realPartValuesProperty: TReadOnlyProperty<number[]>;
  private readonly _realPartValuesProperty: Property<number[]>;

  // y-axis values for plotting wave function imaginary part
  public readonly imaginaryPartValuesProperty: TReadOnlyProperty<number[]>;
  private readonly _imaginaryPartValuesProperty: Property<number[]>;

  // y-axis values for plotting wave function magnitude
  public readonly magnitudeValuesProperty: TReadOnlyProperty<number[]>;
  private readonly _magnitudeValuesProperty: Property<number[]>;

  // y-axis values for plotting wave function phase
  //TODO public readonly phaseValuesProperty: TReadOnlyProperty<number[]>;
  //TODO private readonly _phaseValuesProperty: TReadOnlyProperty<number[]>;

  // Range for the y-axis
  public readonly yAxisRangeProperty: TReadOnlyProperty<Range>;

  //TODO Reduce coupling with QBSModel
  public constructor( model: QBSModel, tandem: Tandem ) {

    super( tandem );

    this.realPartVisibleProperty = new BooleanProperty( QBSQueryParameters.realPartVisible, {
      tandem: tandem.createTandem( 'realPartVisibleProperty' ),
      phetioFeatured: true
    } );

    this.imaginaryPartVisibleProperty = new BooleanProperty( QBSQueryParameters.imaginaryPartVisible, {
      tandem: tandem.createTandem( 'imaginaryPartVisibleProperty' ),
      phetioFeatured: true
    } );

    this.magnitudeVisibleProperty = new BooleanProperty( QBSQueryParameters.magnitudeVisible, {
      tandem: tandem.createTandem( 'magnitudeVisibleProperty' ),
      phetioFeatured: true
    } );

    this.phaseVisibleProperty = new BooleanProperty( QBSQueryParameters.phaseVisible, {
      tandem: tandem.createTandem( 'phaseVisibleProperty' ),
      phetioFeatured: true
    } );

    this._realPartValuesProperty = new Property<number[]>( [], {
      tandem: tandem.createTandem( 'realPartValuesProperty' ),
      phetioValueType: ArrayIO( NumberIO ),
      phetioFeatured: true,
      phetioReadOnly: true
    } );
    this.realPartValuesProperty = this._realPartValuesProperty;

    this._imaginaryPartValuesProperty = new Property<number[]>( [], {
      tandem: tandem.createTandem( 'imaginaryPartValuesProperty' ),
      phetioValueType: ArrayIO( NumberIO ),
      phetioFeatured: true,
      phetioReadOnly: true
    } );
    this.imaginaryPartValuesProperty = this._imaginaryPartValuesProperty;

    this._magnitudeValuesProperty = new Property<number[]>( [], {
      tandem: tandem.createTandem( 'magnitudeValuesProperty' ),
      phetioValueType: ArrayIO( NumberIO ),
      phetioFeatured: true,
      phetioReadOnly: true
    } );
    this.magnitudeValuesProperty = this._magnitudeValuesProperty;

    this.yAxisRangeProperty = new DerivedProperty( [ model.selectedWaveFunctionValuesProperty ],
      selectedWaveFunctionValues => {
        //TODO It may be more performant to return maxAbsY as part of BoundStateResult
        const minY = Math.min( ...selectedWaveFunctionValues );
        const maxY = Math.max( ...selectedWaveFunctionValues );
        const maxAbsY = Math.max( Math.abs( minY ), Math.abs( maxY ) );
        return new Range( -maxAbsY, maxAbsY );
      } );

    Multilink.multilink(
      [ model.time.currentTimeProperty, model.boundStateResultProperty, model.energyLevelProperty ],
      ( t, boundStateResult, energyLevel ) => {
        const timeEvolvedSuperposition = this.getTimeEvolvedSuperposition( t, model.xGrid, boundStateResult, energyLevel, model.potentialProperty.value.groundStateIndex );
        this._realPartValuesProperty.value = timeEvolvedSuperposition.realPartValues;
        this._imaginaryPartValuesProperty.value = timeEvolvedSuperposition.imaginaryPartValues;
        this._magnitudeValuesProperty.value = timeEvolvedSuperposition.magnitudeValues;
      } );
  }

  public override reset(): void {
    super.reset();
    this.realPartVisibleProperty.reset();
    this.imaginaryPartVisibleProperty.reset();
    this.magnitudeVisibleProperty.reset();
    this.phaseVisibleProperty.reset();
  }

  /**
   * TODO Taken almost verbatim from https://github.com/veillette/QPPW, BaseModel.getTimeEvolvedSuperposition. Lots of questions for MV about this.
   */
  private getTimeEvolvedSuperposition( timeInSeconds: number,
                                       xGrid: XGrid,
                                       boundStateResult: BoundStateResult,
                                       selectedEnergyLevel: number,
                                       groundStateIndex: number ): TimeEvolvedSuperposition {

    //TODO Temporary: All superpositionCoefficient amplitudes are zero except for the selected energy level.
    const superpositionCoefficients = new Array( boundStateResult.waveFunctions.length ).fill( 0 );
    superpositionCoefficients[ selectedEnergyLevel - groundStateIndex ] = 1;

    const numberOfPoints = xGrid.numberOfPoints;

    // Initialize arrays
    const realPartValues = new Array( numberOfPoints ).fill( 0 );
    const imaginaryPartValues = new Array( numberOfPoints ).fill( 0 );
    const magnitudeValues = new Array( numberOfPoints );
    const probabilityDensityValues = new Array( numberOfPoints );

    // Compute time-evolved superposition: ψ(x,t) = Σ c_n * e^(iφ_n) * ψ_n(x) * e^(-iE_n*t/ℏ)
    for ( let n = 0; n < superpositionCoefficients.length; n++ ) {
      const amplitude = superpositionCoefficients[ n ];
      const initialPhase = 0; //TODO config.phases[ n ];

      if ( amplitude === 0 || n >= boundStateResult.waveFunctions.length ) {
        continue;
      }

      const eigenfunction = boundStateResult.waveFunctions[ n ];
      const energy = boundStateResult.energies[ n ];

      // Time evolution phase for this eigenstate: -E_n*t/ℏ
      const timePhase = -( energy * timeInSeconds ) / NumerovSolver.HBAR;

      // Total phase: initial phase + time evolution phase
      const totalPhase = initialPhase + timePhase;

      // Complex coefficient: c_n * e^(i*totalPhase) = c_n * (cos(totalPhase) + i*sin(totalPhase))
      const realCoefficient = amplitude * Math.cos( totalPhase );
      const imaginaryCoefficient = amplitude * Math.sin( totalPhase );

      // Add contribution to superposition
      for ( let i = 0; i < numberOfPoints; i++ ) {
        realPartValues[ i ] += realCoefficient * eigenfunction[ i ];
        imaginaryPartValues[ i ] += imaginaryCoefficient * eigenfunction[ i ];
      }
    }

    // Calculate magnitude and probability density.
    //TODO Do we need these?
    let maxMagnitude = 0;
    for ( let i = 0; i < numberOfPoints; i++ ) {
      magnitudeValues[ i ] = Math.sqrt( realPartValues[ i ] * realPartValues[ i ] + imaginaryPartValues[ i ] * imaginaryPartValues[ i ] );
      probabilityDensityValues[ i ] = realPartValues[ i ] * realPartValues[ i ] + imaginaryPartValues[ i ] * imaginaryPartValues[ i ];
      maxMagnitude = Math.max( maxMagnitude, magnitudeValues[ i ] );
    }

    return {
      realPartValues: realPartValues,
      imaginaryPartValues: imaginaryPartValues,
      magnitudeValues: magnitudeValues,
      maxMagnitude: maxMagnitude,
      probabilityDensityValues: probabilityDensityValues
    };
  }
}
