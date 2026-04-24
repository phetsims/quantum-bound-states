// Copyright 2026, University of Colorado Boulder

//TODO Rename to 'Anharmonic Oscillator'?
/**
 * PoschlTellerPotential is a Pöschl-Teller potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import Range from '../../../../../dot/js/Range.js';
import RangeWithValue from '../../../../../dot/js/RangeWithValue.js';
import affirm from '../../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import { nanometersUnit } from '../../../../../scenery-phet/js/units/nanometersUnit.js';
import Shape from '../../../../../kite/js/Shape.js';
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
  spacingRange?: RangeWithValue;
};

export type PoschlTellerPotentialOptions = SelfOptions &
  Pick<QuantumPotentialOptions, 'numberOfWellsProperty' | 'electricFieldProperty' | 'yOffsetRange' | 'tandem'>;

export default class PoschlTellerPotential extends QuantumPotential {

  public readonly wellWidthProperty: NumberProperty;
  public readonly wellDepthProperty: NumberProperty;
  public readonly spacingProperty: NumberProperty;

  public constructor( providedOptions: PoschlTellerPotentialOptions ) {

    const options = optionize<PoschlTellerPotentialOptions, SelfOptions, QuantumPotentialOptions>()( {

      // SelfOptions
      wellWidthRange: new RangeWithValue( 0.1, 1.5, 1 ),
      wellDepthRange: QBSConstants.WELL_DEPTH_RANGE,
      spacingRange: QBSConstants.SPACING_RANGE,

      // QuantumPotentialOptions
      groundStateIndex: 0,
      energyAxisRange: new Range( -20.5, 0.5 ),
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.poschlTellerStringProperty,
      tandemPrefix: 'poschlTellerPotential' //TODO rename to 'anharmonicOscillatorPotential'?
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

    this.spacingProperty = new NumberProperty( options.spacingRange.defaultValue, {
      units: nanometersUnit,
      range: options.spacingRange,
      tandem: options.tandem.createTandem( 'spacingProperty' ),
      phetioFeatured: true
    } );

    // Changes to Properties instantiated by this class trigger notification.
    Multilink.multilink(
      [ this.wellWidthProperty, this.wellDepthProperty, this.spacingProperty ],
      () => this.propertyChangedEmitter.emit() );
  }

  public override reset(): void {
    super.reset();
    this.wellWidthProperty.reset();
    this.wellDepthProperty.reset();
    this.spacingProperty.reset();
  }

  public override toString(): string {
    return `${this.tandemPrefix}[ ` +
           `numberOfWells=${this.numberOfWellsProperty.value} ` +
           `electricField=${this.electricFieldProperty.value} ` +
           `yOffset=${this.yOffsetProperty.value} ` +
           `wellWidth=${this.wellWidthProperty.value} ` +
           `wellDepth=${this.wellDepthProperty.value} ` +
           `spacing=${this.spacingProperty.value} ` +
           ']';
  }

  /**
   * Gets the potential energy (eV) at a specified x-coordinate (nm).
   */
  public getPotentialEnergyAt( x: number ): number {
    const n = this.numberOfWellsProperty.value;
    const wellWidth = this.wellWidthProperty.value;
    const wellDepth = this.wellDepthProperty.value;
    const spacing = this.spacingProperty.value;
    const xOffset = this.xOffset;

    // Sum contributions from all N wells symmetrically centered around xOffset.
    let potentialEnergy = 0;
    for ( let i = 1; i <= n; i++ ) {
      const xi = xOffset + spacing * ( i - ( n + 1 ) / 2 );
      const coshValue = Math.cosh( ( x - xi ) / wellWidth );
      potentialEnergy += -wellDepth / ( coshValue * coshValue );
    }

    // Adjust for y-offset.
    potentialEnergy += this.yOffsetProperty.value;

    // Apply electric field.
    potentialEnergy += ( this.electricFieldProperty.value * x );

    affirm( potentialEnergy < QBSConstants.EFFECTIVELY_INFINITE_ENERGY );
    return potentialEnergy;
  }

  public override getMinSolverEnergy(): number {
    const n = this.numberOfWellsProperty.value;
    const wellWidth = this.wellWidthProperty.value;
    const spacing = this.spacingProperty.value;
    const xOffset = this.xOffset;

    // Estimate the minimum by sampling the field-free multi-well landscape. This is much tighter than
    // the old fully-overlapped bound and works well for partial overlap in multi-well configurations.
    const firstCenter = xOffset + spacing * ( 1 - ( n + 1 ) / 2 );
    const lastCenter = xOffset + spacing * ( n - ( n + 1 ) / 2 );
    const margin = 4 * wellWidth;
    const xMin = firstCenter - margin;
    const xMax = lastCenter + margin;
    const sampleCount = 600;
    const dx = ( xMax - xMin ) / ( sampleCount - 1 );

    let minimumPotential = Number.POSITIVE_INFINITY;
    for ( let i = 0; i < sampleCount; i++ ) {
      const x = xMin + i * dx;
      minimumPotential = Math.min( minimumPotential, this.getPotentialEnergyAt( x ) );
    }

    return minimumPotential;
  }

  public override getMaxSolverEnergy(): number {
    const electricField = this.electricFieldProperty.value;
    const yOffset = this.yOffsetProperty.value;

    // Without an electric field the potential asymptotes to yOffset on both sides, so no bound
    // states exist above yOffset.
    // With a non-zero electric field the Stark effect creates a finite tunneling barrier on the
    // downhill side of the well: to the left of the leftmost well for E > 0, to the right for E < 0.
    // let's be conservative and find the value of the potential at the left most or right most position of our grid
    const xStar = QBSConstants.ALL_GRAPHS_X_RANGE.min;
    
    // Return the field-free maximum (yOffset) adjusted downward by the electric field at x*.
    return yOffset - Math.abs( electricField * xStar );
  }

  /**
   * Creates the icon for this potential. Always shows a single well regardless of numberOfWellsProperty.
   */
  public override createIcon(): Node {

    // Sampling parameters
    const numberOfPoints = 100;
    const xMin = -12;
    const xMax = 12;
    const dx = ( xMax - xMin ) / numberOfPoints;
    const wellWidth = 3;
    const wellDepth = 15;

    // Create the Shape by sampling the curve.
    const shape = new Shape();
    for ( let x = xMin; x <= xMax; x += dx ) {

      //TODO Duplication here with getPotentialEnergyAt
      const coshValue = Math.cosh( x / wellWidth );
      let y = -wellDepth / ( coshValue * coshValue );

      y *= -1; // invert the y-axis to match scenery's coordinate frame
      if ( x === xMin ) {
        shape.moveTo( x, y );
      }
      else {
        shape.lineTo( x, y );
      }
    }
    return new Path( shape, {
      stroke: QBSColors.potentialEnergyColorProperty,
      lineWidth: QBSConstants.POTENTIAL_ICON_LINE_WIDTH
    } );
  }
}