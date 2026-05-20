// Copyright 2026, University of Colorado Boulder

/**
 * FiniteSquareHandlesNode is the parent for handles related to a Finite Square potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import FiniteSquarePotential from '../../model/potentials/FiniteSquarePotential.js';
import QuantumPotential from '../../model/potentials/QuantumPotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import FiniteSquareDepthHandleNode from './FiniteSquareDepthHandleNode.js';
import FiniteSquareWidthHandleNode from './FiniteSquareWidthHandleNode.js';
import PotentialHandlesNode from './PotentialHandlesNode.js';

export default class FiniteSquareHandlesNode extends PotentialHandlesNode {

  public constructor( potential: FiniteSquarePotential,
                      selectedPotentialProperty: TReadOnlyProperty<QuantumPotential>,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      tandem: Tandem ) {

    super( potential, selectedPotentialProperty, {
      children: [
        new FiniteSquareWidthHandleNode( potential, energyDiagramNode, time, tandem.createTandem( 'widthHandleNode' ) ),
        new FiniteSquareDepthHandleNode( potential, energyDiagramNode, time, tandem.createTandem( 'depthHandleNode' ) )
        //TODO Add separationHandleNode if potential.numberOfWellsProperty indicates that it is supported.
      ],
      tandem: tandem
    } );
  }
}