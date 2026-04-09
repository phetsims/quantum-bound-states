// Copyright 2026, University of Colorado Boulder

/**
 * InfiniteStepPotential is a quantum potential composed of 1 infinite step well.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Node from '../../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import QBSConstants from '../../QBSConstants.js';
import InfiniteSquareWellIcon from '../../view/InfiniteSquareWellIcon.js'; // eslint-disable-line phet/no-view-imported-from-model
import QuantumPotential from './QuantumPotential.js';

export default class InfiniteStepPotential extends QuantumPotential {

  // Total width of the well L in nm, centred at x = 0 (spans [-wellWidth/2, wellWidth/2]).
  public readonly wellWidth = 2;

  // Height of the potential step V₀ in eV (applies to the right half, x > 0).
  public readonly stepHeight = 3;

  public constructor( tandem: Tandem ) {
    super( {
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.infiniteStepStringProperty,
      tandemPrefix: 'infiniteStepPotential',
      tandem: tandem,
      phetioDocumentation: 'A quantum potential with one infinite step well.'
    } );
  }

  public override getPotentialEnergyAt( x: number ): number {
    //TODO affirm 1 well
    const leftX = this.xOffset - this.wellWidth / 2;
    const rightX = this.xOffset + this.wellWidth / 2;
    let pe: number;
    if ( leftX <= x && x <= rightX ) {
      // inside the well
      if ( x <= leftX + this.wellWidth / 2 ) {
        // to the left of the step
        pe = this.yOffset;
      }
      else {
        // at the step
        pe = this.yOffset + this.stepHeight;
      }
    }
    else {
      // outside the well
      pe = QBSConstants.EFFECTIVELY_INFINITE_ENERGY;
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
      wellDepth: 12,
      hasStep: true
    } );
  }
}
