// Copyright 2026, University of Colorado Boulder

/**
 * FiniteSquarePotential is a quantum potential composed of 1 finite square well.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import ReadOnlyProperty from '../../../../../axon/js/ReadOnlyProperty.js';
import Range from '../../../../../dot/js/Range.js';
import affirm from '../../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../../phet-core/js/types/StrictOmit.js';
import WithOptional from '../../../../../phet-core/js/types/WithOptional.js';
import { nanometersUnit } from '../../../../../scenery-phet/js/units/nanometersUnit.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import QBSConstants from '../../QBSConstants.js';
import FiniteSquareWellsIcon from '../../view/FiniteSquareWellsIcon.js'; // eslint-disable-line phet/no-view-imported-from-model
import { electronVoltsUnit } from '../units/electronVoltsUnit.js';
import QuantumPotential, { QuantumPotentialOptions } from './QuantumPotential.js';

type SelfOptions = {
  electricFieldProperty: ReadOnlyProperty<number>;
  wellWidth?: number;
  wellWidthRange?: Range;
  separation?: number;
  separationRange?: Range;
};

export type FiniteSquarePotentialOptions = SelfOptions &
  WithOptional<QuantumPotentialOptions, 'visualNameProperty' | 'tandemPrefix'>;

export default class FiniteSquarePotential extends QuantumPotential {

  public readonly electricFieldProperty: ReadOnlyProperty<number>;
  public readonly wellWidthProperty: NumberProperty;
  public readonly wellDepthProperty: NumberProperty;
  public readonly separationProperty: NumberProperty; // distance between walls of adjacent wells

  public constructor( providedOptions: FiniteSquarePotentialOptions ) {

    const options = optionize<FiniteSquarePotentialOptions, StrictOmit<SelfOptions, 'separationRange'>, QuantumPotentialOptions>()( {

      // SelfOptions
      wellWidth: QBSConstants.WELL_WIDTH_RANGE.defaultValue,
      wellWidthRange: QBSConstants.WELL_WIDTH_RANGE,
      separation: 0.1,

      // QuantumPotentialOptions
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.finiteSquareStringProperty,
      tandemPrefix: 'finiteSquarePotential'
    }, providedOptions );

    // If range is not specified, set the range length to zero so that the Property is effectively constant.
    options.separationRange = options.separationRange || new Range( options.separation, options.separation );

    super( options );

    this.electricFieldProperty = options.electricFieldProperty;

    this.wellWidthProperty = new NumberProperty( options.wellWidth, {
      units: nanometersUnit,
      range: options.wellWidthRange,
      tandem: options.tandem.createTandem( 'wellWidthProperty' ),
      phetioFeatured: true
    } );

    this.wellDepthProperty = new NumberProperty( QBSConstants.WELL_DEPTH_RANGE.defaultValue, {
      units: electronVoltsUnit,
      range: QBSConstants.WELL_DEPTH_RANGE,
      tandem: options.tandem.createTandem( 'wellDepthProperty' ),
      phetioFeatured: true
    } );

    this.separationProperty = new NumberProperty( options.separation, {
      units: nanometersUnit,
      range: options.separationRange,
      tandem: options.tandem.createTandem( 'separationProperty' ),
      phetioFeatured: true
    } );

    // Changes to Properties instantiated by this class trigger notification.
    // Do not trigger notification when electricFieldProperty changes, because it is owned by the top-level model.
    Multilink.multilink(
      [ this.wellWidthProperty, this.wellDepthProperty, this.separationProperty ],
      () => this.propertyChangedEmitter.emit() );
  }

  public override reset(): void {
    super.reset();
    this.wellWidthProperty.reset();
    this.wellDepthProperty.reset();
    this.separationProperty.reset();
  }

  /**
   * Gets the potential energy (y-value) at a specified x-coordinate.
   */
  public override getPotentialEnergyAt( x: number ): number {

    const n = this.numberOfWellsProperty.value;
    const wellWidth = this.wellWidthProperty.value;
    const xOffset = this.xOffset;
    const yOffset = this.yOffsetProperty.value;
    const s = wellWidth + this.separationProperty.value;

    let pe = yOffset + this.wellDepthProperty.value;

    // From BSSquarePotential.java
    for ( let i = 1; i <= n; i++ ) {
      const xi = s * ( i - ( ( n + 1 ) / 2 ) );
      if ( ( ( x - xOffset ) >= xi - ( wellWidth / 2 ) ) && ( ( x - xOffset ) <= xi + ( wellWidth / 2 ) ) ) {
        pe = yOffset;
        break;
      }
    }

    // Apply electric field.
    pe += ( this.electricFieldProperty.value * x );

    affirm( pe < 100000 );
    return pe;
  }

  public override getMinPotentialEnergy(): number {
    return this.yOffsetProperty.value;
  }

  public override getMaxPotentialEnergy(): number {
    return this.yOffsetProperty.value + this.wellDepthProperty.value;
  }

  /**
   * Creates the icon for this potential.
   */
  public override createIcon(): Node {
    return new FiniteSquareWellsIcon( {
      numberOfWells: 1,
      wellWidth: 12,
      wellDepth: 12,
      edgeLength: 8,
      lineWidth: 2
    } );
  }
}
