// Copyright 2026, University of Colorado Boulder

/**
 * FiniteSquarePotential is a quantum potential composed of 1 finite square well.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import RangeWithValue from '../../../../../dot/js/RangeWithValue.js';
import affirm from '../../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import WithOptional from '../../../../../phet-core/js/types/WithOptional.js';
import { nanometersUnit } from '../../../../../scenery-phet/js/units/nanometersUnit.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import QBSConstants from '../../QBSConstants.js';
import FiniteSquareWellsIcon from '../../view/FiniteSquareWellsIcon.js'; // eslint-disable-line phet/no-view-imported-from-model
import { electronVoltsUnit } from '../units/electronVoltsUnit.js';
import QuantumPotential, { QuantumPotentialOptions } from './QuantumPotential.js';

type SelfOptions = {
  wellWidthRange?: RangeWithValue;
  wellDepthRange?: RangeWithValue;
  separationRange?: RangeWithValue;
};

export type FiniteSquarePotentialOptions = SelfOptions &
  WithOptional<QuantumPotentialOptions, 'visualNameProperty' | 'tandemPrefix'>;

export default class FiniteSquarePotential extends QuantumPotential {

  public readonly wellWidthProperty: NumberProperty;
  public readonly wellDepthProperty: NumberProperty;
  public readonly separationProperty: NumberProperty; // distance between walls of adjacent wells

  public constructor( providedOptions: FiniteSquarePotentialOptions ) {

    const options = optionize<FiniteSquarePotentialOptions, SelfOptions, QuantumPotentialOptions>()( {

      // SelfOptions
      wellWidthRange: QBSConstants.WELL_WIDTH_RANGE,
      wellDepthRange: QBSConstants.WELL_DEPTH_RANGE,
      separationRange: QBSConstants.SEPARATION_RANGE,

      // QuantumPotentialOptions
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.finiteSquareStringProperty,
      tandemPrefix: 'finiteSquarePotential'
    }, providedOptions );

    super( options );

    this.wellWidthProperty = new NumberProperty( options.wellWidthRange.defaultValue, {
      units: nanometersUnit,
      range: options.wellWidthRange,
      tandem: options.tandem.createTandem( 'wellWidthProperty' ),
      phetioFeatured: true
    } );

    this.wellDepthProperty = new NumberProperty( options.wellDepthRange.defaultValue, {
      units: electronVoltsUnit,
      range: options.wellDepthRange,
      tandem: options.tandem.createTandem( 'wellDepthProperty' ),
      phetioFeatured: true
    } );

    this.separationProperty = new NumberProperty( options.separationRange.defaultValue, {
      units: nanometersUnit,
      range: options.separationRange,
      tandem: options.tandem.createTandem( 'separationProperty' ),
      phetioFeatured: true
    } );

    // Changes to Properties instantiated by this class trigger notification.
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

  public override toString(): string {
    return `${this.tandemPrefix}[ ` +
           `numberOfWells=${this.numberOfWellsProperty.value} ` +
           `electricField=${this.electricFieldProperty.value} ` +
           `yOffset=${this.yOffsetProperty.value} ` +
           `wellWidth=${this.wellWidthProperty.value} ` +
           `wellDepth=${this.wellDepthProperty.value} ` +
           `separation=${this.separationProperty.value} ` +
           ']';
  }

  /**
   * Gets the potential energy (y-value) at a specified x-coordinate.
   */
  public override getPotentialEnergyAt( x: number ): number {

    const n = this.numberOfWellsProperty.value;
    const wellWidth = this.wellWidthProperty.value;
    const xOffset = this.xOffset;
    const yOffset = this.yOffsetProperty.value;
    const separation = wellWidth + this.separationProperty.value;

    let pe = yOffset + this.wellDepthProperty.value;

    // From BSSquarePotential.java
    for ( let i = 1; i <= n; i++ ) {
      const xi = separation * ( i - ( ( n + 1 ) / 2 ) );
      if ( ( ( x - xOffset ) >= xi - ( wellWidth / 2 ) ) && ( ( x - xOffset ) <= xi + ( wellWidth / 2 ) ) ) {
        pe = yOffset;
        break;
      }
    }

    // Apply electric field.
    pe += ( this.electricFieldProperty.value * x );

    affirm( pe < QBSConstants.EFFECTIVELY_INFINITE_ENERGY );
    return pe;
  }

  public override getMinSolverEnergy(): number {
    return this.yOffsetProperty.value; // bottom of the well
  }

  public override getMaxSolverEnergy(): number {
    return this.yOffsetProperty.value + this.wellDepthProperty.value; // top of the well
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
