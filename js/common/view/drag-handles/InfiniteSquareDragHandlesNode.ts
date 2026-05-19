// Copyright 2026, University of Colorado Boulder

/**
 * InfiniteSquareDragHandlesNode is the parent for drag handles related to an Infinite Square potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import InfiniteSquarePotential from '../../model/potentials/InfiniteSquarePotential.js';
import QuantumPotential from '../../model/potentials/QuantumPotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import InfiniteSquareWidthDragHandleNode from './InfiniteSquareWidthDragHandleNode.js';

export default class InfiniteSquareDragHandlesNode extends Node {

  public constructor( potential: InfiniteSquarePotential,
                      selectedPotentialProperty: TReadOnlyProperty<QuantumPotential>,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      tandem: Tandem ) {

    const widthDragHandleNode = new InfiniteSquareWidthDragHandleNode( potential, energyDiagramNode, time, tandem.createTandem( 'widthDragHandleNode' ) );

    super( {
      isDisposable: false,
      children: [ widthDragHandleNode ],
      visibleProperty: new DerivedProperty( [ selectedPotentialProperty ], selectedPotential => potential === selectedPotential ),
      tandem: tandem
    } );
  }
}