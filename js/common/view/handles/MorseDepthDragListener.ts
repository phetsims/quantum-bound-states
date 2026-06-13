// Copyright 2026, University of Colorado Boulder

//TODO This is identical to FiniteSquareDepthDragListener except for the type of @param potential.
/**
 * MorseDepthDragListener is the drag listener for changing the well depth of a Morse potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../../axon/js/Property.js';
import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import MorsePotential from '../../model/potentials/MorsePotential.js';
import QBSTime from '../../model/QBSTime.js';
import QBSConstants from '../../QBSConstants.js';
import MorseDepthHandleNode from './MorseDepthHandleNode.js';
import PotentialDragListener from './PotentialDragListener.js';

export default class MorseDepthDragListener extends PotentialDragListener<MorsePotential> {

  public constructor( handleNode: MorseDepthHandleNode,
                      potential: MorsePotential,
                      chartTransform: ChartTransform,
                      time: QBSTime,
                      parentTandem: Tandem ) {

    const wellDepthProperty = potential.wellDepthProperty;

    // Since we are not providing options.transform, dragBoundsProperty is in view coordinates.
    const dragBoundsProperty = new Property( new Bounds2( 0, 0, 1, 1 ) );
    const updateDragBounds = () => {
      const minY = potential.yOffsetProperty.value - wellDepthProperty.range.max;
      const maxY = potential.yOffsetProperty.value - wellDepthProperty.range.min;
      dragBoundsProperty.value = new Bounds2( 0, chartTransform.modelToViewY( maxY ), 1, chartTransform.modelToViewY( minY ) );
    };
    potential.yOffsetProperty.lazyLink( () => updateDragBounds() );
    chartTransform.changedEmitter.addListener( () => updateDragBounds() );
    updateDragBounds();

    // Since we are not providing options.transform, all drag events (including listener.modelDelta) are in view coordinates.
    super( handleNode, wellDepthProperty, chartTransform, time, {
      tandem: parentTandem,
      orientation: 'vertical',
      keyboardDragDelta: QBSConstants.DEPTH_KEYBOARD_DRAG_DELTA, // eV
      keyboardShiftDragDelta: QBSConstants.DEPTH_KEYBOARD_SHIFT_DRAG_DELTA, // eV
      dragBoundsProperty: dragBoundsProperty,

      // Transform from view to model coordinates while dragging.
      // Depth is downward for Morse, so invert the sign of the delta.
      viewToModelDelta: viewDelta => -chartTransform.viewToModelDeltaY( viewDelta.y )
    } );
  }
}