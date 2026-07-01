// Copyright 2026, University of Colorado Boulder

/**
 * QuantumPotential is the base class for all quantum potentials.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import Emitter from '../../../../../axon/js/Emitter.js';
import Multilink from '../../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import TRangedProperty from '../../../../../axon/js/TRangedProperty.js';
import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../../dot/js/Range.js';
import RangeWithValue from '../../../../../dot/js/RangeWithValue.js';
import { roundToInterval } from '../../../../../dot/js/util/roundToInterval.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import StrictOmit from '../../../../../phet-core/js/types/StrictOmit.js';
import { electronVoltsUnit } from '../../../../../scenery-phet/js/units/electronVoltsUnit.js';
import { nanometersUnit } from '../../../../../scenery-phet/js/units/nanometersUnit.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../../tandem/js/PhetioObject.js';
import IOType from '../../../../../tandem/js/types/IOType.js';
import ReferenceIO, { ReferenceIOState } from '../../../../../tandem/js/types/ReferenceIO.js';
import QBSConstants from '../../QBSConstants.js';
import BoundStateResult from '../solvers/BoundStateResult.js';
import XGrid from '../solvers/XGrid.js';

type SelfOptions = {

  // Global Properties that are shared by all QuantumPotential instances.
  numberOfWellsProperty: TRangedProperty;
  electronMassesProperty: TReadOnlyProperty<number>;
  electricFieldProperty: TReadOnlyProperty<number>;

  // Energy level index of the ground state.
  groundStateIndex?: 0 | 1;

  // Position offset (x-offset) from 0 nm.
  xOffset?: number;

  // Energy offset (y-offset) from 0 eV.
  yOffsetRange?: RangeWithValue;

  // Initial value of yRangeProperty when yOffsetProperty is zero.
  yRange: Range;

  // Range of wellWidthProperty in nm.
  wellWidthRange: RangeWithValue;

  // Number of decimal places to use for well width in the visual UI and core description. Finite Square is the only
  // potential that overrides the default in the Many Wells screen.
  // See https://github.com/phetsims/quantum-bound-states/issues/87.
  // Well width is the only Property that has an option like this because all other Properties have the same number
  // of decimal places in all screens, and therefore rely on constants defined in QBSConstants.
  wellWidthDecimalPlaces?: number;

  // Name used to identify this potential in the visual UI.
  visualNameProperty: TReadOnlyProperty<string>;

  // Name used to identify this potential in the accessible UI.
  accessibleNameProperty?: TReadOnlyProperty<string>;

  // Prefix for the tandem names related to this potential.
  tandemPrefix: string;
};

export type QuantumPotentialOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default abstract class QuantumPotential extends PhetioObject {

  // Global Properties that are shared by all QuantumPotential instances.
  public readonly numberOfWellsProperty: TRangedProperty;
  public readonly electronMassesProperty: TReadOnlyProperty<number>;
  public readonly electricFieldProperty: TReadOnlyProperty<number>;

  public readonly groundStateIndex: number;

  // Horizontal offset of the potential from x=0 nm. While the UI does not provide a way to change x-offset, the model
  // should handle a non-zero x-offset. So this is a Property for development purposes only and can be changed via
  // the subclasses of ConfigurePotentialDialog.
  public readonly xOffsetProperty: NumberProperty;

  // Vertical offset of the potential from y=0 eV.
  public readonly yOffsetProperty: NumberProperty;

  // Uniform width of all wells, in nm.
  public readonly wellWidthProperty: NumberProperty;

  // See SelfOptions.wellWidthDecimalPlaces.
  public readonly wellWidthDecimalPlaces: number;

  // Fires when the quantum potential has changed and the BoundStateResult needs to be recomputed.
  public readonly changedEmitter: Emitter;

  // Range of the y-axis (energy axis)
  public readonly yRangeProperty: TReadOnlyProperty<Range>;

  // Name used to identify this potential in the visual UI.
  public readonly visualNameProperty: TReadOnlyProperty<string>;

  // Name used to identify this potential in the accessible UI.
  public readonly accessibleNameProperty: TReadOnlyProperty<string>;

  // Prefix for the tandem names related to this potential.
  public readonly tandemPrefix: string;

  protected constructor( providedOptions: QuantumPotentialOptions ) {

    const options = optionize<QuantumPotentialOptions, StrictOmit<SelfOptions, 'numberOfWellsProperty'>, PhetioObjectOptions>()( {

      // SelfOptions
      groundStateIndex: 1,
      xOffset: 0,
      yOffsetRange: new RangeWithValue( 0, 0, 0 ), // effectively constant
      wellWidthDecimalPlaces: QBSConstants.WELL_WIDTH_DECIMAL_PLACES,
      accessibleNameProperty: providedOptions.visualNameProperty,

      // PhetioObjectOptions
      isDisposable: false,
      tandemNameSuffix: 'Potential',
      phetioState: false // because QuantumPotentialIO implements reference-type serialization.
    }, providedOptions );

    super( options );

    this.numberOfWellsProperty = options.numberOfWellsProperty;
    this.electronMassesProperty = options.electronMassesProperty;
    this.electricFieldProperty = options.electricFieldProperty;
    this.wellWidthDecimalPlaces = options.wellWidthDecimalPlaces;

    this.groundStateIndex = options.groundStateIndex;

    this.xOffsetProperty = new NumberProperty( options.xOffset, {
      units: nanometersUnit,
      range: QBSConstants.ALL_GRAPHS_X_RANGE
      // Do not instrument for PhET-iO. See https://github.com/phetsims/quantum-bound-states/issues/109.
    } );

    this.yOffsetProperty = new NumberProperty( options.yOffsetRange.defaultValue, {
      reentrant: true, // see energyRangeShiftProperty
      units: electronVoltsUnit,
      range: options.yOffsetRange,
      tandem: options.tandem.createTandem( 'yOffsetProperty' ),
      phetioFeatured: true,
      phetioReadOnly: ( options.yOffsetRange.getLength() === 0 ),
      phetioDocumentation: 'The y-axis offset (energy offset) of the potential from 0 eV.'
    } );

    this.wellWidthProperty = new NumberProperty( options.wellWidthRange.defaultValue, {
      units: nanometersUnit,
      range: options.wellWidthRange,
      tandem: options.tandem.createTandem( 'wellWidthProperty' ),
      phetioFeatured: true,
      phetioReadOnly: ( options.wellWidthRange.getLength() === 0 )
    } );

    // Emitters are typically not instrumented for PhET-iO, and there was no request to instrument this one.
    this.changedEmitter = new Emitter();

    this.yRangeProperty = new DerivedProperty( [ this.yOffsetProperty ], yOffset => {
      const min = roundToInterval( options.yRange.min + yOffset, QBSConstants.Y_OFFSET_INTERVAL );
      const max = roundToInterval( options.yRange.max + yOffset, QBSConstants.Y_OFFSET_INTERVAL );
      return new Range( min, max );
    }, {
      tandem: options.tandem.createTandem( 'yRangeProperty' ),
      phetioValueType: Range.RangeIO,
      phetioFeatured: true,
      phetioDocumentation: 'The range of the y-axis (energy axis) for the quantum potential.'
    } );

    // Changes to global Properties or Properties instantiated by this class trigger notification.
    Multilink.multilink( [ this.numberOfWellsProperty, this.electronMassesProperty, this.electricFieldProperty,
        this.xOffsetProperty, this.yOffsetProperty, this.wellWidthProperty ],
      () => this.changedEmitter.emit() );

    this.visualNameProperty = options.visualNameProperty;
    this.accessibleNameProperty = options.accessibleNameProperty;
    this.tandemPrefix = options.tandemPrefix;
  }

  public reset(): void {
    this.xOffsetProperty.reset();
    this.yOffsetProperty.reset();
    this.wellWidthProperty.reset();
  }

  /**
   * Require all subclasses to implement toString for debugging.
   */
  public abstract override toString(): string;

  /**
   * Solves for the bound state. The default uses a numerical solution (Numerov).
   */
  public abstract solveBoundState( xGrid: XGrid ): BoundStateResult;

  /**
   * Gets the minimum energy (eV) used to solve for the bound state.
   */
  public abstract getMinSolverEnergy(): number;

  /**
   * Gets the maximum energy (eV) used to solve for the bound state.
   */
  public abstract getMaxSolverEnergy(): number;

  /**
   * Gets the energy offset (in eV) at a specified position due to the electric field.
   */
  public getElectricFieldOffset( x: number ): number {
    return ( x - this.xOffsetProperty.value ) * this.electricFieldProperty.value;
  }

  /**
   * QuantumPotentialIO handles PhET-iO serialization of QuantumPotential instances.
   * It uses reference-type serialization as described in the Serialization section of
   * https://github.com/phetsims/phet-io/blob/main/doc/phet-io-instrumentation-technical-guide.md#serialization
   */
  public static readonly QuantumPotentialIO = new IOType<QuantumPotential, ReferenceIOState>( 'QuantumPotentialIO', {
    valueType: QuantumPotential,
    supertype: ReferenceIO( IOType.ObjectIO )
  } );
}
