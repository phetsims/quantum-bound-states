// Copyright 2026, University of Colorado Boulder

/**
 * PotentialDragHandlesLayer create a layer that contains drag handles for all of the supported quantum potentials.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import FiniteSquarePotential from '../../model/potentials/FiniteSquarePotential.js';
import InfiniteSquarePotential from '../../model/potentials/InfiniteSquarePotential.js';
import QuantumPotential from '../../model/potentials/QuantumPotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import FiniteSquareDragHandlesNode from './FiniteSquareDragHandlesNode.js';
import InfiniteSquareDragHandlesNode from './InfiniteSquareDragHandlesNode.js';

export default class PotentialDragHandlesLayer extends Node {

  public constructor( potentials: readonly QuantumPotential[],
                      selectedPotentialProperty: TReadOnlyProperty<QuantumPotential>,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      tandem: Tandem ) {

    const children: Node[] = [];

    potentials.forEach( potential => {
      if ( potential instanceof InfiniteSquarePotential ) {
        children.push( new InfiniteSquareDragHandlesNode( potential, selectedPotentialProperty, energyDiagramNode,
          time, tandem.createTandem( 'infiniteSquareDragHandlesNode' ) ) );
      }
      else if ( potential instanceof FiniteSquarePotential ) {
        children.push( new FiniteSquareDragHandlesNode( potential, selectedPotentialProperty, energyDiagramNode,
          time, tandem.createTandem( 'finiteSquareDragHandlesNode' ) ) );
      }
    } );

    super( {
      children: children,
      tandem: tandem,
      phetioVisiblePropertyInstrumented: false,
      visiblePropertyOptions: { phetioFeatured: true }
    } );
  }
}