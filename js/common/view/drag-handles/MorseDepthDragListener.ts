// Copyright 2026, University of Colorado Boulder

//TODO This is identical to FiniteSquareDepthDragListener except for the type of @param potential.
/**
 * MorseDepthDragListener is the drag listener for changing the well depth of a Morse potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import MorsePotential from '../../model/potentials/MorsePotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import MorseDepthDragHandleNode from './MorseDepthDragHandleNode.js';
import PotentialHandleDragListener from './PotentialHandleDragListener.js';

export default class MorseDepthDragListener extends PotentialHandleDragListener<MorsePotential> {

  public constructor( dragHandleNode: MorseDepthDragHandleNode,
                      potential: MorsePotential,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      parentTandem: Tandem ) {

    const wellDepthProperty = potential.wellDepthProperty;
    const chartTransform = energyDiagramNode.chartTransform;
    const energyDiagramRectangleBounds = energyDiagramNode.getChartRectangleGlobalBounds();

    // Since we are not providing a transform option value, all drag events (including listener.modelDelta) are in view coordinates.
    super( dragHandleNode, wellDepthProperty, chartTransform, time, {
      tandem: parentTandem,

      orientation: 'vertical',
      keyboardDragDelta: 0.5, // eV
      keyboardShiftDragDelta: 0.1, // eV

      // Adjust drag bounds for yOffset.
      dragBoundsProperty: new DerivedProperty( [ potential.yOffsetProperty ],
        yOffset => new Bounds2(
          energyDiagramRectangleBounds.minX,
          chartTransform.modelToViewY( yOffset + wellDepthProperty.range.max ),
          energyDiagramRectangleBounds.maxX,
          chartTransform.modelToViewY( yOffset + wellDepthProperty.range.min ) ) ),

      drag: ( event, listener ) => {

        // Remember the Property's previous value for sound feedback.
        const previousWellDepth = wellDepthProperty.value;

        // Update the Property.
        const deltaDepth = chartTransform.viewToModelDeltaY( -listener.modelDelta.y ); // Negative because depth is downward for Morse.
        wellDepthProperty.value = wellDepthProperty.range.clampValue( wellDepthProperty.value + deltaDepth );

        // Play sound to communicate how the Property changed.
        this.playSoundForValueChange( wellDepthProperty.value, previousWellDepth );
      }
    } );
  }
}