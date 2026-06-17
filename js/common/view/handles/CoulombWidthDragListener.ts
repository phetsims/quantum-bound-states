// Copyright 2026, University of Colorado Boulder

//TODO This is identical to FiniteSquareWidthDragListener except for the type of @param potential.
/**
 * CoulombWidthDragListener is the drag listener for changing the well width of a Coulomb potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import CoulombPotential from '../../model/potentials/CoulombPotential.js';
import QBSTime from '../../model/QBSTime.js';
import QBSConstants from '../../QBSConstants.js';
import CoulombWidthHandleNode from './CoulombWidthHandleNode.js';
import PotentialDragListener from './PotentialDragListener.js';

export default class CoulombWidthDragListener extends PotentialDragListener<CoulombPotential> {

  public constructor( handleNode: CoulombWidthHandleNode,
                      potential: CoulombPotential,
                      chartTransform: ChartTransform,
                      time: QBSTime,
                      parentTandem: Tandem ) {

    const wellWidthProperty = potential.wellWidthProperty;

    // Since we are not providing options.transform, dragBoundsProperty is in view coordinates.
    const dragBoundsProperty = potential.xOffsetProperty.derived( xOffset => {
      const minX = xOffset + wellWidthProperty.range.min / 2;
      const maxX = xOffset + wellWidthProperty.range.max / 2;
      return new Bounds2( chartTransform.modelToViewX( minX ), 0, chartTransform.modelToViewX( maxX ), 1 );
    } );

    super( handleNode, wellWidthProperty, chartTransform, time, {
      tandem: parentTandem,
      orientation: 'horizontal',
      keyboardDragDelta: QBSConstants.WIDTH_KEYBOARD_DRAG_DELTA, // nm
      keyboardShiftDragDelta: QBSConstants.WIDTH_KEYBOARD_SHIFT_DRAG_DELTA, // nm
      dragBoundsProperty: dragBoundsProperty,

      // Transform from view to model coordinates while dragging.
      viewToModelDelta: ( viewDelta, isFromPDOM ) => {
        if ( isFromPDOM ) {
          return chartTransform.viewToModelDeltaX( viewDelta.x );
        }
        else {
          return 2 * chartTransform.viewToModelDeltaX( viewDelta.x );
        }
      }
    } );
  }
}