// Copyright 2026, University of Colorado Boulder

/**
 * InfiniteStepDragHandlesNode is the parent for drag handles related to an Infinite Step potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import InfiniteStepPotential from '../../model/potentials/InfiniteStepPotential.js';
import QuantumPotential from '../../model/potentials/QuantumPotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import InfiniteStepHeightDragHandleNode from './InfiniteStepHeightDragHandleNode.js';
import InfiniteStepWidthDragHandleNode from './InfiniteStepWidthDragHandleNode.js';
import PotentialDragHandlesNode from './PotentialDragHandlesNode.js';

export default class InfiniteStepDragHandlesNode extends PotentialDragHandlesNode {

  public constructor( potential: InfiniteStepPotential,
                      selectedPotentialProperty: TReadOnlyProperty<QuantumPotential>,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      tandem: Tandem ) {

    super( potential, selectedPotentialProperty, {
      children: [
        new InfiniteStepWidthDragHandleNode( potential, energyDiagramNode, time, tandem.createTandem( 'widthHandleNode' ) ),
        new InfiniteStepHeightDragHandleNode( potential, energyDiagramNode, time, tandem.createTandem( 'stepHeightHandleNode' ) )
      ],
      tandem: tandem
    } );
  }
}