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

  public constructor( tandem: Tandem ) {
    super( {
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.infiniteStepStringProperty,
      tandemPrefix: 'infiniteStepPotential',
      tandem: tandem,
      phetioDocumentation: 'A quantum potential with one infinite step well.'
    } );
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
