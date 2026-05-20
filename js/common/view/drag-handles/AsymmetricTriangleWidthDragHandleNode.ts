// Copyright 2026, University of Colorado Boulder

/**
 * AsymmetricTriangleWidthDragHandleNode is the drag handle for changing the well width of an Asymmetric Triangle potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import AsymmetricTrianglePotential from '../../model/potentials/AsymmetricTrianglePotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import AsymmetricTriangleWidthDragListener from './AsymmetricTriangleWidthDragListener.js';
import PotentialHandleNode from './PotentialHandleNode.js';

export default class AsymmetricTriangleWidthDragHandleNode extends PotentialHandleNode<AsymmetricTrianglePotential> {

  public constructor( potential: AsymmetricTrianglePotential,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      tandem: Tandem ) {

    super( potential, energyDiagramNode.chartTransform, potential.wellWidthProperty, {
      orientation: 'horizontal',
      accessibleName: QuantumBoundStatesFluent.a11y.handles.asymmetricTriangleWidthHandle.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.handles.asymmetricTriangleWidthHandle.accessibleHelpTextStringProperty,
      accessibleFocusObjectResponse: QuantumBoundStatesFluent.a11y.handles.asymmetricTriangleWidthHandle.accessibleObjectResponse.createProperty( {
        width: potential.wellWidthProperty
      } ),
      tandem: tandem
    } );

    this.addInputListener( new AsymmetricTriangleWidthDragListener( this, potential, energyDiagramNode, time, tandem ) );
  }

  /**
   * Vertically center the handle on the left wall.
   */
  protected override updatePosition(): void {
    this.centerX = this.chartTransform.modelToViewX( this.potential.xOffsetProperty.value - this.potential.wellWidthProperty.value / 2 );
    this.centerY = this.chartTransform.modelToViewY( this.potential.yOffsetProperty.value + this.potential.wellDepthProperty.value / 2 );
  }

  /**
   * Describes the drag handle when it is moved.
   */
  public override describeMoved(): void {
    this.addAccessibleObjectResponse( QuantumBoundStatesFluent.a11y.handles.asymmetricTriangleWidthHandle.accessibleObjectResponse.format( {
      width: this.potential.wellWidthProperty.value
    } ) );
  }
}