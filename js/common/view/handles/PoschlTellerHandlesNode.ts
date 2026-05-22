// Copyright 2026, University of Colorado Boulder

/**
 * PoschlTellerHandlesNode is the parent for handles related to a Poschl-Teller potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import PoschlTellerPotential from '../../model/potentials/PoschlTellerPotential.js';
import QuantumPotential from '../../model/potentials/QuantumPotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import PoschlTellerDepthHandleNode from './PoschlTellerDepthHandleNode.js';
import PotentialHandlesNode from './PotentialHandlesNode.js';

export default class PoschlTellerHandlesNode extends PotentialHandlesNode {

  public constructor( potential: PoschlTellerPotential,
                      selectedPotentialProperty: TReadOnlyProperty<QuantumPotential>,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      tandem: Tandem ) {

    super( potential, selectedPotentialProperty, {
      children: [
        //TODO Add width handle
        new PoschlTellerDepthHandleNode( potential, energyDiagramNode, time, tandem.createTandem( 'depthHandleNode' ) )
        //TODO Add separationHandleNode if potential.numberOfWellsProperty indicates that it is supported.
      ],
      tandem: tandem
    } );
  }
}