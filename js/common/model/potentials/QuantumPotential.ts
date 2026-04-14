// Copyright 2026, University of Colorado Boulder

/**
 * QuantumPotential is the base class for all quantum potentials.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Emitter from '../../../../../axon/js/Emitter.js';
import ReadOnlyProperty from '../../../../../axon/js/ReadOnlyProperty.js';
import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../../dot/js/Range.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import StrictOmit from '../../../../../phet-core/js/types/StrictOmit.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../../tandem/js/PhetioObject.js';
import IOType from '../../../../../tandem/js/types/IOType.js';
import ReferenceIO, { ReferenceIOState } from '../../../../../tandem/js/types/ReferenceIO.js';

// Energy axis (y-axis) range for most potential types.
const DEFAULT_ENERGY_AXIS_RANGE = new Range( 0, 20 ).dilated( 0.5 );

type SelfOptions = {
  numberOfWellsProperty: ReadOnlyProperty<number>;
  visualNameProperty: TReadOnlyProperty<string>;
  accessibleNameProperty?: TReadOnlyProperty<string>;
  tandemPrefix: string;
};

export type QuantumPotentialOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem' | 'phetioDocumentation'>;

export default abstract class QuantumPotential extends PhetioObject {

  // Horizontal offset of the potential from x=0 nm.
  // As in the Java version, this is constant in the sim and is provided for future-proofing.
  protected readonly xOffset = 0;

  protected readonly yOffset = 0; //TODO mutable

  // Fires when any Property instantiated by the QuantumPotential changes.
  public readonly propertyChangedEmitter: Emitter;

  protected readonly numberOfWellsProperty: ReadOnlyProperty<number>;
  public readonly visualNameProperty: TReadOnlyProperty<string>;
  public readonly accessibleNameProperty: TReadOnlyProperty<string>;
  public readonly tandemPrefix: string;

  protected constructor( providedOptions: QuantumPotentialOptions ) {

    const options = optionize<QuantumPotentialOptions, StrictOmit<SelfOptions, 'numberOfWellsProperty'>, PhetioObjectOptions>()( {

      // SelfOptions
      accessibleNameProperty: providedOptions.visualNameProperty,

      // PhetioObjectOptions
      phetioState: false // because QuantumPotentialIO implements reference-type serialization.
    }, providedOptions );

    super( options );

    this.propertyChangedEmitter = new Emitter(); //TODO PhET-iO?

    // Do not trigger notification when numberOfWellsProperty changes, because it is owned by the top-level model.
    this.numberOfWellsProperty = options.numberOfWellsProperty;

    this.visualNameProperty = options.visualNameProperty;
    this.accessibleNameProperty = options.accessibleNameProperty;
    this.tandemPrefix = options.tandemPrefix;
  }

  public reset(): void {
    //TODO
  }

  /**
   * Gets the potential energy (eV) at a specified x-coordinate (nm).
   */
  public abstract getPotentialEnergyAt( x: number ): number;

  /**
   * Gets the index of the ground state, 1 for most potential types.
   */
  public getGroundStateIndex(): number {
    return 1;
  }

  /**
   * Gets the range of the energy axis (y-axis).
   */
  public getEnergyAxisRange(): Range {
    return DEFAULT_ENERGY_AXIS_RANGE;
  }

  //TODO Combine getMinPotentialEnergy and getMaxPotentialEnergy into getPotentialEnergyLimits(): Range?
  /**
   * Gets the minimum potential energy (eV) used to compute eigenstates and wave functions.
   */
  public abstract getMinPotentialEnergy(): number;

  /**
   * Gets the maximum potential energy (eV) used to compute eigenstates and wave functions.
   */
  public abstract getMaxPotentialEnergy(): number;

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
