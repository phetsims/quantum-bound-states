// Copyright 2026, University of Colorado Boulder

/**
 * MorsePotential is a quantum potential based on the Morse potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import RangeWithValue from '../../../../../dot/js/RangeWithValue.js';
import Shape from '../../../../../kite/js/Shape.js';
import affirm from '../../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import { nanometersUnit } from '../../../../../scenery-phet/js/units/nanometersUnit.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Path from '../../../../../scenery/js/nodes/Path.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import QBSColors from '../../QBSColors.js';
import QBSConstants from '../../QBSConstants.js';
import { electronVoltsUnit } from '../units/electronVoltsUnit.js';
import QuantumPotential, { QuantumPotentialOptions } from './QuantumPotential.js';

type SelfOptions = {
  wellWidthRange?: RangeWithValue;
  wellDepthRange?: RangeWithValue;
};

export type MorsePotentialOptions = SelfOptions &
  Pick<QuantumPotentialOptions, 'numberOfWellsProperty' | 'electricFieldProperty' | 'yOffsetRange' | 'tandem'>;

export default class MorsePotential extends QuantumPotential {

  public readonly wellWidthProperty: NumberProperty;
  public readonly wellDepthProperty: NumberProperty;

  public constructor( providedOptions: MorsePotentialOptions ) {

    const options = optionize<MorsePotentialOptions, SelfOptions, QuantumPotentialOptions>()( {

      // SelfOptions
      wellWidthRange: QBSConstants.WELL_WIDTH_RANGE,
      wellDepthRange: QBSConstants.WELL_DEPTH_RANGE,

      // QuantumPotentialOptions
      groundStateIndex: 0,
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.morseStringProperty,
      tandemPrefix: 'morsePotential'
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

    // Changes to Properties instantiated by this class trigger notification.
    Multilink.multilink(
      [ this.wellWidthProperty, this.wellDepthProperty ],
      () => this.propertyChangedEmitter.emit() );
  }

  public override reset(): void {
    super.reset();
    this.wellWidthProperty.reset();
    this.wellDepthProperty.reset();
  }

  public override toString(): string {
    return `${this.tandemPrefix}[ ` +
           `numberOfWells=${this.numberOfWellsProperty.value} ` +
           `electricField=${this.electricFieldProperty.value} ` +
           `yOffset=${this.yOffsetProperty.value} ` +
           `wellWidth=${this.wellWidthProperty.value} ` +
           `wellDepth=${this.wellDepthProperty.value} ` +
           ']';
  }

  /**
   * Gets the potential energy (eV) at a specified x-coordinate (nm).
   */
  public getPotentialEnergyAt( x: number ): number {
    affirm( this.numberOfWellsProperty.value === 1, 'MorsePotential does not support multiple wells.' );
    affirm( this.electricFieldProperty.value === 0, 'MorsePotential does not support electric field.' );
    //TODO parameters: yOffset, xOffset, wellWidth, wellDepth

    //TODO This fails with no eigenvalues found.
    // return solveMorse( x, this.wellDepthProperty.value, this.wellWidthProperty.value, this.xOffset );
    return 0;
  }

  public override getMinPotentialEnergy(): number {
    return this.yOffsetProperty.value; // bottom of the well
  }

  public override getMaxPotentialEnergy(): number {
    return this.energyAxisRange.max + this.yOffsetProperty.value; // top of the y-axis range
  }

  /**
   * Creates the icon for this potential.
   */
  public override createIcon(): Node {

    // Sampling parameters
    const numberOfPoints = 100;
    const xMin = 0.2;
    const xMax = 10;
    const dx = ( xMax - xMin ) / numberOfPoints;

    // Scaling parameters to fit the sampled data to the desired size for the icon, determined empirically.
    const xScale = 1.7;
    const yScale = -10.1; // negative to invert the y-axis to match scenery's coordinate frame.

    // Create the Shape by sampling the curve, scaling xy-coordinates to fit the desired size and coordinate frame.
    const shape = new Shape();
    for ( let x = xMin; x <= xMax; x += dx ) {
      const y = solveMorse( x, 1, 1, 1 );
      shape.lineTo( xScale * x, yScale * y );
    }

    return new Path( shape, {
      stroke: QBSColors.potentialEnergyColorProperty,
      lineWidth: QBSConstants.POTENTIAL_ICON_LINE_WIDTH
    } );
  }
}

/**
 * Solve the Morse potential.
 */
function solveMorse( x: number, wellDepth: number, wellWidth: number, xOffset: number ): number {
  const term = 1 - Math.exp( -( x - xOffset ) / wellWidth );
  return wellDepth * term * term - wellDepth;
}