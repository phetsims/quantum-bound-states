// Copyright 2026, University of Colorado Boulder

/**
 * InfiniteStepDragHandlesNode is the parent for drag handles related to an Infinite Step potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import InfiniteStepPotential from '../../model/potentials/InfiniteStepPotential.js';
import QuantumPotential from '../../model/potentials/QuantumPotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import InfiniteStepHeightDragHandleNode from './InfiniteStepHeightDragHandleNode.js';
import InfiniteStepWidthDragHandleNode from './InfiniteStepWidthDragHandleNode.js';

export default class InfiniteStepDragHandlesNode extends Node {

  public constructor( potential: InfiniteStepPotential,
                      selectedPotentialProperty: TReadOnlyProperty<QuantumPotential>,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      tandem: Tandem ) {

    super( {
      isDisposable: false,
      children: [
        new InfiniteStepWidthDragHandleNode( potential, energyDiagramNode, time, tandem.createTandem( 'wellWidthDragHandleNode' ) ),
        new InfiniteStepHeightDragHandleNode( potential, energyDiagramNode, time, tandem.createTandem( 'stepHeightDragHandleNode' ) )
      ],
      visibleProperty: new DerivedProperty( [ selectedPotentialProperty ], selectedPotential => potential === selectedPotential ),
      tandem: tandem
    } );
  }
}