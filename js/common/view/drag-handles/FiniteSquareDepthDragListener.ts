// Copyright 2026, University of Colorado Boulder

/**
 * FiniteSquareDepthDragListener is the drag listener for changing the well depth of a Finite Square potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import FiniteSquarePotential from '../../model/potentials/FiniteSquarePotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import PotentialDragHandleNode from './PotentialDragHandleNode.js';
import PotentialDragListener from './PotentialDragListener.js';

// Drag deltas for well depth, in eV.
const DRAG_DELTA = 0.5;
const SHIFT_DRAG_DELTA = 0.1;

export default class FiniteSquareDepthDragListener extends PotentialDragListener {

  public constructor( dragHandleNode: PotentialDragHandleNode,
                      potential: FiniteSquarePotential,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      parentTandem: Tandem ) {

    const wellDepthProperty = potential.wellDepthProperty;
    const chartTransform = energyDiagramNode.chartTransform;
    const energyDiagramRectangleBounds = energyDiagramNode.getChartRectangleGlobalBounds();

    // Since we are not providing a transform option value, all drag events (including listener.modelDelta) are in view coordinates.
    super( dragHandleNode, wellDepthProperty, time, {
      tandem: parentTandem,

      // Adjust drag bounds for yOffset.
      dragBoundsProperty: new DerivedProperty( [ potential.yOffsetProperty ],
        yOffset => new Bounds2(
          energyDiagramRectangleBounds.minX,
          chartTransform.modelToViewY( yOffset + wellDepthProperty.range.max ),
          energyDiagramRectangleBounds.maxX,
          chartTransform.modelToViewY( yOffset + wellDepthProperty.range.min ) ) ),

      keyboardDragListenerOptions: {
        keyboardDragDirection: 'upDown',
        // Invert the sign on dragDelta and shiftDragDelta because drag events are in view coordinates, where +y is down.
        dragDelta: -chartTransform.modelToViewDeltaY( DRAG_DELTA ),
        shiftDragDelta: -chartTransform.modelToViewDeltaY( SHIFT_DRAG_DELTA ),
        moveOnHoldInterval: 20
      },

      drag: ( event, listener ) => {

        // Remember the Property's previous value for sound feedback.
        const previousWellDepth = wellDepthProperty.value;

        // Update the Property.
        const deltaDepth = chartTransform.viewToModelDeltaY( listener.modelDelta.y );
        wellDepthProperty.value = wellDepthProperty.range.clampValue( wellDepthProperty.value + deltaDepth );

        // Play sound to communicate how the Property changed.
        this.playSoundForValueChange( wellDepthProperty.value, previousWellDepth );
      }
    } );
  }
}