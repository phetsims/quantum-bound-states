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
import Node from '../../../../../scenery/js/nodes/Node.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../../tandem/js/PhetioObject.js';
import IOType from '../../../../../tandem/js/types/IOType.js';
import ReferenceIO, { ReferenceIOState } from '../../../../../tandem/js/types/ReferenceIO.js';
import { BoundStateResult } from '../solver/BoundStateResult.js';
import NumerovSolver from '../solver/NumerovSolver.js';
import XGrid from '../solver/XGrid.js';
import { electronVoltsUnit } from '../units/electronVoltsUnit.js';

// Energy axis (y-axis) range for most potential types.
const DEFAULT_ENERGY_AXIS_RANGE = new Range( 0, 20 ).dilated( 0.5 );

// Default y-offset range is effectively constant 0.
const DEFAULT_Y_OFFSET_RANGE = new RangeWithValue( 0, 0, 0 );

type SelfOptions = {
  groundStateIndex?: number;
  numberOfWellsProperty: TReadOnlyProperty<number>;
  electricFieldProperty: TReadOnlyProperty<number>;
  energyAxisRange?: Range; // range of the energy axis (y-axis) when yOffsetProperty is at its initial value
  yOffsetRange?: RangeWithValue;
  visualNameProperty: TReadOnlyProperty<string>;
  accessibleNameProperty?: TReadOnlyProperty<string>;
  tandemPrefix: string;
};

export type QuantumPotentialOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default abstract class QuantumPotential extends PhetioObject {

  public readonly groundStateIndex: number;

  // Horizontal offset of the potential from x=0 nm.
  // As in the Java version, this is constant in the sim and is provided for future-proofing.
  protected readonly xOffset = 0;

  // Fires when any Property instantiated by the QuantumPotential changes.
  public readonly propertyChangedEmitter: Emitter;

  public readonly numberOfWellsProperty: TReadOnlyProperty<number>;
  public readonly electricFieldProperty: TReadOnlyProperty<number>;

  public readonly yOffsetProperty: NumberProperty;
  public readonly energyAxisRange: Range;

  public readonly visualNameProperty: TReadOnlyProperty<string>;
  public readonly accessibleNameProperty: TReadOnlyProperty<string>;
  public readonly tandemPrefix: string;

  private readonly getPotentialEnergyAtBound: ( x: number ) => number;

  protected constructor( providedOptions: QuantumPotentialOptions ) {

    const options = optionize<QuantumPotentialOptions, StrictOmit<SelfOptions, 'numberOfWellsProperty'>, PhetioObjectOptions>()( {

      // SelfOptions
      groundStateIndex: 1,
      energyAxisRange: DEFAULT_ENERGY_AXIS_RANGE,
      yOffsetRange: DEFAULT_Y_OFFSET_RANGE,
      accessibleNameProperty: providedOptions.visualNameProperty,

      // PhetioObjectOptions
      tandemNameSuffix: 'Potential',
      phetioState: false // because QuantumPotentialIO implements reference-type serialization.
    }, providedOptions );

    super( options );

    this.groundStateIndex = options.groundStateIndex;

    this.propertyChangedEmitter = new Emitter(); //TODO PhET-iO?

    // Do not trigger notification when numberOfWellsProperty or electricFieldProperty changes,
    // because they are owned by the top-level model.
    this.numberOfWellsProperty = options.numberOfWellsProperty;
    this.electricFieldProperty = options.electricFieldProperty;

    this.yOffsetProperty = new NumberProperty( options.yOffsetRange.defaultValue, {
      units: electronVoltsUnit,
      range: options.yOffsetRange,
      tandem: options.tandem.createTandem( 'yOffsetProperty' ),
      phetioFeatured: true
      //TODO should this be phetioReadOnly: true?
    } );

    this.energyAxisRange = options.energyAxisRange;

    // Changes to Properties instantiated by this class trigger notification.
    //TODO Does energyAxisRangeProperty need to be included here? If not, document why not.
    Multilink.multilink( [ this.yOffsetProperty ], () => this.propertyChangedEmitter.emit() );

    this.visualNameProperty = options.visualNameProperty;
    this.accessibleNameProperty = options.accessibleNameProperty;
    this.tandemPrefix = options.tandemPrefix;

    this.getPotentialEnergyAtBound = this.getPotentialEnergyAt.bind( this );
  }

  public reset(): void {
    this.yOffsetProperty.reset();
  }

  public override toString(): string {
    return `${this.tandemPrefix}[ ` +
           `numberOfWells=${this.numberOfWellsProperty.value} ` +
           `electricField=${this.electricFieldProperty.value} ` +
           ']';
  }

  /**
   * Gets the potential energy (eV) at a specified x-coordinate (nm).
   */
  public abstract getPotentialEnergyAt( x: number ): number;

  /**
   * Gets the minimum potential energy (eV) used to solve for the bound state.
   */
  public abstract getMinPotentialEnergy(): number;

  /**
   * Gets the maximum potential energy (eV) used to solve for the bound state.
   */
  public abstract getMaxPotentialEnergy(): number;

  /**
   * Solves for the bound state. The default uses a numerical solution.
   */
  public solveBoundState( xGrid: XGrid, electronMasses: number ): BoundStateResult {
    const minPotentialEnergy = this.getMinPotentialEnergy();
    const maxPotentialEnergy = this.getMaxPotentialEnergy();
    return NumerovSolver.solve( xGrid, this.getPotentialEnergyAtBound, electronMasses, minPotentialEnergy, maxPotentialEnergy );
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
