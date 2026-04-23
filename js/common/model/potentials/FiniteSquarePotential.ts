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
import NumerovSolver from '../solver/NumerovSolver.js';
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
   * Returns a non-uniform energy scan grid based on the infinite square well (ISW) eigenvalues.
   *
   * Physics: By Sturm-Liouville theory, each ISW interval (E_{n-1}^ISW, E_n^ISW) contains
   * exactly numberOfWells finite-well eigenvalues. Using ISW energies as bracket boundaries
   * and adding stepsPerInterval sub-steps within each interval guarantees that every eigenvalue
   * is detected, even for wide or deep wells where the uniform scan step would be too coarse.
   *
   * ISW energy for a single well of width L:  E_n = n²π²ħ²/(2mL²)
   */
  public override getEnergyScanPoints( mass: number ): number[] {
    const n_wells = this.numberOfWellsProperty.value;
    const L = this.wellWidthProperty.value;     // single-well width, nm
    const V0 = this.wellDepthProperty.value;    // eV
    const yOffset = this.yOffsetProperty.value; // eV
    const HBAR = NumerovSolver.HBAR;

    // 5 sub-steps per expected eigenvalue within each ISW interval.
    // For N wells there are N eigenvalues per ISW interval (band splitting).
    const STEPS_PER_EIGENVALUE = 5;
    const stepsPerInterval = STEPS_PER_EIGENVALUE * n_wells;

    const scanPoints: number[] = [ yOffset ];

    // ISW energies use the single-well width — valid upper bounds for all well counts.
    let n = 1;
    while ( true ) {
      const E_isw = yOffset + ( n * n * Math.PI * Math.PI * HBAR * HBAR ) / ( 2 * mass * L * L );
      const prevE = scanPoints[ scanPoints.length - 1 ];
      const upperBound = Math.min( E_isw, yOffset + V0 );

      for ( let k = 1; k <= stepsPerInterval; k++ ) {
        scanPoints.push( prevE + ( upperBound - prevE ) * k / stepsPerInterval );
      }

      if ( E_isw >= yOffset + V0 ) { break; }
      n++;
    }

    return scanPoints;
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
