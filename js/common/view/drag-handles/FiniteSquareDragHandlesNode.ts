// Copyright 2026, University of Colorado Boulder

/**
 * FiniteSquareDragHandlesNode is the parent for drag handles related to a Finite Square potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import FiniteSquarePotential from '../../model/potentials/FiniteSquarePotential.js';
import QuantumPotential from '../../model/potentials/QuantumPotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import FiniteSquareDepthDragHandleNode from './FiniteSquareDepthDragHandleNode.js';
import FiniteSquareWidthDragHandleNode from './FiniteSquareWidthDragHandleNode.js';
import PotentialDragHandlesNode from './PotentialDragHandlesNode.js';

export default class FiniteSquareDragHandlesNode extends PotentialDragHandlesNode {

  public constructor( potential: FiniteSquarePotential,
                      selectedPotentialProperty: TReadOnlyProperty<QuantumPotential>,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      tandem: Tandem ) {

    super( potential, selectedPotentialProperty, {
      children: [
        new FiniteSquareWidthDragHandleNode( potential, energyDiagramNode, time, tandem.createTandem( 'widthHandleNode' ) ),
        new FiniteSquareDepthDragHandleNode( potential, energyDiagramNode, time, tandem.createTandem( 'depthHandleNode' ) )
        //TODO Add separationHandleNode if potential.numberOfWellsProperty indicates that it is supported.
      ],
      tandem: tandem
    } );
  }
}