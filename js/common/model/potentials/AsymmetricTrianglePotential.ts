// Copyright 2026, University of Colorado Boulder

/**
 * AsymmetricTrianglePotential is a quantum potential composed of 1 asymmetric triangle well.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Shape from '../../../../../kite/js/Shape.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Path from '../../../../../scenery/js/nodes/Path.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import QBSColors from '../../QBSColors.js';
import QBSConstants from '../../QBSConstants.js';
import QuantumPotential from './QuantumPotential.js';

export default class AsymmetricTrianglePotential extends QuantumPotential {

  //TODO Temporary constants, same as initial state of Java version.
  private readonly wellWidth = 1; //TODO Java: [0.1,6] nm and named 'width'
  private readonly wellDepth = 10; //TODO Java: [0,20] eV and named 'height'

  public constructor( tandem: Tandem ) {
    super( {
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.asymmetricTriangleStringProperty,
      tandemPrefix: 'asymmetricTrianglePotential',
      tandem: tandem,
      phetioDocumentation: 'A quantum potential with one asymmetric triangle well.'
    } );
  }

  /**
   * Gets the potential energy (eV) at a specified x-coordinate (nm).
   */
  public override getPotentialEnergyAt( x: number ): number {

    //TODO affirm 1 well

    const wellWidth = this.wellWidth;
    const wellDepth = this.wellDepth;
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
    return this.yOffset + this.wellDepth;
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
