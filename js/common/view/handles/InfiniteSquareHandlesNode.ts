// Copyright 2026, University of Colorado Boulder

/**
 * InfiniteSquareHandlesNode is the parent for handles related to an Infinite Square potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import InfiniteSquarePotential from '../../model/potentials/InfiniteSquarePotential.js';
import QuantumPotential from '../../model/potentials/QuantumPotential.js';
import QBSTime from '../../model/QBSTime.js';
import InfiniteSquareWidthHandleNode from './InfiniteSquareWidthHandleNode.js';
import PotentialHandleNode from './PotentialHandleNode.js';
import PotentialHandlesNode from './PotentialHandlesNode.js';

export default class InfiniteSquareHandlesNode extends PotentialHandlesNode {

  public constructor( potential: InfiniteSquarePotential,
                      selectedPotentialProperty: TReadOnlyProperty<QuantumPotential>,
                      chartTransform: ChartTransform,
                      time: QBSTime,
                      tandem: Tandem ) {

    const handles: PotentialHandleNode<InfiniteSquarePotential>[] = [];

    if ( potential.wellWidthProperty.range.getLength() > 0 ) {
      handles.push( new InfiniteSquareWidthHandleNode( potential, chartTransform, time, tandem.createTandem( 'widthHandleNode' ) )
      );
    }

    super( potential, selectedPotentialProperty, {
      children: handles,
      tandem: tandem
    } );
  }
}