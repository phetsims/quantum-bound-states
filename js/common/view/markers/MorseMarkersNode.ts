// Copyright 2026, University of Colorado Boulder

/**
 * MorseMarkersNode is the parent for markers (vertical dashed lines) related to a Morse potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import MorsePotential from '../../model/potentials/MorsePotential.js';
import QuantumPotential from '../../model/potentials/QuantumPotential.js';
import MorseWidthMarkerNode from './MorseWidthMarkerNode.js';
import PotentialMarkersNode from './PotentialMarkersNode.js';

export default class MorseMarkersNode extends PotentialMarkersNode {

  public constructor( potential: MorsePotential,
                      selectedPotentialProperty: TReadOnlyProperty<QuantumPotential>,
                      chartTransform: ChartTransform,
                      tandem: Tandem ) {


    const handles: Node[] = [];

    if ( potential.wellWidthProperty.range.getLength() > 0 ) {
      handles.push( new MorseWidthMarkerNode( potential, chartTransform, tandem.createTandem( 'widthMarkerNode' ) ) );
    }

    super( potential, selectedPotentialProperty, {
      children: handles,
      tandem: tandem
    } );
  }
}