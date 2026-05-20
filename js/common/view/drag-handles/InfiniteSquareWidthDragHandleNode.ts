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

export default class InfiniteSquareWidthDragHandleNode extends PotentialDragHandleNode {

  public constructor( potential: InfiniteSquarePotential,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      tandem: Tandem ) {

    super( potential.wellWidthProperty, {
      orientation: 'horizontal',
      //TODO accessibleName
      //TODO accessibleHelpText
      //TODO accessibleFocusObjectResponse
      tandem: tandem
    } );

    this.addInputListener( new InfiniteSquareWidthDragListener( this, potential, energyDiagramNode, time, tandem ) );

    const chartTransform = energyDiagramNode.chartTransform;

    // Vertically center the handle on the right wall of the well.
    const updatePosition = () => {
      this.centerX = chartTransform.modelToViewX( potential.xOffsetProperty.value + potential.wellWidthProperty.value / 2 );
      this.centerY = chartTransform.modelToViewY( potential.yOffsetProperty.value + potential.energyAxisRange.getLength() / 2 );
    };

    chartTransform.changedEmitter.addListener( () => updatePosition() );
    potential.propertyChangedEmitter.addListener( () => updatePosition() );
    updatePosition();
  }

  public override describeMoved(): void {
    //TODO this.addAccessibleObjectResponse
  }
}