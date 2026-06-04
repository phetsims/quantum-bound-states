// Copyright 2026, University of Colorado Boulder

/**
 * FiniteSquareMarkersNode is the parent for markers (vertical dashed lines) related to a Finite Square potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import FiniteSquarePotential from '../../model/potentials/FiniteSquarePotential.js';
import QuantumPotential from '../../model/potentials/QuantumPotential.js';
import FiniteSquareSeparationMarkerNode from './FiniteSquareSeparationMarkerNode.js';
import PotentialMarkersNode from './PotentialMarkersNode.js';

export default class FiniteSquareMarkersNode extends PotentialMarkersNode {

  public constructor( potential: FiniteSquarePotential,
                      selectedPotentialProperty: TReadOnlyProperty<QuantumPotential>,
                      chartTransform: ChartTransform,
                      tandem: Tandem ) {


    const handles: Node[] = [];

    if ( potential.separationProperty.range.getLength() > 0 ) {
      handles.push( new FiniteSquareSeparationMarkerNode( potential, chartTransform, tandem.createTandem( 'widthMarkerNode' ) ) );
    }

    super( potential, selectedPotentialProperty, {
      children: handles,
      tandem: tandem
    } );
  }
}