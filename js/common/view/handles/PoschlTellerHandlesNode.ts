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
import PoschlTellerSpacingHandleNode from './PoschlTellerSpacingHandleNode.js';
import PoschlTellerWidthHandleNode from './PoschlTellerWidthHandleNode.js';
import PotentialHandleNode from './PotentialHandleNode.js';
import PotentialHandlesNode from './PotentialHandlesNode.js';

export default class PoschlTellerHandlesNode extends PotentialHandlesNode {

  public constructor( potential: PoschlTellerPotential,
                      selectedPotentialProperty: TReadOnlyProperty<QuantumPotential>,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      tandem: Tandem ) {

    const handles: PotentialHandleNode<PoschlTellerPotential>[] = [];

    if ( potential.wellWidthProperty.range.getLength() > 0 ) {
      handles.push( new PoschlTellerWidthHandleNode( potential, energyDiagramNode, time, tandem.createTandem( 'widthHandleNode' ) ) );
    }

    if ( potential.wellDepthProperty.range.getLength() > 0 ) {
      handles.push( new PoschlTellerDepthHandleNode( potential, energyDiagramNode, time, tandem.createTandem( 'depthHandleNode' ) ) );
    }

    if ( potential.spacingProperty.range.getLength() > 0 ) {
      handles.push( new PoschlTellerSpacingHandleNode( potential, energyDiagramNode, time, tandem.createTandem( 'spacingHandleNode' ) ) );
    }

    super( potential, selectedPotentialProperty, {
      children: handles,
      tandem: tandem
    } );
  }
}