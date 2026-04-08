// Copyright 2026, University of Colorado Boulder

/**
 * InfiniteStepPotential is a quantum potential composed of 1 infinite step well.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Node from '../../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import InfiniteSquareWellIcon from '../../view/InfiniteSquareWellIcon.js'; // eslint-disable-line phet/no-view-imported-from-model
import Potential from './Potential.js';

export default class InfiniteStepPotential extends Potential {

  // Total width of the well L in nm, centred at x = 0 (spans [-wellWidth/2, wellWidth/2]).
  private readonly wellWidth = 2;

  // Height of the potential step V₀ in eV (applies to the right half, x > 0).
  private readonly stepHeight = 3;

  private readonly centerX = 0;
  private readonly yOffset = 0;

  public constructor( tandem: Tandem ) {
    super( {
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.infiniteStepStringProperty,
      tandemPrefix: 'infiniteStepPotential',
      tandem: tandem,
      phetioDocumentation: 'A quantum potential with one infinite step well.'
    } );
  }

  public override getPotentialEnergyAt( x: number ): number {
    const halfWidth = this.wellWidth / 2;
    if ( x <= -halfWidth || x >= halfWidth ) {
      return 1E20; //TODO 1E20 instead of Number.POSITIVE_INFINITY
    }
    else if ( x >= 0 ) {
      return this.stepHeight;
    }
    else {
      return 0;
    }
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
