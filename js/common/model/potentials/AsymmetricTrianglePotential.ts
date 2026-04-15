// Copyright 2026, University of Colorado Boulder

/**
 * AsymmetricTrianglePotential is a quantum potential composed of 1 asymmetric triangle well.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import Shape from '../../../../../kite/js/Shape.js';
import affirm from '../../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize, { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import { nanometersUnit } from '../../../../../scenery-phet/js/units/nanometersUnit.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Path from '../../../../../scenery/js/nodes/Path.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import QBSColors from '../../QBSColors.js';
import QBSConstants from '../../QBSConstants.js';
import { electronVoltsUnit } from '../units/electronVoltsUnit.js';
import QuantumPotential, { QuantumPotentialOptions } from './QuantumPotential.js';

type SelfOptions = EmptySelfOptions;

type AsymmetricTrianglePotentialOptions = SelfOptions &
  Pick<QuantumPotentialOptions, 'numberOfWellsProperty' | 'electricFieldProperty' | 'tandem'>;

export default class AsymmetricTrianglePotential extends QuantumPotential {

  public readonly wellWidthProperty: NumberProperty;
  public readonly wellDepthProperty: NumberProperty;

  public constructor( providedOptions: AsymmetricTrianglePotentialOptions ) {

    const options = optionize<AsymmetricTrianglePotentialOptions, SelfOptions, QuantumPotentialOptions>()( {

      // QuantumPotentialOptions
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.asymmetricTriangleStringProperty,
      tandemPrefix: 'asymmetricTrianglePotential'
    }, providedOptions );

    super( options );

    this.wellWidthProperty = new NumberProperty( QBSConstants.WELL_WIDTH_RANGE.defaultValue, {
      units: nanometersUnit,
      range: QBSConstants.WELL_WIDTH_RANGE,
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
    Multilink.multilink( [ this.wellWidthProperty, this.wellDepthProperty ], () => this.propertyChangedEmitter.emit() );
  }

  public override reset(): void {
    super.reset();
    this.wellWidthProperty.reset();
    this.wellDepthProperty.reset();
  }

  /**
   * Gets the potential energy (eV) at a specified x-coordinate (nm).
   */
  public override getPotentialEnergyAt( x: number ): number {
    affirm( this.numberOfWellsProperty.value === 1, 'AsymmetricTrianglePotential does not support multiple wells.' );
    affirm( this.electricFieldProperty.value === 0, 'AsymmetricTrianglePotential does not support electric field.' );

    const wellWidth = this.wellWidthProperty.value;
    const wellDepth = this.wellDepthProperty.value;
    const xOffset = this.xOffset;
    const yOffset = this.yOffsetProperty.value;

    // From BSAsymmetricPotential.java
    let pe = yOffset + wellDepth;
    if ( Math.abs( x - xOffset ) <= wellWidth / 2 ) {
      pe = yOffset + ( wellDepth - ( Math.abs( xOffset + wellWidth / 2 - x ) * wellDepth / wellWidth ) );
    }

    return pe;
  }

  public override getMinPotentialEnergy(): number {
    return this.yOffsetProperty.value;
  }

  public override getMaxPotentialEnergy(): number {
    return this.yOffsetProperty.value + this.wellDepthProperty.value;
  }

  public override createIcon(): Node {

    const wellWidth = 12;
    const wellDepth = 12;
    const edgeLength = 8; // horizontal length of the edges that extend to the left and right of the well

    // Described from left to right
    const shape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( edgeLength, 0 )
      .lineTo( edgeLength, wellDepth )
      .lineTo( edgeLength + wellWidth, 0 )
      .lineTo( edgeLength + wellWidth + edgeLength, 0 );

    return new Path( shape, {
      stroke: QBSColors.potentialEnergyColorProperty,
      lineWidth: QBSConstants.POTENTIAL_ICON_LINE_WIDTH
    } );
  }
}
