// Copyright 2026, University of Colorado Boulder

/**
 * PotentialHandlesLayer creates a layer that contains handles for configuring the parameters of all supported
 * quantum potentials.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import AsymmetricTrianglePotential from '../../model/potentials/AsymmetricTrianglePotential.js';
import CoulombPotential from '../../model/potentials/CoulombPotential.js';
import FiniteSquarePotential from '../../model/potentials/FiniteSquarePotential.js';
import HarmonicOscillatorPotential from '../../model/potentials/HarmonicOscillatorPotential.js';
import InfiniteSquarePotential from '../../model/potentials/InfiniteSquarePotential.js';
import InfiniteStepPotential from '../../model/potentials/InfiniteStepPotential.js';
import MorsePotential from '../../model/potentials/MorsePotential.js';
import PoschlTellerPotential from '../../model/potentials/PoschlTellerPotential.js';
import QuantumPotential from '../../model/potentials/QuantumPotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import AsymmetricTriangleHandlesNode from './AsymmetricTriangleHandlesNode.js';
import CoulombHandlesNode from './CoulombHandlesNode.js';
import FiniteSquareHandlesNode from './FiniteSquareHandlesNode.js';
import HarmonicOscillatorHandlesNode from './HarmonicOscillatorHandlesNode.js';
import InfiniteSquareHandlesNode from './InfiniteSquareHandlesNode.js';
import InfiniteStepHandlesNode from './InfiniteStepHandlesNode.js';
import MorseHandlesNode from './MorseHandlesNode.js';
import PoschlTellerHandlesNode from './PoschlTellerHandlesNode.js';

export default class PotentialHandlesLayer extends Node {

  public constructor( potentials: readonly QuantumPotential[],
                      selectedPotentialProperty: TReadOnlyProperty<QuantumPotential>,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      tandem: Tandem ) {

    const children: Node[] = [];

    potentials.forEach( potential => {

      const handlesNodeTandem = tandem.createTandem( `${potential.tandemPrefix}HandlesNode` );

      if ( potential instanceof InfiniteSquarePotential ) {
        children.push( new InfiniteSquareHandlesNode( potential, selectedPotentialProperty, energyDiagramNode,
          time, handlesNodeTandem ) );
      }
      else if ( potential instanceof FiniteSquarePotential ) {
        children.push( new FiniteSquareHandlesNode( potential, selectedPotentialProperty, energyDiagramNode,
          time, handlesNodeTandem ) );
      }
      else if ( potential instanceof InfiniteStepPotential ) {
        children.push( new InfiniteStepHandlesNode( potential, selectedPotentialProperty, energyDiagramNode,
          time, handlesNodeTandem ) );
      }
      else if ( potential instanceof AsymmetricTrianglePotential ) {
        children.push( new AsymmetricTriangleHandlesNode( potential, selectedPotentialProperty, energyDiagramNode,
          time, handlesNodeTandem ) );
      }
      else if ( potential instanceof HarmonicOscillatorPotential ) {
        children.push( new HarmonicOscillatorHandlesNode( potential, selectedPotentialProperty, energyDiagramNode,
          time, handlesNodeTandem ) );
      }
      else if ( potential instanceof PoschlTellerPotential ) {
        children.push( new PoschlTellerHandlesNode( potential, selectedPotentialProperty, energyDiagramNode,
          time, handlesNodeTandem ) );
      }
      else if ( potential instanceof MorsePotential ) {
        children.push( new MorseHandlesNode( potential, selectedPotentialProperty, energyDiagramNode,
          time, handlesNodeTandem ) );
      }
      else if ( potential instanceof CoulombPotential ) {
        children.push( new CoulombHandlesNode( potential, selectedPotentialProperty, energyDiagramNode,
          time, handlesNodeTandem ) );
      }
    } );

    super( {
      children: children,
      tandem: tandem,
      phetioVisiblePropertyInstrumented: true,
      visiblePropertyOptions: { phetioFeatured: true }
    } );
  }
}