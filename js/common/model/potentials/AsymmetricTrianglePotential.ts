// Copyright 2026, University of Colorado Boulder

/**
 * AsymmetricTrianglePotential is a quantum potential composed of 1 asymmetric triangle well.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import Range from '../../../../../dot/js/Range.js';
import Shape from '../../../../../kite/js/Shape.js';
import { nanometersUnit } from '../../../../../scenery-phet/js/units/nanometersUnit.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Path from '../../../../../scenery/js/nodes/Path.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import QBSColors from '../../QBSColors.js';
import QBSConstants from '../../QBSConstants.js';
import { electronVoltsUnit } from '../units/electronVoltsUnit.js';
import QuantumPotential from './QuantumPotential.js';

export default class AsymmetricTrianglePotential extends QuantumPotential {

  public readonly wellWidthProperty: NumberProperty;
  public readonly wellDepthProperty: NumberProperty;

  public constructor( tandem: Tandem ) {

    super( {
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.asymmetricTriangleStringProperty,
      tandemPrefix: 'asymmetricTrianglePotential',
      tandem: tandem,
      phetioDocumentation: 'A quantum potential with one asymmetric triangle well.'
    } );

    this.wellWidthProperty = new NumberProperty( 1, {
      units: nanometersUnit,
      range: new Range( 0.1, 6 ),
      tandem: tandem.createTandem( 'wellWidthProperty' )
    } );

    this.wellDepthProperty = new NumberProperty( 10, {
      units: electronVoltsUnit,
      range: new Range( 0.1, 20 ),
      tandem: tandem.createTandem( 'wellDepthProperty' )
    } );

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

    //TODO affirm 1 well

    const wellWidth = this.wellWidthProperty.value;
    const wellDepth = this.wellDepthProperty.value;
    const xOffset = this.xOffset;
    const yOffset = this.yOffset;

    // From BSAsymmetricPotential.java
    let pe = yOffset + wellDepth;
    if ( Math.abs( x - xOffset ) <= wellWidth / 2 ) {
      pe = yOffset + ( wellDepth - ( Math.abs( xOffset + wellWidth / 2 - x ) * wellDepth / wellWidth ) );
    }

    return pe;
  }

  public override getMinPotentialEnergy(): number {
    return this.yOffset;
  }

  public override getMaxPotentialEnergy(): number {
    return this.yOffset + this.wellDepthProperty.value;
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
