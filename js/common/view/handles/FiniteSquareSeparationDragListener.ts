// Copyright 2026, University of Colorado Boulder

/**
 * FiniteSquareSeparationDragListener is the drag listener for changing separation between wells of a Finite Square potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import FiniteSquarePotential from '../../model/potentials/FiniteSquarePotential.js';
import QBSTime from '../../model/QBSTime.js';
import QBSConstants from '../../QBSConstants.js';
import FiniteSquareSeparationHandleNode from './FiniteSquareSeparationHandleNode.js';
import PotentialDragListener from './PotentialDragListener.js';

export default class FiniteSquareSeparationDragListener extends PotentialDragListener<FiniteSquarePotential> {

  public constructor( handleNode: FiniteSquareSeparationHandleNode,
                      potential: FiniteSquarePotential,
                      chartTransform: ChartTransform,
                      time: QBSTime,
                      parentTandem: Tandem ) {

    const separationProperty = potential.separationProperty;

    // Since we are not providing options.transform, dragBoundsProperty is in view coordinates.
    const dragBoundsProperty = new DerivedProperty(
      [ potential.xOffsetProperty, potential.numberOfWellsProperty, potential.wellWidthProperty ],
      ( xOffset, numberOfWells, wellWidth ) => {
        const minX = ( numberOfWells % 2 === 0 ) ?
                     xOffset + separationProperty.range.min / 2 :
                     xOffset + wellWidth / 2 + separationProperty.range.min;
        const maxX = ( numberOfWells % 2 === 0 ) ?
                     xOffset + separationProperty.range.max / 2 :
                     xOffset + wellWidth / 2 + separationProperty.range.max;
        return new Bounds2( chartTransform.modelToViewX( minX ), 0, chartTransform.modelToViewX( maxX ), 1 );
      } );

    super( handleNode, separationProperty, chartTransform, time, {
      tandem: parentTandem,
      orientation: 'horizontal',
      keyboardDragDelta: QBSConstants.SEPARATION_KEYBOARD_DRAG_DELTA, // nm
      keyboardShiftDragDelta: QBSConstants.SEPARATION_KEYBOARD_SHIFT_DRAG_DELTA, // nm
      dragBoundsProperty: dragBoundsProperty,

      // Transform from view to model coordinates while dragging.
      viewToModelDelta: viewDelta => {
        return ( potential.numberOfWellsProperty.value % 2 === 0 ) ?
               2 * chartTransform.viewToModelDeltaX( viewDelta.x ) :
               chartTransform.viewToModelDeltaX( viewDelta.x );
      }
    } );
  }
}