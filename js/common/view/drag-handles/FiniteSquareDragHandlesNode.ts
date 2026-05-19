// Copyright 2026, University of Colorado Boulder

/**
 * FiniteSquareDragHandlesNode is the parent for drag handles related to a Finite Square potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import FiniteSquarePotential from '../../model/potentials/FiniteSquarePotential.js';
import QuantumPotential from '../../model/potentials/QuantumPotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import FiniteSquareDepthDragHandleNode from './FiniteSquareDepthDragHandleNode.js';
import FiniteSquareWidthDragHandleNode from './FiniteSquareWidthDragHandleNode.js';

export default class FiniteSquareDragHandlesNode extends Node {

  public constructor( potential: FiniteSquarePotential,
                      selectedPotentialProperty: TReadOnlyProperty<QuantumPotential>,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      tandem: Tandem ) {

    super( {
      isDisposable: false,
      children: [
        new FiniteSquareWidthDragHandleNode( potential, energyDiagramNode, time, tandem.createTandem( 'widthDragHandleNode' ) ),
        new FiniteSquareDepthDragHandleNode( potential, energyDiagramNode, time, tandem.createTandem( 'depthDragHandleNode' ) )
      ],
      visibleProperty: new DerivedProperty( [ selectedPotentialProperty ], selectedPotential => potential === selectedPotential ),
      tandem: tandem
    } );
  }
}