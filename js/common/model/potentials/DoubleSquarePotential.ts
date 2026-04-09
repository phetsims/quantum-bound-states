// Copyright 2026, University of Colorado Boulder

/**
 * DoubleSquarePotential is a quantum potential composed of 2 finite square wells.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Node from '../../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import QBSConstants from '../../QBSConstants.js';
import FiniteSquareWellsIcon from '../../view/FiniteSquareWellsIcon.js'; // eslint-disable-line phet/no-view-imported-from-model
import Potential from './Potential.js';

export default class DoubleSquarePotential extends Potential {

  //TODO Temporary constants, same as initial state of Java version.
  private readonly numberOfWells = 1;
  private readonly wellWidth = 1; //TODO Java: [0.1,6] nm and named 'width'
  private readonly wellDepth = 10; //TODO Java: [0,20] eV and named 'height'
  private readonly yOffset = 0; //TODO Java [-5,15] eV, bottom of well
  private readonly centerX = 0; //TODO Constant 0 nm in Java
  private readonly separation = 0; //TODO Java [0.05,0.7] nm, distance between walls of adjacent wells
  private readonly electricField = 0; //TODO Java [-1,1] V/nm

  public constructor( tandem: Tandem ) {
    super( {
      visualNameProperty: QuantumBoundStatesFluent.potentialWells.doubleSquareStringProperty,
      tandemPrefix: 'doubleSquarePotential',
      tandem: tandem,
      phetioDocumentation: 'A quantum potential with two finite square wells.'
    } );
  }

  public override getMinPotentialEnergy(): number {
    return this.yOffset;
  }

  public override getMaxPotentialEnergy(): number {
    return this.yOffset + this.wellDepth;
  }

  /**
   * Creates the icon for this potential.
   */
  public override createIcon(): Node {
    return new FiniteSquareWellsIcon( {
      numberOfWells: 2,
      wellWidth: 12,
      wellDepth: 12,
      edgeLength: 4,
      wellSpacing: 6,
      lineWidth: QBSConstants.POTENTIAL_ICON_LINE_WIDTH
    } );
  }
}
