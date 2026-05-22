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
import isSettingPhetioStateProperty from '../../../../../tandem/js/isSettingPhetioStateProperty.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import QBSConstants from '../../QBSConstants.js';
import FiniteSquareWellsIcon from '../../view/FiniteSquareWellsIcon.js'; // eslint-disable-line phet/no-view-imported-from-model
import FiniteSquareSolution from '../solver/analytical-solutions/FiniteSquareSolution.js';
import { BoundStateResult } from '../solver/BoundStateResult.js';
import XGrid from '../solver/XGrid.js';
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
      wellWidthRange: new RangeWithValue( 0.1, 6, 1 ), // for 1 well
      wellDepthRange: new RangeWithValue( 0.1, 20, 10 ), // for 1 well
      separationRange: new RangeWithValue( 0, 0, 0 ), // for 1 well, effectively constant zero

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
      tandem: ( options.separationRange.getLength() > 0 ) ? options.tandem.createTandem( 'separationProperty' ) : Tandem.OPT_OUT,
      phetioFeatured: true
    } );

    // Changes to Properties instantiated by this class trigger notification.
    Multilink.multilink( [ this.wellWidthProperty, this.wellDepthProperty, this.separationProperty ], () => {
      if ( !isSettingPhetioStateProperty.value ) {
        this.changedEmitter.emit();
      }
    } );
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
   * Solves for the bound state.
   */
  public override solveBoundState( xGrid: XGrid ): BoundStateResult {
    if ( this.numberOfWellsProperty.value === 1 && this.electricFieldProperty.value === 0 ) {

      // For single-well without electric field, use the analytical solution.
      return FiniteSquareSolution.solve( xGrid, {
        numberOfWells: this.numberOfWellsProperty.value,
        energyMin: this.getMinSolverEnergy(),
        energyMax: this.getMaxSolverEnergy(),
        xOffset: this.xOffsetProperty.value,
        yOffset: this.yOffsetProperty.value,
        wellWidth: this.wellWidthProperty.value,
        wellDepth: this.wellDepthProperty.value,
        electronMasses: this.electronMassesProperty.value,
        electricField: this.electricFieldProperty.value
      } );
    }
    else {

      // For multi-well or with electric field, use Numerov.
      return super.solveBoundState( xGrid );
    }
  }

  /**
   * Gets the potential energy (y-value) at a specified x-coordinate.
   */
  public override getPotentialEnergyAt( x: number ): number {

    const n = this.numberOfWellsProperty.value;
    const wellWidth = this.wellWidthProperty.value;
    const xOffset = this.xOffsetProperty.value;
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

    affirm( pe < QBSConstants.EFFECTIVELY_INFINITE_POTENTIAL_ENERGY );
    return pe;
  }

  public override getMinSolverEnergy(): number {
    return this.yOffsetProperty.value; // bottom of the well
  }

  public override getMaxSolverEnergy(): number {
    return this.yOffsetProperty.value + this.wellDepthProperty.value; // top of the well
  }

  /**
   * Gets the total width of this potential, the sum of the well widths and the spacing between the wells.
   */
  public getTotalWidth(): number {
    return ( this.numberOfWellsProperty.value * this.wellWidthProperty.value ) +
           ( ( this.numberOfWellsProperty.value - 1 ) * this.separationProperty.value );
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
