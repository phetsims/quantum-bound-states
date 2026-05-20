// Copyright 2026, University of Colorado Boulder

/**
 * HarmonicOscillatorDragHandlesNode is the parent for drag handles related to a Harmonic Oscillator potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import HarmonicOscillatorPotential from '../../model/potentials/HarmonicOscillatorPotential.js';
import QuantumPotential from '../../model/potentials/QuantumPotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import HarmonicOscillatorWidthDragHandleNode from './HarmonicOscillatorWidthDragHandleNode.js';

export default class HarmonicOscillatorDragHandlesNode extends Node {

  public constructor( potential: HarmonicOscillatorPotential,
                      selectedPotentialProperty: TReadOnlyProperty<QuantumPotential>,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      tandem: Tandem ) {

    super( {
      isDisposable: false,
      children: [
        new HarmonicOscillatorWidthDragHandleNode( potential, energyDiagramNode, time, tandem.createTandem( 'wellWidthDragHandleNode' ) )
      ],
      visibleProperty: new DerivedProperty( [ selectedPotentialProperty ], selectedPotential => potential === selectedPotential ),
      tandem: tandem
    } );
  }
}