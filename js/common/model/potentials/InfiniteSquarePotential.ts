// Copyright 2026, University of Colorado Boulder

/**
 * InfiniteSquarePotential is a quantum potential composed of 1 infinite square well.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Node from '../../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import InfiniteSquareWellIcon from '../../view/InfiniteSquareWellIcon.js'; // eslint-disable-line phet/no-view-imported-from-model
import Potential from './Potential.js';

export default class InfiniteSquarePotential extends Potential {

  //TODO Temporary constants
  private readonly wellWidth = 2;
  private readonly centerX = 0; //TODO Constant 0 nm in Java
  private readonly yOffset = 0;

  public constructor( tandem: Tandem ) {
    super( {
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.infiniteSquareStringProperty,
      tandemPrefix: 'infiniteSquarePotential',
      tandem: tandem,
      phetioDocumentation: 'A quantum potential with one infinite square well.'
    } );
  }

  /**
   * Gets the potential energy (y-value) at a specified x-coordinate.
   */
  public override getPotentialEnergyAt( x: number ): number {
    //TODO affirm 1 well
    const leftX = this.centerX - this.wellWidth / 2;
    const rightX = this.centerX + this.wellWidth / 2;
    return ( leftX <= x && x <= rightX ) ? this.yOffset : 1E20;
  }

  /**
   * Creates the icon for this potential.
   */
  public override createIcon(): Node {
    return new InfiniteSquareWellIcon( {
      wellWidth: 12,
      wellDepth: 12
    } );
  }
}
