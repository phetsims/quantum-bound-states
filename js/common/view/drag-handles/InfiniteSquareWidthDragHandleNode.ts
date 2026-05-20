// Copyright 2026, University of Colorado Boulder

/**
 * InfiniteSquareWidthDragHandleNode is the drag handle for changing the well width of an Infinite Square potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../../tandem/js/Tandem.js';
import InfiniteSquarePotential from '../../model/potentials/InfiniteSquarePotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import InfiniteSquareWidthDragListener from './InfiniteSquareWidthDragListener.js';
import PotentialDragHandleNode from './PotentialDragHandleNode.js';

export default class InfiniteSquareWidthDragHandleNode extends PotentialDragHandleNode<InfiniteSquarePotential> {

  public constructor( potential: InfiniteSquarePotential,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      tandem: Tandem ) {

    super( potential, energyDiagramNode.chartTransform, potential.wellWidthProperty, {
      orientation: 'horizontal',
      //TODO accessibleName
      //TODO accessibleHelpText
      //TODO accessibleFocusObjectResponse
      tandem: tandem
    } );

    this.addInputListener( new InfiniteSquareWidthDragListener( this, potential, energyDiagramNode, time, tandem ) );
  }

  /**
   * Vertically center the handle on the right wall of the well.
   */
  protected override updatePosition(): void {
    this.centerX = this.chartTransform.modelToViewX( this.potential.xOffsetProperty.value + this.potential.wellWidthProperty.value / 2 );
    this.centerY = this.chartTransform.modelToViewY( this.potential.yOffsetProperty.value + this.potential.energyAxisRange.getLength() / 2 );
  }

  public override describeMoved(): void {
    //TODO this.addAccessibleObjectResponse
  }
}