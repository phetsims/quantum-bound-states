// Copyright 2026, University of Colorado Boulder

/**
 * InfiniteStepHeightDragHandleNode is the drag handle for changing the step height of an Infinite Step potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../../tandem/js/Tandem.js';
import InfiniteStepPotential from '../../model/potentials/InfiniteStepPotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import InfiniteStepHeightDragListener from './InfiniteStepHeightDragListener.js';
import PotentialDragHandleNode from './PotentialDragHandleNode.js';

export default class InfiniteStepHeightDragHandleNode extends PotentialDragHandleNode<InfiniteStepPotential> {

  public constructor( potential: InfiniteStepPotential,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      tandem: Tandem ) {

    super( potential, energyDiagramNode.chartTransform, potential.stepHeightProperty, {
      orientation: 'vertical',
      //TODO accessibleName
      //TODO accessibleHelpText
      //TODO accessibleFocusObjectResponse
      tandem: tandem
    } );

    this.addInputListener( new InfiniteStepHeightDragListener( this, potential, energyDiagramNode, time, tandem ) );
  }

  /**
   * Horizontally center the handle at the top of the step.
   */
  protected override updatePosition(): void {
    this.centerX = this.chartTransform.modelToViewX( this.potential.xOffsetProperty.value + this.potential.wellWidthProperty.value / 4 );
    this.centerY = this.chartTransform.modelToViewY( this.potential.yOffsetProperty.value + this.potential.stepHeightProperty.value );
  }

  public override describeMoved(): void {
    //TODO this.addAccessibleObjectResponse
  }
}