// Copyright 2026, University of Colorado Boulder

/**
 * InfiniteStepHeightDragListener is the drag listener for changing the step height of an Infinite Step potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import affirm from '../../../../../perennial-alias/js/browser-and-node/affirm.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import InfiniteStepPotential from '../../model/potentials/InfiniteStepPotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import PotentialDragHandleNode from './PotentialDragHandleNode.js';
import PotentialDragListener from './PotentialDragListener.js';

// Drag deltas for well depth, in eV.
const DRAG_DELTA = 0.5;
const SHIFT_DRAG_DELTA = 0.1;

export default class InfiniteStepHeightDragListener extends PotentialDragListener {

  public constructor( dragHandleNode: PotentialDragHandleNode,
                      potential: InfiniteStepPotential,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      parentTandem: Tandem ) {

    affirm( potential.numberOfWellsProperty.value === 1, 'InfiniteStepWidthDragHandleNode does not support multiple wells' );

    const stepHeightProperty = potential.stepHeightProperty;
    const chartTransform = energyDiagramNode.chartTransform;
    const energyDiagramRectangleBounds = energyDiagramNode.getChartRectangleGlobalBounds();

    // Since we are not providing a transform option value, all drag events (including listener.modelDelta) are in view coordinates.
    super( dragHandleNode, stepHeightProperty, time, {
      tandem: parentTandem,

      // Adjust drag bounds for yOffset.
      dragBoundsProperty: new DerivedProperty( [ potential.yOffsetProperty ],
        yOffset => new Bounds2(
          energyDiagramRectangleBounds.minX,
          chartTransform.modelToViewY( yOffset + stepHeightProperty.range.max ),
          energyDiagramRectangleBounds.maxX,
          chartTransform.modelToViewY( yOffset + stepHeightProperty.range.min ) ) ),

      keyboardDragListenerOptions: {
        keyboardDragDirection: 'upDown',
        // Invert the sign on dragDelta and shiftDragDelta because drag events are in view coordinates, where +y is down.
        dragDelta: -chartTransform.modelToViewDeltaY( DRAG_DELTA ),
        shiftDragDelta: -chartTransform.modelToViewDeltaY( SHIFT_DRAG_DELTA ),
        moveOnHoldInterval: 20
      },

      drag: ( event, listener ) => {

        // Remember the Property's previous value for sound feedback.
        const previousStepHeight = stepHeightProperty.value;

        // Update the Property.
        const deltaStepHeight = chartTransform.viewToModelDeltaY( listener.modelDelta.y );
        stepHeightProperty.value = stepHeightProperty.range.clampValue( stepHeightProperty.value + deltaStepHeight );

        // Play sound to communicate how the Property changed.
        this.playSoundForValueChange( stepHeightProperty.value, previousStepHeight );
      }
    } );
  }
}