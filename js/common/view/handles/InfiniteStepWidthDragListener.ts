// Copyright 2026, University of Colorado Boulder

//TODO This is identical to InfiniteSquareWidthDragListener except for the type of @param potential.
/**
 * InfiniteStepWidthDragListener is the drag listener for changing the well width of an Infinite Step potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import InfiniteStepPotential from '../../model/potentials/InfiniteStepPotential.js';
import QBSTime from '../../model/QBSTime.js';
import InfiniteStepWidthHandleNode from './InfiniteStepWidthHandleNode.js';
import PotentialDragListener from './PotentialDragListener.js';

export default class InfiniteStepWidthDragListener extends PotentialDragListener<InfiniteStepPotential> {

  public constructor( handleNode: InfiniteStepWidthHandleNode,
                      potential: InfiniteStepPotential,
                      chartTransform: ChartTransform,
                      time: QBSTime,
                      parentTandem: Tandem ) {

    const wellWidthProperty = potential.wellWidthProperty;

    // Since we are not providing options.transform, all drag events (including listener.modelDelta) are in view coordinates.
    super( handleNode, wellWidthProperty, chartTransform, time, {
      tandem: parentTandem,

      orientation: 'horizontal',
      keyboardDragDelta: 0.5, // nm
      keyboardShiftDragDelta: 0.1, // nm

      // Since we are not providing options.transform, dragBoundsProperty is in view coordinates.
      dragBoundsProperty: new DerivedProperty( [ potential.xOffsetProperty ],
        xOffset => {
          const minX = xOffset + wellWidthProperty.range.min / 2;
          const maxX = xOffset + wellWidthProperty.range.max / 2;
          return new Bounds2( chartTransform.modelToViewX( minX ), 0, chartTransform.modelToViewX( maxX ), 1 );
        } ),

      drag: ( event, listener ) => {

        // Since we are not providing options.transform, listener.modelDelta is in view coordinates.
        const viewDeltaX = listener.modelDelta.x;

        // Remember the Property's previous value for sound feedback.
        const previousWellWidth = wellWidthProperty.value;

        // Update the Property.
        const deltaWidth = 2 * chartTransform.viewToModelDeltaX( viewDeltaX );
        wellWidthProperty.value = wellWidthProperty.range.constrainValue( previousWellWidth + deltaWidth );

        // Play sound to communicate how the Property changed.
        this.playSoundForValueChange( wellWidthProperty.value, previousWellWidth );
      }
    } );
  }
}