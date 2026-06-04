// Copyright 2026, University of Colorado Boulder

/**
 * PoschlTellerMarkersNode is the parent for markers (vertical dashed lines) related to a Poschl-Teller potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import PoschlTellerPotential from '../../model/potentials/PoschlTellerPotential.js';
import QuantumPotential from '../../model/potentials/QuantumPotential.js';
import PoschlTellerWidthMarkerNode from './PoschlTellerWidthMarkerNode.js';
import PotentialMarkersNode from './PotentialMarkersNode.js';

export default class PoschlTellerMarkersNode extends PotentialMarkersNode {

  public constructor( potential: PoschlTellerPotential,
                      selectedPotentialProperty: TReadOnlyProperty<QuantumPotential>,
                      chartTransform: ChartTransform,
                      tandem: Tandem ) {


    const handles: Node[] = [];

    if ( potential.wellWidthProperty.range.getLength() > 0 ) {
      handles.push( new PoschlTellerWidthMarkerNode( potential, chartTransform, tandem.createTandem( 'widthMarkerNode' ) ) );
    }

    if ( potential.spacingProperty.range.getLength() > 0 ) {
      // handles.push( new PoschlTellerSpacingMarkerNode( potential, chartTransform, tandem.createTandem( 'spacingMarkerNode' ) ) );
    }

    super( potential, selectedPotentialProperty, {
      children: handles,
      tandem: tandem
    } );
  }
}