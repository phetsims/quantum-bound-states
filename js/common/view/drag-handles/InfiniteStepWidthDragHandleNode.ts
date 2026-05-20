// Copyright 2026, University of Colorado Boulder

/**
 * InfiniteStepWidthDragHandleNode is the drag handle for changing the well width of an Infinite Step potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import InfiniteStepPotential from '../../model/potentials/InfiniteStepPotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import InfiniteStepWidthDragListener from './InfiniteStepWidthDragListener.js';
import PotentialDragHandleNode from './PotentialDragHandleNode.js';

export default class InfiniteStepWidthDragHandleNode extends PotentialDragHandleNode {

  private readonly potential: InfiniteStepPotential;
  private readonly chartTransform: ChartTransform;

  public constructor( potential: InfiniteStepPotential,
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

    this.potential = potential;
    this.chartTransform = energyDiagramNode.chartTransform;

    this.addInputListener( new InfiniteStepWidthDragListener( this, potential, energyDiagramNode, time, tandem ) );

    this.chartTransform.changedEmitter.addListener( () => this.updatePosition() );
    potential.propertyChangedEmitter.addListener( () => this.updatePosition() );
    this.updatePosition();
  }

  /**
   * Vertically center the handle on the right wall of the well, halfway down to the step.
   */
  protected override updatePosition(): void {
    this.centerX = this.chartTransform.modelToViewX( this.potential.xOffsetProperty.value + this.potential.wellWidthProperty.value / 2 );
    this.centerY = this.chartTransform.modelToViewY( this.potential.yOffsetProperty.value +
                                                     ( this.potential.energyAxisRange.getLength() / 2 ) +
                                                     ( this.potential.stepHeightProperty.value / 2 ) );
  }

  public override describeMoved(): void {
    //TODO this.addAccessibleObjectResponse
  }
}