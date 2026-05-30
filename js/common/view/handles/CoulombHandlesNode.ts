// Copyright 2026, University of Colorado Boulder

/**
 * CoulombHandlesNode is the parent for handles related to a Coulomb potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import CoulombPotential from '../../model/potentials/CoulombPotential.js';
import QuantumPotential from '../../model/potentials/QuantumPotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import CoulombWidthHandleNode from './CoulombWidthHandleNode.js';
import PotentialHandleNode from './PotentialHandleNode.js';
import PotentialHandlesNode from './PotentialHandlesNode.js';

export default class CoulombHandlesNode extends PotentialHandlesNode {

  public constructor( potential: CoulombPotential,
                      selectedPotentialProperty: TReadOnlyProperty<QuantumPotential>,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      tandem: Tandem ) {

    const handles: PotentialHandleNode<CoulombPotential>[] = [];

    if ( potential.wellWidthProperty.range.getLength() > 0 ) {
      handles.push( new CoulombWidthHandleNode( potential, energyDiagramNode, time, tandem.createTandem( 'widthHandleNode' ) ) );
    }

    super( potential, selectedPotentialProperty, {
      children: handles,
      tandem: tandem
    } );
  }
}