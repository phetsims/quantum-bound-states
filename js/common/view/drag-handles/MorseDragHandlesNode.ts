// Copyright 2026, University of Colorado Boulder

/**
 * MorseDragHandlesNode is the parent for drag handles related to a Morse potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import AsymmetricTrianglePotential from '../../model/potentials/AsymmetricTrianglePotential.js';
import QuantumPotential from '../../model/potentials/QuantumPotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import MorseDepthDragHandleNode from './MorseDepthDragHandleNode.js';
import PotentialDragHandlesNode from './PotentialDragHandlesNode.js';

export default class MorseDragHandlesNode extends PotentialDragHandlesNode {

  public constructor( potential: AsymmetricTrianglePotential,
                      selectedPotentialProperty: TReadOnlyProperty<QuantumPotential>,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      tandem: Tandem ) {

    super( potential, selectedPotentialProperty, {
      children: [
        //TODO Add MorseWidthDragHandleNode
        new MorseDepthDragHandleNode( potential, energyDiagramNode, time, tandem.createTandem( 'depthHandleNode' ) )
      ],
      tandem: tandem
    } );
  }
}