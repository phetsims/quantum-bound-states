// Copyright 2026, University of Colorado Boulder

/**
 * HarmonicOscillatorDragHandlesNode is the parent for drag handles related to a Harmonic Oscillator potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import HarmonicOscillatorPotential from '../../model/potentials/HarmonicOscillatorPotential.js';
import QuantumPotential from '../../model/potentials/QuantumPotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import HarmonicOscillatorWidthDragHandleNode from './HarmonicOscillatorWidthDragHandleNode.js';
import PotentialHandlesNode from './PotentialHandlesNode.js';

export default class HarmonicOscillatorDragHandlesNode extends PotentialHandlesNode {

  public constructor( potential: HarmonicOscillatorPotential,
                      selectedPotentialProperty: TReadOnlyProperty<QuantumPotential>,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      tandem: Tandem ) {

    super( potential, selectedPotentialProperty, {
      children: [
        new HarmonicOscillatorWidthDragHandleNode( potential, energyDiagramNode, time, tandem.createTandem( 'widthHandleNode' ) )
      ],
      tandem: tandem
    } );
  }
}