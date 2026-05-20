// Copyright 2026, University of Colorado Boulder

/**
 * InfiniteStepHandlesNode is the parent for handles related to an Infinite Step potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import InfiniteStepPotential from '../../model/potentials/InfiniteStepPotential.js';
import QuantumPotential from '../../model/potentials/QuantumPotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import InfiniteStepHeightHandleNode from './InfiniteStepHeightHandleNode.js';
import InfiniteStepWidthHandleNode from './InfiniteStepWidthHandleNode.js';
import PotentialHandlesNode from './PotentialHandlesNode.js';

export default class InfiniteStepHandlesNode extends PotentialHandlesNode {

  public constructor( potential: InfiniteStepPotential,
                      selectedPotentialProperty: TReadOnlyProperty<QuantumPotential>,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      tandem: Tandem ) {

    super( potential, selectedPotentialProperty, {
      children: [
        new InfiniteStepWidthHandleNode( potential, energyDiagramNode, time, tandem.createTandem( 'widthHandleNode' ) ),
        new InfiniteStepHeightHandleNode( potential, energyDiagramNode, time, tandem.createTandem( 'stepHeightHandleNode' ) )
      ],
      tandem: tandem
    } );
  }
}