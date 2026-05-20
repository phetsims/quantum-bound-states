// Copyright 2026, University of Colorado Boulder

/**
 * InfiniteSquareDragHandlesNode is the parent for drag handles related to an Infinite Square potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import InfiniteSquarePotential from '../../model/potentials/InfiniteSquarePotential.js';
import QuantumPotential from '../../model/potentials/QuantumPotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import InfiniteSquareWidthDragHandleNode from './InfiniteSquareWidthDragHandleNode.js';
import PotentialDragHandlesNode from './PotentialDragHandlesNode.js';

export default class InfiniteSquareDragHandlesNode extends PotentialDragHandlesNode {

  public constructor( potential: InfiniteSquarePotential,
                      selectedPotentialProperty: TReadOnlyProperty<QuantumPotential>,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      tandem: Tandem ) {

    super( potential, selectedPotentialProperty, {
      children: [
        new InfiniteSquareWidthDragHandleNode( potential, energyDiagramNode, time, tandem.createTandem( 'wellWidthDragHandleNode' ) )
      ],
      tandem: tandem
    } );
  }
}