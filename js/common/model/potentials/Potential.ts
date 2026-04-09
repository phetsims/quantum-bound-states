// Copyright 2026, University of Colorado Boulder

/**
 * Potential is the base class for all potential potentials.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../../dot/js/Range.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../../tandem/js/PhetioObject.js';
import IOType from '../../../../../tandem/js/types/IOType.js';
import ReferenceIO, { ReferenceIOState } from '../../../../../tandem/js/types/ReferenceIO.js';

// Energy axis range for most potential types.
const ENERGY_AXIS_RANGE = new Range( -0.5, 20.5 );

type SelfOptions = {
  visualNameProperty: TReadOnlyProperty<string>;
  accessibleNameProperty?: TReadOnlyProperty<string>;
  tandemPrefix: string;
};

export type PotentialWellOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem' | 'phetioDocumentation'>;

export default abstract class Potential extends PhetioObject {

  public readonly visualNameProperty: TReadOnlyProperty<string>;
  public readonly accessibleNameProperty: TReadOnlyProperty<string>;
  public readonly tandemPrefix: string;

  protected constructor( providedOptions: PotentialWellOptions ) {

    const options = optionize<PotentialWellOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      accessibleNameProperty: providedOptions.visualNameProperty,

      // PhetioObjectOptions
      phetioState: false // because PotentialIO implements reference-type serialization.
    }, providedOptions );

    super( options );

    this.visualNameProperty = options.visualNameProperty;
    this.accessibleNameProperty = options.accessibleNameProperty;
    this.tandemPrefix = options.tandemPrefix;
  }

  /**
   * Gets the potential energy (eV) at a specified x-coordinate (nm).
   */
  public getPotentialEnergyAt( x: number ): number {
    return 0; //TODO This method should be abstract, as in BSAbstractPotential.java getEnergyAt
  }

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
    return ENERGY_AXIS_RANGE;
  }

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
   * PotentialIO handles PhET-iO serialization of Potential instances, as described in the Serialization section of
   * https://github.com/phetsims/phet-io/blob/main/doc/phet-io-instrumentation-technical-guide.md#serialization
   */
  public static readonly PotentialIO = new IOType<Potential, ReferenceIOState>( 'PotentialIO', {
    valueType: Potential,
    supertype: ReferenceIO( IOType.ObjectIO )
  } );
}
