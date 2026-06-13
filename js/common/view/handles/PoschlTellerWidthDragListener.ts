// Copyright 2026, University of Colorado Boulder

/**
 * PoschlTellerWidthDragListener is the drag listener for changing the well width of a Poschl-Teller potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import PoschlTellerPotential from '../../model/potentials/PoschlTellerPotential.js';
import QBSTime from '../../model/QBSTime.js';
import QBSConstants from '../../QBSConstants.js';
import PoschlTellerWidthHandleNode from './PoschlTellerWidthHandleNode.js';
import PotentialDragListener from './PotentialDragListener.js';

export default class PoschlTellerWidthDragListener extends PotentialDragListener<PoschlTellerPotential> {

  public constructor( handleNode: PoschlTellerWidthHandleNode,
                      potential: PoschlTellerPotential,
                      chartTransform: ChartTransform,
                      time: QBSTime,
                      parentTandem: Tandem ) {

    const wellWidthProperty = potential.wellWidthProperty;

    // Since we are not providing options.transform, dragBoundsProperty is in view coordinates.
    const dragBoundsProperty = new DerivedProperty(
      [ potential.xOffsetProperty, potential.numberOfWellsProperty, potential.spacingProperty ],
      ( xOffset, numberOfWells, spacing ) => {
        const minTotalWidth = ( ( numberOfWells - 1 ) * spacing ) + wellWidthProperty.range.min;
        const maxTotalWidth = ( ( numberOfWells - 1 ) * spacing ) + wellWidthProperty.range.max;
        const minX = xOffset + minTotalWidth / 2;
        const maxX = xOffset + maxTotalWidth / 2;
        return new Bounds2( chartTransform.modelToViewX( minX ), 0, chartTransform.modelToViewX( maxX ), 1 );
      } );

    // Since we are not providing options.transform, all drag events (including listener.modelDelta) are in view coordinates.
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
          return 2 * chartTransform.viewToModelDeltaX( viewDelta.x ) / potential.numberOfWellsProperty.value;
        }
      }
    } );
  }
}