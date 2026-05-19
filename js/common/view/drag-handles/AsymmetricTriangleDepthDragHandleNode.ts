// Copyright 2026, University of Colorado Boulder

/**
 * AsymmetricTriangleDepthDragHandleNode is the drag handle for changing the well depth of an Asymmetric Triangle potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../../axon/js/Multilink.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import AsymmetricTrianglePotential from '../../model/potentials/AsymmetricTrianglePotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import AsymmetricTriangleDepthDragListener from './AsymmetricTriangleDepthDragListener.js';
import PotentialDragHandleNode from './PotentialDragHandleNode.js';

// How far the handle is positioned from the rightmost well of the potential, in nm
const HANDLE_X_OFFSET = 0.25;

export default class AsymmetricTriangleDepthDragHandleNode extends PotentialDragHandleNode {

  public constructor( potential: AsymmetricTrianglePotential,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      tandem: Tandem ) {

    super( potential.wellDepthProperty, {
      orientation: 'vertical',
      //TODO accessibleName
      //TODO accessibleHelpText
      //TODO accessibleFocusObjectResponse
      tandem: tandem
    } );

    this.addInputListener( new AsymmetricTriangleDepthDragListener( this, potential, energyDiagramNode, time, tandem ) );

    // Position the handle just to the right of the rightmost well.
    const chartTransform = energyDiagramNode.chartTransform;
    Multilink.multilink(
      [ potential.wellWidthProperty, potential.wellDepthProperty, potential.xOffsetProperty, potential.yOffsetProperty ],
      ( wellWidth, wellDepth, xOffset, yOffset ) => {
        this.centerX = chartTransform.modelToViewX( xOffset + wellWidth / 2 + HANDLE_X_OFFSET );
        this.centerY = chartTransform.modelToViewY( yOffset + wellDepth );
      } );
  }

  public override describeMoved(): void {
    //TODO this.addAccessibleObjectResponse
  }
}