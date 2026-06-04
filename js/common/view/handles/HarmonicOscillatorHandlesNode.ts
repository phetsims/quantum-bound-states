// Copyright 2026, University of Colorado Boulder

/**
 * HarmonicOscillatorHandlesNode is the parent for handles related to a Harmonic Oscillator potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import HarmonicOscillatorPotential from '../../model/potentials/HarmonicOscillatorPotential.js';
import QuantumPotential from '../../model/potentials/QuantumPotential.js';
import QBSTime from '../../model/QBSTime.js';
import HarmonicOscillatorWidthHandleNode from './HarmonicOscillatorWidthHandleNode.js';
import PotentialHandleNode from './PotentialHandleNode.js';
import PotentialHandlesNode from './PotentialHandlesNode.js';

export default class HarmonicOscillatorHandlesNode extends PotentialHandlesNode {

  public constructor( potential: HarmonicOscillatorPotential,
                      selectedPotentialProperty: TReadOnlyProperty<QuantumPotential>,
                      chartTransform: ChartTransform,
                      valuesVisibleProperty: TReadOnlyProperty<boolean>,
                      time: QBSTime,
                      tandem: Tandem ) {

    const handles: PotentialHandleNode<HarmonicOscillatorPotential>[] = [];

    if ( potential.wellWidthProperty.range.getLength() > 0 ) {
      handles.push( new HarmonicOscillatorWidthHandleNode( potential, chartTransform, valuesVisibleProperty, time,
        tandem.createTandem( 'widthHandleNode' ) ) );
    }

    super( potential, selectedPotentialProperty, {
      children: handles,
      tandem: tandem
    } );
  }
}