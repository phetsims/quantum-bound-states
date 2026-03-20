// Copyright 2026, University of Colorado Boulder

/**
 * CoulombPotential is a quantum potential composed of 1 Coulomb well.
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
import Potential from './Potential.js';

export default class CoulombPotential extends Potential {

  public constructor( tandem: Tandem ) {
    super( {
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.coulombStringProperty,
      tandemPrefix: 'coulombPotential',
      tandem: tandem,
      phetioDocumentation: 'A quantum potential with one Coulomb well.'
    } );
  }

  public override createIcon(): Node {

    // Shape ported from BSWellComboBox.java, values determined empirically.
    const shape = new Shape()
      .moveTo( 0, 4 )
      .quadraticCurveTo( 8, 5, 7, 16 )
      .moveTo( 10, 16 )
      .quadraticCurveTo( 11, 5, 17, 4 );

    return new Path( shape, {
      stroke: QBSColors.potentialEnergyColorProperty,
      lineWidth: QBSConstants.POTENTIAL_ICON_LINE_WIDTH
    } );
  }
}
