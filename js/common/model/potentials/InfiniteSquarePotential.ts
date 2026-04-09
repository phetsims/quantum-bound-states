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
import QuantumPotential from './QuantumPotential.js';

export default class InfiniteSquarePotential extends QuantumPotential {

  //TODO Temporary constants
  public readonly wellWidth = 2;

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
    const leftX = this.xOffset - this.wellWidth / 2;
    const rightX = this.xOffset + this.wellWidth / 2;
    let pe: number;
    if ( leftX <= x && x <= rightX ) {
      // inside the well
      pe = this.yOffset;
    }
    else {
      // outside the well
      pe = 1E20; //TODO 1E20 instead of Number.POSITIVE_INFINITY
    }
    return pe;
  }

  public override getMinPotentialEnergy(): number {
    return this.yOffset;
  }

  public override getMaxPotentialEnergy(): number {
    return this.getEnergyAxisRange().max;
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
