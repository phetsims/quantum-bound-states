// Copyright 2026, University of Colorado Boulder

/**
 * MorseHandlesNode is the parent for handles related to a Morse potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import MorsePotential from '../../model/potentials/MorsePotential.js';
import QuantumPotential from '../../model/potentials/QuantumPotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import MorseDepthHandleNode from './MorseDepthHandleNode.js';
import MorseWidthHandleNode from './MorseWidthHandleNode.js';
import PotentialHandlesNode from './PotentialHandlesNode.js';

export default class MorseHandlesNode extends PotentialHandlesNode {

  public constructor( potential: MorsePotential,
                      selectedPotentialProperty: TReadOnlyProperty<QuantumPotential>,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      tandem: Tandem ) {

    super( potential, selectedPotentialProperty, {
      children: [
        new MorseWidthHandleNode( potential, energyDiagramNode, time, tandem.createTandem( 'widthHandleNode' ) ),
        new MorseDepthHandleNode( potential, energyDiagramNode, time, tandem.createTandem( 'depthHandleNode' ) )
      ],
      tandem: tandem
    } );
  }
}