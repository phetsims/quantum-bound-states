// Copyright 2026, University of Colorado Boulder

/**
 * PoschlTellerSpacingDragListener is the drag listener for changing spacing between wells of a Poschl-Teller potential.
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
import PoschlTellerSpacingHandleNode from './PoschlTellerSpacingHandleNode.js';
import PotentialDragListener from './PotentialDragListener.js';

export default class PoschlTellerSpacingDragListener extends PotentialDragListener<PoschlTellerPotential> {

  public constructor( handleNode: PoschlTellerSpacingHandleNode,
                      potential: PoschlTellerPotential,
                      chartTransform: ChartTransform,
                      time: QBSTime,
                      parentTandem: Tandem ) {

    const spacingProperty = potential.spacingProperty;

    // Since we are not providing options.transform, dragBoundsProperty is in view coordinates.
    const dragBoundsProperty = new DerivedProperty(
      [ potential.xOffsetProperty, potential.numberOfWellsProperty, potential.wellWidthProperty ],
      ( xOffset, numberOfWells, wellWidth ) => {
        const minX = ( numberOfWells % 2 === 0 ) ?
                     xOffset + spacingProperty.range.min / 2 :
                     xOffset + wellWidth / 2 + spacingProperty.range.min;
        const maxX = ( numberOfWells % 2 === 0 ) ?
                     xOffset + spacingProperty.range.max / 2 :
                     xOffset + wellWidth / 2 + spacingProperty.range.max;

        return new Bounds2( chartTransform.modelToViewX( minX ), 0, chartTransform.modelToViewX( maxX ), 1 );
      } );

    // Since we are not providing options.transform, all drag events (including listener.modelDelta) are in view coordinates.
    super( handleNode, spacingProperty, chartTransform, time, {
      tandem: parentTandem,
      orientation: 'horizontal',
      keyboardDragDelta: QBSConstants.SPACING_KEYBOARD_DRAG_DELTA, // nm
      keyboardShiftDragDelta: QBSConstants.SPACING_KEYBOARD_SHIFT_DRAG_DELTA, // nm
      dragBoundsProperty: dragBoundsProperty,

      // Update the Property while dragging.
      updateProperty: viewDelta => {
        const deltaSpacing = ( potential.numberOfWellsProperty.value % 2 === 0 ) ?
                             2 * chartTransform.viewToModelDeltaX( viewDelta.x ) :
                             chartTransform.viewToModelDeltaX( viewDelta.x );
        spacingProperty.value = spacingProperty.range.constrainValue( spacingProperty.value + deltaSpacing );
      }
    } );
  }
}