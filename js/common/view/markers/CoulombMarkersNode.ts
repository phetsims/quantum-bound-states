// Copyright 2026, University of Colorado Boulder

/**
 * CoulombMarkersNode is the parent for markers (vertical dashed lines) related to a Coulomb potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import CoulombPotential from '../../model/potentials/CoulombPotential.js';
import QuantumPotential from '../../model/potentials/QuantumPotential.js';
import CoulombWidthMarkerNode from './CoulombWidthMarkerNode.js';
import PotentialMarkersNode from './PotentialMarkersNode.js';

export default class CoulombMarkersNode extends PotentialMarkersNode {

  public constructor( potential: CoulombPotential,
                      selectedPotentialProperty: TReadOnlyProperty<QuantumPotential>,
                      chartTransform: ChartTransform,
                      tandem: Tandem ) {


    const handles: Node[] = [];

    if ( potential.wellWidthProperty.range.getLength() > 0 ) {
      handles.push( new CoulombWidthMarkerNode( potential, chartTransform, tandem.createTandem( 'widthMarkerNode' ) ) );
    }

    super( potential, selectedPotentialProperty, {
      children: handles,
      tandem: tandem
    } );
  }
}