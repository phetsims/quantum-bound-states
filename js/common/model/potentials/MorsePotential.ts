// Copyright 2026, University of Colorado Boulder

/**
 * MorsePotential is a quantum potential based on the Morse potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import Range from '../../../../../dot/js/Range.js';
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
  wellWidth?: number;
  wellWidthRange?: Range;
  //TODO spacing - This is problematic because width and spacing are related.
};

type MorsePotentialOptions = SelfOptions &
  Pick<QuantumPotentialOptions, 'groundStateIndex' | 'numberOfWellsProperty' | 'electricFieldProperty' | 'tandem'>;

export default class MorsePotential extends QuantumPotential {

  public readonly wellWidthProperty: NumberProperty;
  public readonly wellDepthProperty: NumberProperty;
  //TODO spacingProperty

  public constructor( providedOptions: MorsePotentialOptions ) {

    const options = optionize<MorsePotentialOptions, SelfOptions, QuantumPotentialOptions>()( {

      // SelfOptions
      wellWidth: QBSConstants.WELL_WIDTH_RANGE.defaultValue,
      wellWidthRange: QBSConstants.WELL_WIDTH_RANGE,

      // QuantumPotentialOptions
      groundStateIndex: 0,
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.morseStringProperty,
      tandemPrefix: 'morsePotential'
    }, providedOptions );

    super( options );

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

    // Changes to Properties instantiated by this class trigger notification.
    //TODO add spacingProperty
    Multilink.multilink(
      [ this.wellWidthProperty, this.wellDepthProperty ],
      () => this.propertyChangedEmitter.emit() );
  }

  /**
   * Gets the potential energy (eV) at a specified x-coordinate (nm).
   */
  public getPotentialEnergyAt( x: number ): number {
    //TODO affirm that numberOfWellsProperty.value === 1 or 2
    affirm( this.electricFieldProperty.value === 0, 'MorsePotential does not support electric field.' );
    //TODO parameters: N wells, yOffset, xOffset, wellWidth, wellDepth, spacing?

    //TODO This fails with no eigenvalues found.
    // return solveMorse( x, this.wellDepthProperty.value, this.wellWidthProperty.value, this.xOffset );
    return 0;
  }

  public override getMinPotentialEnergy(): number {
    return this.yOffsetProperty.value; // bottom of the well
  }

  public override getMaxPotentialEnergy(): number {
    return this.energyAxisRangeProperty.value.max; //TODO is this correct, or should it be the top of the potential?
  }

  /**
   * Creates the icon for this potential.
   */
  public override createIcon(): Node {

    // Sampling parameters.
    const xMin = 0.2;
    const xMax = 10;
    const dx = 0.1;

    // Scaling parameters to fit the sampled data to the desired size for the icon, determined empirically.
    const xScale = 1.7;
    const yScale = -10.1; // negative to invert the y-axis to match scenery's coordinate frame.

    // Create the Shape by sampling the curve, then scaling xy-coordinates to fit the desired size and coordinate frame.
    const shape = new Shape();
    for ( let x = xMin; x <= xMax; x += dx ) {
      shape.lineTo( xScale * x, yScale * solveMorse( x, 1, 1, 1 ) );
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