// Copyright 2026, University of Colorado Boulder

//TODO This is identical to InfiniteSquareWidthDragListener except for the type of @param potential.
/**
 * InfiniteStepWidthDragListener is the drag listener for changing the well width of an Infinite Step potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import InfiniteStepPotential from '../../model/potentials/InfiniteStepPotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import InfiniteStepWidthDragHandleNode from './InfiniteStepWidthDragHandleNode.js';
import PotentialDragListener from './PotentialDragListener.js';

// Drag deltas for well width, in nm.
const DRAG_DELTA = 0.5;
const SHIFT_DRAG_DELTA = 0.1;

export default class InfiniteStepWidthDragListener extends PotentialDragListener<InfiniteStepPotential> {

  public constructor( dragHandleNode: InfiniteStepWidthDragHandleNode,
                      potential: InfiniteStepPotential,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      parentTandem: Tandem ) {

    const wellWidthProperty = potential.wellWidthProperty;
    const chartTransform = energyDiagramNode.chartTransform;
    const energyDiagramRectangleBounds = energyDiagramNode.getChartRectangleGlobalBounds();

    // Since we are not providing a transform option value, all drag events (including listener.modelDelta) are in view coordinates.
    super( dragHandleNode, wellWidthProperty, time, {
      tandem: parentTandem,

      // Adjust drag bounds for xOffset.
      dragBoundsProperty: new DerivedProperty( [ potential.xOffsetProperty ],
        xOffset => new Bounds2(
          chartTransform.modelToViewX( xOffset + wellWidthProperty.range.min ),
          energyDiagramRectangleBounds.minY,
          chartTransform.modelToViewX( xOffset + wellWidthProperty.range.max ),
          energyDiagramRectangleBounds.maxY ) ),

      keyboardDragListenerOptions: {
        keyboardDragDirection: 'leftRight',
        dragDelta: chartTransform.modelToViewDeltaX( DRAG_DELTA ),
        shiftDragDelta: chartTransform.modelToViewDeltaX( SHIFT_DRAG_DELTA ),
        moveOnHoldInterval: 20
      },

      drag: ( event, listener ) => {

        // Remember the Property's previous value for sound feedback.
        const previousWellWidth = wellWidthProperty.value;

        // Update the Property.
        const deltaWidth = 2 * chartTransform.viewToModelDeltaX( listener.modelDelta.x );
        wellWidthProperty.value = wellWidthProperty.range.clampValue( wellWidthProperty.value + deltaWidth );

        // Play sound to communicate how the Property changed.
        this.playSoundForValueChange( wellWidthProperty.value, previousWellWidth );
      }
    } );
  }
}