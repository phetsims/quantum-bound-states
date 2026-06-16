// Copyright 2026, University of Colorado Boulder

/**
 * AsymmetricTriangleMarkersNode is the parent for markers (vertical dashed lines) related to an
 * Asymmetric Triangle potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import AsymmetricTrianglePotential from '../../model/potentials/AsymmetricTrianglePotential.js';
import QuantumPotential from '../../model/potentials/QuantumPotential.js';
import AsymmetricTriangleWidthMarkerNode from './AsymmetricTriangleWidthMarkerNode.js';
import PotentialMarkersNode from './PotentialMarkersNode.js';

export default class AsymmetricTriangleMarkersNode extends PotentialMarkersNode {

  public constructor( potential: AsymmetricTrianglePotential,
                      selectedPotentialProperty: TReadOnlyProperty<QuantumPotential>,
                      chartTransform: ChartTransform,
                      tandem: Tandem ) {


    const handles: Node[] = [];

    if ( potential.wellWidthProperty.range.getLength() > 0 ) {
      handles.push( new AsymmetricTriangleWidthMarkerNode( potential, chartTransform, tandem.createTandem( 'widthMarkerNode' ) ) );
    }

    super( potential, selectedPotentialProperty, {
      children: handles,
      tandem: tandem
    } );
  }
}