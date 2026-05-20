// Copyright 2026, University of Colorado Boulder

/**
 * HarmonicOscillatorPotential is a quantum potential composed of 1 harmonic oscillator well.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../../dot/js/Range.js';
import RangeWithValue from '../../../../../dot/js/RangeWithValue.js';
import Shape from '../../../../../kite/js/Shape.js';
import affirm, { isAffirmEnabled } from '../../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import { nanometersUnit } from '../../../../../scenery-phet/js/units/nanometersUnit.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Path from '../../../../../scenery/js/nodes/Path.js';
import isSettingPhetioStateProperty from '../../../../../tandem/js/isSettingPhetioStateProperty.js';
import NumberIO from '../../../../../tandem/js/types/NumberIO.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import QBSColors from '../../QBSColors.js';
import QBSConstants from '../../QBSConstants.js';
import QBSTime from '../QBSTime.js';
import { BoundStateResult } from '../solver/BoundStateResult.js';
import XGrid from '../solver/XGrid.js';
import { electronVoltsPerNanometerSquaredUnit } from '../units/electronVoltsPerNanometerSquaredUnit.js';
import { inverseFemtosecondsUnit } from '../units/inverseFemtosecondsUnit.js';
import QuantumPotential, { QuantumPotentialOptions } from './QuantumPotential.js';

type SelfOptions = {
  wellWidthRange?: RangeWithValue;
};

export type HarmonicOscillatorPotentialOptions = SelfOptions &
  Pick<QuantumPotentialOptions, 'numberOfWellsProperty' | 'electricFieldProperty' | 'yOffsetRange' | 'tandem'>;

export default class HarmonicOscillatorPotential extends QuantumPotential {

  // This is the y-coordinate where well width is measured, in eV above yOffset.
  public static readonly WIDTH_HANDLE_ENERGY = 4;

  public readonly wellWidthProperty: NumberProperty;
  private readonly springConstantProperty: TReadOnlyProperty<number>;
  public readonly angularFrequencyProperty: TReadOnlyProperty<number>;

  public constructor( electronMassesProperty: TReadOnlyProperty<number>, providedOptions: HarmonicOscillatorPotentialOptions ) {

    const options = optionize<HarmonicOscillatorPotentialOptions, SelfOptions, QuantumPotentialOptions>()( {

      // SelfOptions
      wellWidthRange: QBSConstants.WELL_WIDTH_RANGE,

      // QuantumPotentialOptions
      groundStateIndex: 0,
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.harmonicOscillatorStringProperty,
      tandemPrefix: 'harmonicOscillatorPotential'
    }, providedOptions );

    super( options );

    this.wellWidthProperty = new NumberProperty( options.wellWidthRange.defaultValue, {
      units: nanometersUnit,
      //TODO range.min should be 0.1, but wellWidth < 0.4 causes assertion failure, no eigenvalues
      // range: options.wellWidthRange,
      range: new Range( 0.4, 6 ),
      tandem: options.tandem.createTandem( 'wellWidthProperty' ),
      phetioFeatured: true
    } );

    /**
     * Derive the spring constant from wellWidth at a fixed energy E = WIDTH_HANDLE_ENERGY above the well minimum.
     *
     *  At the turning point: (1/2) k x_tp² = E
     *    → x_tp = sqrt(2E / k)
     *  The full classical width w is the distance between the two turning points:
     *    → w = 2 x_tp = 2 sqrt(2E / k)
     *
     *  Inverting for k:
     *    k = 2E / x_tp² = 8E / w²
     */
    this.springConstantProperty = new DerivedProperty( [ this.wellWidthProperty ],
      wellWidth => {
        const halfWellWidth = wellWidth / 2;
        return ( 2 * HarmonicOscillatorPotential.WIDTH_HANDLE_ENERGY ) / ( halfWellWidth * halfWellWidth );
      }, {
        units: electronVoltsPerNanometerSquaredUnit,
        tandem: options.tandem.createTandem( 'springConstantProperty' ),
        phetioValueType: NumberIO,
        phetioFeatured: true
      } );

      // Calculate the angular frequency: ω = (2/width)*sqrt(2E/m)
    this.angularFrequencyProperty = new DerivedProperty( [ this.wellWidthProperty, electronMassesProperty ],
      ( wellWidth, electronMasses ) => {
        const energy = HarmonicOscillatorPotential.WIDTH_HANDLE_ENERGY;
        
        const angularFrequency =   ( 2 / wellWidth ) * Math.sqrt( 2 * energy / electronMasses );  // in rad/(natural time unit of 2.385 x10^-15 sec)
        
        // Convert from 1/(natural time unit) to 1/femtoseconds
        return angularFrequency / QBSTime.NATURAL_TIME_UNIT_FS;
      }, {
        units: inverseFemtosecondsUnit,
        tandem: options.tandem.createTandem( 'angularFrequencyProperty' ),
        phetioValueType: NumberIO,
        phetioFeatured: true
      } );

    // Changes to Properties instantiated by this class trigger notification.
    Multilink.multilink( [ this.wellWidthProperty ], () => {
      if ( !isSettingPhetioStateProperty.value ) {
        this.propertyChangedEmitter.emit();
      }
    } );
  }

  public override reset(): void {
    super.reset();
    this.wellWidthProperty.reset();
  }

  public override toString(): string {
    return `${this.tandemPrefix}[ ` +
           `numberOfWells=${this.numberOfWellsProperty.value} ` +
           `electricField=${this.electricFieldProperty.value} ` +
           `yOffset=${this.yOffsetProperty.value} ` +
           `wellWidth=${this.wellWidthProperty.value} ` +
           ']';
  }

  /**
   * Solves for the bound state using an analytic solution.
   */
  public override solveBoundState( xGrid: XGrid, electronMasses: number ): BoundStateResult {
    affirm( this.numberOfWellsProperty.value === 1, 'HarmonicOscillatorPotential does not support multiple wells.' );

    //TODO https://github.com/phetsims/quantum-bound-states/issues/43 Replace with HarmonicOscillatorSoluton.solve
    return super.solveBoundState( xGrid, electronMasses );
  }

  /**
   * Gets the potential energy (eV) at a specified x-coordinate (nm).
   * For a 1D harmonic oscillator, V(x) = (1/2) k x²
   */
  public override getPotentialEnergyAt( x: number ): number {
    if ( isAffirmEnabled() ) {
      affirm( this.numberOfWellsProperty.value === 1, 'HarmonicOscillatorPotential does not support multiple wells.' );
      affirm( this.electricFieldProperty.value === 0, 'HarmonicOscillatorPotential does not support electric field.' );
    }
    const xAdjusted = x - this.xOffsetProperty.value;
    return this.yOffsetProperty.value + ( 0.5 * this.springConstantProperty.value * xAdjusted * xAdjusted );
  }

  public override getMinSolverEnergy(): number {
    return this.yOffsetProperty.value; // bottom of the well
  }

  public override getMaxSolverEnergy(): number {
    return this.energyAxisRange.max + this.yOffsetProperty.value; // top of the y-axis range
  }

  public override createIcon(): Node {

    // Shape ported from BSWellComboBox.java, values determined empirically.
    const shape = new Shape()
      .moveTo( 0, 3 )
      .quadraticCurveTo( 8.5, 30, 17, 3 );

    return new Path( shape, {
      stroke: QBSColors.potentialEnergyColorProperty,
      lineWidth: QBSConstants.POTENTIAL_ICON_LINE_WIDTH
    } );
  }
}
