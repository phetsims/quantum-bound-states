// Copyright 2026, University of Colorado Boulder

/**
 * AsymmetricTriangleWidthDragHandleNode is the drag handle for changing the well width of an Asymmetric Triangle potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../../tandem/js/Tandem.js';
import AsymmetricTrianglePotential from '../../model/potentials/AsymmetricTrianglePotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import AsymmetricTriangleWidthDragListener from './AsymmetricTriangleWidthDragListener.js';
import PotentialDragHandleNode from './PotentialDragHandleNode.js';

export default class AsymmetricTriangleWidthDragHandleNode extends PotentialDragHandleNode {

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

    this.addInputListener( new AsymmetricTriangleWidthDragListener( this, potential, energyDiagramNode, time, tandem ) );

    const chartTransform = energyDiagramNode.chartTransform;

    // Vertically center the handle on the left wall.
    const updatePosition = () => {
      this.centerX = chartTransform.modelToViewX( potential.xOffsetProperty.value - potential.wellWidthProperty.value / 2 );
      this.centerY = chartTransform.modelToViewY( potential.yOffsetProperty.value + potential.wellDepthProperty.value / 2 );
    };

    chartTransform.changedEmitter.addListener( () => updatePosition() );
    potential.propertyChangedEmitter.addListener( () => updatePosition() );
    updatePosition();
  }

  public override describeMoved(): void {
    //TODO this.addAccessibleObjectResponse
  }
}