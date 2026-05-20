// Copyright 2026, University of Colorado Boulder

/**
 * PotentialHandlesLayer create a layer that contains drag handles for all of the supported quantum potentials.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import AsymmetricTrianglePotential from '../../model/potentials/AsymmetricTrianglePotential.js';
import FiniteSquarePotential from '../../model/potentials/FiniteSquarePotential.js';
import HarmonicOscillatorPotential from '../../model/potentials/HarmonicOscillatorPotential.js';
import InfiniteSquarePotential from '../../model/potentials/InfiniteSquarePotential.js';
import InfiniteStepPotential from '../../model/potentials/InfiniteStepPotential.js';
import MorsePotential from '../../model/potentials/MorsePotential.js';
import QuantumPotential from '../../model/potentials/QuantumPotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import AsymmetricTriangleHandlesNode from './AsymmetricTriangleHandlesNode.js';
import FiniteSquareHandlesNode from './FiniteSquareHandlesNode.js';
import HarmonicOscillatorDragHandlesNode from './HarmonicOscillatorDragHandlesNode.js';
import InfiniteSquareHandlesNode from './InfiniteSquareHandlesNode.js';
import InfiniteStepHandlesNode from './InfiniteStepHandlesNode.js';
import MorseHandlesNode from './MorseHandlesNode.js';

export default class PotentialHandlesLayer extends Node {

  public constructor( potentials: readonly QuantumPotential[],
                      selectedPotentialProperty: TReadOnlyProperty<QuantumPotential>,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      tandem: Tandem ) {

    const children: Node[] = [];

    potentials.forEach( potential => {

      const dragHandlesNodeTandem = tandem.createTandem( `${potential.tandemPrefix}HandlesNode` );

      if ( potential instanceof InfiniteSquarePotential ) {
        children.push( new InfiniteSquareHandlesNode( potential, selectedPotentialProperty, energyDiagramNode,
          time, dragHandlesNodeTandem ) );
      }
      else if ( potential instanceof FiniteSquarePotential ) {
        children.push( new FiniteSquareHandlesNode( potential, selectedPotentialProperty, energyDiagramNode,
          time, dragHandlesNodeTandem ) );
      }
      else if ( potential instanceof InfiniteStepPotential ) {
        children.push( new InfiniteStepHandlesNode( potential, selectedPotentialProperty, energyDiagramNode,
          time, dragHandlesNodeTandem ) );
      }
      else if ( potential instanceof AsymmetricTrianglePotential ) {
        children.push( new AsymmetricTriangleHandlesNode( potential, selectedPotentialProperty, energyDiagramNode,
          time, dragHandlesNodeTandem ) );
      }
      else if ( potential instanceof HarmonicOscillatorPotential ) {
        children.push( new HarmonicOscillatorDragHandlesNode( potential, selectedPotentialProperty, energyDiagramNode,
          time, dragHandlesNodeTandem ) );
      }
      //TODO Add PoschTellerDragHandlesNode
      else if ( potential instanceof MorsePotential ) {
        children.push( new MorseHandlesNode( potential, selectedPotentialProperty, energyDiagramNode,
          time, dragHandlesNodeTandem ) );
      }
      // NOTE: CoulombPotential has no drag handles.
    } );

    super( {
      children: children,
      tandem: tandem,
      phetioVisiblePropertyInstrumented: true,
      visiblePropertyOptions: { phetioFeatured: true }
    } );
  }
}