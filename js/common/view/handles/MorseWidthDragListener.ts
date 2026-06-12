// Copyright 2026, University of Colorado Boulder

/**
 * MorseWidthDragListener is the drag listener for changing the well width of a Morse potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import MorsePotential from '../../model/potentials/MorsePotential.js';
import QBSTime from '../../model/QBSTime.js';
import MorseWidthHandleNode from './MorseWidthHandleNode.js';
import PotentialDragListener from './PotentialDragListener.js';

export default class MorseWidthDragListener extends PotentialDragListener<MorsePotential> {

  public constructor( handleNode: MorseWidthHandleNode,
                      potential: MorsePotential,
                      chartTransform: ChartTransform,
                      time: QBSTime,
                      parentTandem: Tandem ) {

    const wellWidthProperty = potential.wellWidthProperty;

    // Since we are not providing options.transform, dragBoundsProperty is in view coordinates.
    const dragBoundsProperty = new DerivedProperty( [ potential.xOffsetProperty ],
      xOffset => {
        const minX = xOffset + wellWidthProperty.range.min / 2;
        const maxX = xOffset + wellWidthProperty.range.max / 2;
        return new Bounds2( chartTransform.modelToViewX( minX ), 0, chartTransform.modelToViewX( maxX ), 1 );
      } );

    // Since we are not providing options.transform, all drag events (including listener.modelDelta) are in view coordinates.
    super( handleNode, wellWidthProperty, chartTransform, time, {
      tandem: parentTandem,
      orientation: 'horizontal',
      keyboardDragDelta: 0.5, // nm
      keyboardShiftDragDelta: 0.1, // nm
      dragBoundsProperty: dragBoundsProperty,

      // Update the Property while dragging.
      updateProperty: viewDelta => {
        const deltaWidth = 2 * chartTransform.viewToModelDeltaX( viewDelta.x );
        wellWidthProperty.value = wellWidthProperty.range.constrainValue( wellWidthProperty.value + deltaWidth );
      }
    } );
  }
}