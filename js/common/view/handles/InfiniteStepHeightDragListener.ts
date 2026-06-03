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
      keyboardDragDelta: 0.5, // eV
      keyboardShiftDragDelta: 0.1, // eV
      dragBoundsProperty: dragBoundsProperty,

      drag: ( event, listener ) => {

        // Since we are not providing options.transform, listener.modelDelta is in view coordinates.
        const viewDeltaY = listener.modelDelta.y;

        // Remember the Property's previous value for sound feedback.
        const previousStepHeight = stepHeightProperty.value;

        // Update the Property.
        const deltaStepHeight = chartTransform.viewToModelDeltaY( viewDeltaY );
        stepHeightProperty.value = stepHeightProperty.range.constrainValue( previousStepHeight + deltaStepHeight );

        // Play sound to communicate how the Property changed.
        this.playSoundForValueChange( stepHeightProperty.value, previousStepHeight );
      }
    } );
  }
}