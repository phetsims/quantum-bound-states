// Copyright 2026, University of Colorado Boulder

/**
 * QuantumPotential is the base class for all quantum potentials.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Emitter from '../../../../../axon/js/Emitter.js';
import Multilink from '../../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../../dot/js/Range.js';
import RangeWithValue from '../../../../../dot/js/RangeWithValue.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import StrictOmit from '../../../../../phet-core/js/types/StrictOmit.js';
import { nanometersUnit } from '../../../../../scenery-phet/js/units/nanometersUnit.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import isSettingPhetioStateProperty from '../../../../../tandem/js/isSettingPhetioStateProperty.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../../tandem/js/PhetioObject.js';
import IOType from '../../../../../tandem/js/types/IOType.js';
import ReferenceIO, { ReferenceIOState } from '../../../../../tandem/js/types/ReferenceIO.js';
import { BoundStateResult } from '../solver/BoundStateResult.js';
import XGrid from '../solver/XGrid.js';
import { electronVoltsUnit } from '../units/electronVoltsUnit.js';

type SelfOptions = {

  // Global Properties that are shared by all QuantumPotential instances.
  numberOfWellsProperty: TReadOnlyProperty<number>;
  electronMassesProperty: TReadOnlyProperty<number>;
  electricFieldProperty: TReadOnlyProperty<number>;

  // Attributes that are specific to a particular QuantumPotential instance.
  groundStateIndex?: number;
  xOffsetRange?: RangeWithValue;
  yOffsetRange?: RangeWithValue;
  energyAxisRange?: Range; // range of the energy axis (y-axis) when yOffsetProperty is at its initial value
  visualNameProperty: TReadOnlyProperty<string>;
  accessibleNameProperty?: TReadOnlyProperty<string>;
  tandemPrefix: string;
};

export type QuantumPotentialOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default abstract class QuantumPotential extends PhetioObject {

  // Global Properties that are shared by all QuantumPotential instances.
  public readonly numberOfWellsProperty: TReadOnlyProperty<number>;
  public readonly electronMassesProperty: TReadOnlyProperty<number>;
  public readonly electricFieldProperty: TReadOnlyProperty<number>;

  public readonly groundStateIndex: number;

  // Horizontal offset of the potential from x=0 nm. This Property is not exposed in the UI or PhET-iO, and is
  // currently problematic if the value is not zero, causing some parts of the model to fail. It is provided solely
  // for development and testing and can be set via the subclasses of ConfigureQuantumPotentialDialog.
  //TODO Rename to positionOffsetProperty?
  public readonly xOffsetProperty: NumberProperty;

  // Vertical offset of the potential from y=0 eV.
  //TODO Renamed to energyOffsetProperty?
  public readonly yOffsetProperty: NumberProperty;

  // Fires when the quantum potential has changed and the BoundStateResult needs to be recomputed.
  public readonly changedEmitter: Emitter;

  public readonly energyAxisRange: Range;

  public readonly visualNameProperty: TReadOnlyProperty<string>;
  public readonly accessibleNameProperty: TReadOnlyProperty<string>;
  public readonly tandemPrefix: string;

  protected constructor( providedOptions: QuantumPotentialOptions ) {

    const options = optionize<QuantumPotentialOptions, StrictOmit<SelfOptions, 'numberOfWellsProperty'>, PhetioObjectOptions>()( {

      // SelfOptions
      groundStateIndex: 1,
      xOffsetRange: new RangeWithValue( 0, 0, 0 ), // effectively constant
      yOffsetRange: new RangeWithValue( 0, 0, 0 ), // effectively constant
      energyAxisRange: new Range( 0, 20 ).dilated( 0.5 ),
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

    this.groundStateIndex = options.groundStateIndex;

    this.xOffsetProperty = new NumberProperty( options.xOffsetRange.defaultValue, {
      units: nanometersUnit,
      range: options.xOffsetRange
      // Do not instrument for PhET-iO.
    } );

    this.yOffsetProperty = new NumberProperty( options.yOffsetRange.defaultValue, {
      reentrant: true, // see energyRangeShiftProperty
      units: electronVoltsUnit,
      range: options.yOffsetRange,
      tandem: options.tandem.createTandem( 'yOffsetProperty' ),
      phetioFeatured: true
      //TODO should this be phetioReadOnly: true?
    } );

    this.changedEmitter = new Emitter(); //TODO PhET-iO?

    this.energyAxisRange = options.energyAxisRange;

    // Changes to global Properties or Properties instantiated by this class trigger notification.
    //TODO Does energyAxisRangeProperty need to be included here? If not, document why not.
    Multilink.multilink( [ this.numberOfWellsProperty, this.electronMassesProperty, this.electricFieldProperty,
        this.xOffsetProperty, this.yOffsetProperty ],
      () => {
        if ( !isSettingPhetioStateProperty.value ) {
          this.changedEmitter.emit();
        }
      } );

    this.visualNameProperty = options.visualNameProperty;
    this.accessibleNameProperty = options.accessibleNameProperty;
    this.tandemPrefix = options.tandemPrefix;
  }

  public reset(): void {
    this.xOffsetProperty.reset();
    this.yOffsetProperty.reset();
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
   * Gets the contribution that electric field makes to potential energy at a specified position.
   */
  public getYOffsetForElectricField( x: number ): number {
    return x * this.electricFieldProperty.value;
  }

  /**
   * Creates the icon that represents this potential. Used in the combo box for selecting a potential.
   */
  public abstract createIcon(): Node;

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
