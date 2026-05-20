// Copyright 2026, University of Colorado Boulder

/**
 * AsymmetricTriangleWidthDragHandleNode is the drag handle for changing the well width of an Asymmetric Triangle potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import AsymmetricTrianglePotential from '../../model/potentials/AsymmetricTrianglePotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import AsymmetricTriangleWidthDragListener from './AsymmetricTriangleWidthDragListener.js';
import PotentialDragHandleNode from './PotentialDragHandleNode.js';

export default class AsymmetricTriangleWidthDragHandleNode extends PotentialDragHandleNode {

  private readonly potential: AsymmetricTrianglePotential;
  private readonly chartTransform: ChartTransform;

  public constructor( potential: AsymmetricTrianglePotential,
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

    this.addInputListener( new AsymmetricTriangleWidthDragListener( this, potential, energyDiagramNode, time, tandem ) );

    this.chartTransform.changedEmitter.addListener( () => this.updatePosition() );
    potential.propertyChangedEmitter.addListener( () => this.updatePosition() );
    this.updatePosition();
  }

  /**
   * Vertically center the handle on the left wall.
   */
  protected override updatePosition(): void {
    this.centerX = this.chartTransform.modelToViewX( this.potential.xOffsetProperty.value - this.potential.wellWidthProperty.value / 2 );
    this.centerY = this.chartTransform.modelToViewY( this.potential.yOffsetProperty.value + this.potential.wellDepthProperty.value / 2 );
  }

  public override describeMoved(): void {
    //TODO this.addAccessibleObjectResponse
  }
}