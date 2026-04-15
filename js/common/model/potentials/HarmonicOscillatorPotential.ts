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
import Vector2 from '../../../../../dot/js/Vector2.js';
import Shape from '../../../../../kite/js/Shape.js';
import affirm from '../../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize, { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import { nanometersUnit } from '../../../../../scenery-phet/js/units/nanometersUnit.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Path from '../../../../../scenery/js/nodes/Path.js';
import NumberIO from '../../../../../tandem/js/types/NumberIO.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import QBSColors from '../../QBSColors.js';
import QBSConstants from '../../QBSConstants.js';
import { electronVoltsPerNanometerSquaredUnit } from '../units/electronVoltsPerNanometerSquaredUnit.js';
import QuantumPotential, { QuantumPotentialOptions } from './QuantumPotential.js';

type SelfOptions = EmptySelfOptions;

type HarmonicOscillatorPotentialOptions = SelfOptions &
  Pick<QuantumPotentialOptions, 'numberOfWellsProperty' | 'electricFieldProperty' | 'tandem'>;

export default class HarmonicOscillatorPotential extends QuantumPotential {

  // This is the y-coordinate where well width is measured, in eV above yOffset.
  public static readonly WIDTH_HANDLE_ENERGY = 4;

  public readonly wellWidthProperty: NumberProperty;
  private readonly springConstantProperty: TReadOnlyProperty<number>;
  private readonly turningPointProperty: TReadOnlyProperty<Vector2>; //TODO delete if not used

  public constructor( providedOptions: HarmonicOscillatorPotentialOptions ) {

    const options = optionize<HarmonicOscillatorPotentialOptions, SelfOptions, QuantumPotentialOptions>()( {

      // QuantumPotentialOptions
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.harmonicOscillatorStringProperty,
      tandemPrefix: 'harmonicOscillatorPotential'
    }, providedOptions );

    super( options );

    this.wellWidthProperty = new NumberProperty( QBSConstants.WELL_WIDTH_RANGE.defaultValue, {
      units: nanometersUnit,
      //TODO range.min should be 0.1, but wellWidth < 0.4 causes assertion failure, no eigenvalues
      // range: QBSConstants.WELL_WIDTH_RANGE,
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

    /**
     * The right classical turning point for a given spring constant.
     *   x_tp = sqrt(2E / k)
     * The width drag handle will be located at this point.
     */
    //TODO Is this properly compensated for yOffset?
    this.turningPointProperty = new DerivedProperty( [ this.springConstantProperty ],
      springConstant => {
        const y = this.yOffsetProperty.value + HarmonicOscillatorPotential.WIDTH_HANDLE_ENERGY;
        const x = Math.sqrt( y / springConstant );
        return new Vector2( x, y );
      } );

    //TODO Or perhaps this is simpler?
    // this.turningPointProperty = new DerivedProperty( [ this.wellWidthProperty ],
    //   wellWidth => {
    //     const x = this.xOffset + wellWidth / 2;
    //     const y = this.yOffset + HarmonicOscillatorPotential.WIDTH_HANDLE_ENERGY;
    //     return new Vector2( x, y );
    //   } );

    // Changes to Properties instantiated by this class trigger notification.
    Multilink.multilink( [ this.wellWidthProperty ], () => this.propertyChangedEmitter.emit() );
  }

  public override reset(): void {
    super.reset();
    this.wellWidthProperty.reset();
  }

  /**
   * Gets the potential energy (eV) at a specified x-coordinate (nm).
   * For a 1D harmonic oscillator, V(x) = (1/2) k x²
   */
  public override getPotentialEnergyAt( x: number ): number {
    affirm( this.numberOfWellsProperty.value === 1, 'HarmonicOscillatorPotential does not support multiple wells.' );
    affirm( this.electricFieldProperty.value === 0, 'HarmonicOscillatorPotential does not support electric field.' );
    return 0.5 * this.springConstantProperty.value * x * x;
  }

  /**
   * Gets the index of the ground state.
   */
  public override getGroundStateIndex(): number {
    return 0;
  }

  public override getMinPotentialEnergy(): number {
    return this.yOffsetProperty.value;
  }

  public override getMaxPotentialEnergy(): number {
    return this.getEnergyAxisRange().max;
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
