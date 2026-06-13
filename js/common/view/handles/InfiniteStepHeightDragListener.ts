// Copyright 2026, University of Colorado Boulder

/**
 * InfiniteStepHeightDragListener is the drag listener for changing the step height of an Infinite Step potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../../axon/js/Property.js';
import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import InfiniteStepPotential from '../../model/potentials/InfiniteStepPotential.js';
import QBSTime from '../../model/QBSTime.js';
import QBSConstants from '../../QBSConstants.js';
import InfiniteStepHeightHandleNode from './InfiniteStepHeightHandleNode.js';
import PotentialDragListener from './PotentialDragListener.js';

export default class InfiniteStepHeightDragListener extends PotentialDragListener<InfiniteStepPotential> {

  public constructor( handleNode: InfiniteStepHeightHandleNode,
                      potential: InfiniteStepPotential,
                      chartTransform: ChartTransform,
                      time: QBSTime,
                      parentTandem: Tandem ) {

    const stepHeightProperty = potential.stepHeightProperty;

    // Since we are not providing options.transform, dragBoundsProperty is in view coordinates.
    const dragBoundsProperty = new Property( new Bounds2( 0, 0, 1, 1 ) );
    const updateDragBounds = () => {
      const minY = potential.yOffsetProperty.value + stepHeightProperty.range.min;
      const maxY = potential.yOffsetProperty.value + stepHeightProperty.range.max;
      dragBoundsProperty.value = new Bounds2( 0, chartTransform.modelToViewY( maxY ), 1, chartTransform.modelToViewY( minY ) );
    };
    potential.yOffsetProperty.lazyLink( () => updateDragBounds() );
    chartTransform.changedEmitter.addListener( () => updateDragBounds() );
    updateDragBounds();

    // Since we are not providing options.transform, all drag events (including listener.modelDelta) are in view coordinates.
    super( handleNode, stepHeightProperty, chartTransform, time, {
      tandem: parentTandem,
      orientation: 'vertical',
      keyboardDragDelta: QBSConstants.STEP_HEIGHT_KEYBOARD_DRAG_DELTA, // eV
      keyboardShiftDragDelta: QBSConstants.STEP_HEIGHT_KEYBOARD_SHIFT_DRAG_DELTA, // eV
      dragBoundsProperty: dragBoundsProperty,

      // Transform from view to model coordinates while dragging.
      viewToModelDelta: ( viewDelta, isFromPDOM ) => chartTransform.viewToModelDeltaY( viewDelta.y )
    } );
  }
}