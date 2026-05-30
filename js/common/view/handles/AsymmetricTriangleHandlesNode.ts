// Copyright 2026, University of Colorado Boulder

/**
 * AsymmetricTriangleHandlesNode is the parent for handles related to an Asymmetric Triangle potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import AsymmetricTrianglePotential from '../../model/potentials/AsymmetricTrianglePotential.js';
import QuantumPotential from '../../model/potentials/QuantumPotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import AsymmetricTriangleDepthHandleNode from './AsymmetricTriangleDepthHandleNode.js';
import AsymmetricTriangleWidthHandleNode from './AsymmetricTriangleWidthHandleNode.js';
import PotentialHandleNode from './PotentialHandleNode.js';
import PotentialHandlesNode from './PotentialHandlesNode.js';

export default class AsymmetricTriangleHandlesNode extends PotentialHandlesNode {

  public constructor( potential: AsymmetricTrianglePotential,
                      selectedPotentialProperty: TReadOnlyProperty<QuantumPotential>,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      tandem: Tandem ) {

    const handles: PotentialHandleNode<AsymmetricTrianglePotential>[] = [];

    if ( potential.wellWidthProperty.range.getLength() > 0 ) {
      handles.push( new AsymmetricTriangleWidthHandleNode( potential, energyDiagramNode, time, tandem.createTandem( 'widthHandleNode' ) ) );
    }

    if ( potential.wellDepthProperty.range.getLength() > 0 ) {
      handles.push( new AsymmetricTriangleDepthHandleNode( potential, energyDiagramNode, time, tandem.createTandem( 'depthHandleNode' ) ) );
    }

    super( potential, selectedPotentialProperty, {
      children: handles,
      tandem: tandem
    } );
  }
}