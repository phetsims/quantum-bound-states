// Copyright 2026, University of Colorado Boulder

/**
 * InfiniteStepHeightDragListener is the drag listener for changing the step height of an Infinite Step potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import InfiniteStepPotential from '../../model/potentials/InfiniteStepPotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import InfiniteStepHeightDragHandleNode from './InfiniteStepHeightDragHandleNode.js';
import PotentialHandleDragListener from './PotentialHandleDragListener.js';

export default class InfiniteStepHeightDragListener extends PotentialHandleDragListener<InfiniteStepPotential> {

  public constructor( handleNode: InfiniteStepHeightDragHandleNode,
                      potential: InfiniteStepPotential,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      parentTandem: Tandem ) {

    const stepHeightProperty = potential.stepHeightProperty;
    const chartTransform = energyDiagramNode.chartTransform;
    const energyDiagramRectangleBounds = energyDiagramNode.getChartRectangleGlobalBounds();

    // Since we are not providing a transform option value, all drag events (including listener.modelDelta) are in view coordinates.
    super( handleNode, stepHeightProperty, chartTransform, time, {
      tandem: parentTandem,

      orientation: 'vertical',
      keyboardDragDelta: 0.5, // eV
      keyboardShiftDragDelta: 0.1, // eV

      // Adjust drag bounds for yOffset.
      dragBoundsProperty: new DerivedProperty( [ potential.yOffsetProperty ],
        yOffset => new Bounds2(
          energyDiagramRectangleBounds.minX,
          chartTransform.modelToViewY( yOffset + stepHeightProperty.range.max ),
          energyDiagramRectangleBounds.maxX,
          chartTransform.modelToViewY( yOffset + stepHeightProperty.range.min ) ) ),

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