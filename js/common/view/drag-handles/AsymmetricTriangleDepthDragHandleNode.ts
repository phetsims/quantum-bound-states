// Copyright 2026, University of Colorado Boulder

/**
 * AsymmetricTriangleDepthDragHandleNode is the drag handle for changing the well depth of an Asymmetric Triangle potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../../tandem/js/Tandem.js';
import QuantumBoundStatesFluent from '../../../QuantumBoundStatesFluent.js';
import AsymmetricTrianglePotential from '../../model/potentials/AsymmetricTrianglePotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import AsymmetricTriangleDepthDragListener from './AsymmetricTriangleDepthDragListener.js';
import PotentialHandleNode from './PotentialHandleNode.js';

// How far the handle is positioned from the rightmost well of the potential, in nm
const HANDLE_X_OFFSET = 0.25;

export default class AsymmetricTriangleDepthDragHandleNode extends PotentialHandleNode<AsymmetricTrianglePotential> {

  public constructor( potential: AsymmetricTrianglePotential,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      tandem: Tandem ) {

    super( potential, energyDiagramNode.chartTransform, potential.wellDepthProperty, {
      orientation: 'vertical',
      accessibleName: QuantumBoundStatesFluent.a11y.handles.asymmetricTriangleDepthHandle.accessibleNameStringProperty,
      accessibleHelpText: QuantumBoundStatesFluent.a11y.handles.asymmetricTriangleDepthHandle.accessibleHelpTextStringProperty,
      accessibleFocusObjectResponse: QuantumBoundStatesFluent.a11y.handles.asymmetricTriangleDepthHandle.accessibleObjectResponse.createProperty( {
        depth: potential.wellDepthProperty
      } ),
      tandem: tandem
    } );

    this.addInputListener( new AsymmetricTriangleDepthDragListener( this, potential, energyDiagramNode, time, tandem ) );
  }

  /**
   * Position the handle to the right of the well, at the top of the potential.
   */
  protected override updatePosition(): void {
    this.centerX = this.chartTransform.modelToViewX( this.potential.xOffsetProperty.value + this.potential.wellWidthProperty.value / 2 + HANDLE_X_OFFSET );
    this.centerY = this.chartTransform.modelToViewY( this.potential.yOffsetProperty.value + this.potential.wellDepthProperty.value );
  }

  /**
   * Describes the drag handle when it is moved.
   */
  public override describeMoved(): void {
    this.addAccessibleObjectResponse( QuantumBoundStatesFluent.a11y.handles.asymmetricTriangleDepthHandle.accessibleObjectResponse.format( {
      depth: this.potential.wellDepthProperty.value
    } ) );
  }
}