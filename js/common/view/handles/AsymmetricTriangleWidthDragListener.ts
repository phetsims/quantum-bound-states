// Copyright 2026, University of Colorado Boulder

/**
 * AsymmetricTriangleWidthDragListener is the drag listener for changing the well width of an Asymmetric Triangle potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import AsymmetricTrianglePotential from '../../model/potentials/AsymmetricTrianglePotential.js';
import QBSTime from '../../model/QBSTime.js';
import QBSConstants from '../../QBSConstants.js';
import AsymmetricTriangleWidthHandleNode from './AsymmetricTriangleWidthHandleNode.js';
import PotentialDragListener from './PotentialDragListener.js';

export default class AsymmetricTriangleWidthDragListener extends PotentialDragListener<AsymmetricTrianglePotential> {

  public constructor( handleNode: AsymmetricTriangleWidthHandleNode,
                      potential: AsymmetricTrianglePotential,
                      chartTransform: ChartTransform,
                      time: QBSTime,
                      parentTandem: Tandem ) {

    const wellWidthProperty = potential.wellWidthProperty;

    // Since we are not providing options.transform, dragBoundsProperty is in view coordinates.
    const dragBoundsProperty = new DerivedProperty( [ potential.xOffsetProperty ],
      xOffset => {
        // The handle is to the left of the potential's center, so subtract from xOffset.
        const maxX = xOffset - wellWidthProperty.range.min / 2;
        const minX = xOffset - wellWidthProperty.range.max / 2;
        return new Bounds2( chartTransform.modelToViewX( minX ), 0, chartTransform.modelToViewX( maxX ), 1 );
      } );

    super( handleNode, wellWidthProperty, chartTransform, time, {
      tandem: parentTandem,
      orientation: 'horizontal',
      keyboardDragDelta: QBSConstants.WIDTH_KEYBOARD_DRAG_DELTA, // nm
      keyboardShiftDragDelta: QBSConstants.WIDTH_KEYBOARD_SHIFT_DRAG_DELTA, // nm
      dragBoundsProperty: dragBoundsProperty,

      // Transform from view to model coordinates while dragging.
      // The handle is on the left wall, so invert the sign.
      viewToModelDelta: viewDelta => -2 * chartTransform.viewToModelDeltaX( viewDelta.x )
    } );
  }
}