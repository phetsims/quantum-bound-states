// Copyright 2026, University of Colorado Boulder

//TODO This is identical to FiniteSquareWidthDragListener except for the type of @param potential.
/**
 * HarmonicOscillatorWidthDragListener is the drag listener for changing the well width of a Harmonic Oscillator potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import HarmonicOscillatorPotential from '../../model/potentials/HarmonicOscillatorPotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import HarmonicOscillatorWidthDragHandleNode from './HarmonicOscillatorWidthDragHandleNode.js';
import PotentialDragListener from './PotentialDragListener.js';

export default class HarmonicOscillatorWidthDragListener extends PotentialDragListener<HarmonicOscillatorPotential> {

  public constructor( dragHandleNode: HarmonicOscillatorWidthDragHandleNode,
                      potential: HarmonicOscillatorPotential,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      parentTandem: Tandem ) {

    const wellWidthProperty = potential.wellWidthProperty;
    const chartTransform = energyDiagramNode.chartTransform;
    const energyDiagramRectangleBounds = energyDiagramNode.getChartRectangleGlobalBounds();

    // Since we are not providing a transform option value, all drag events (including listener.modelDelta) are in view coordinates.
    super( dragHandleNode, wellWidthProperty, chartTransform, time, {
      tandem: parentTandem,

      orientation: 'horizontal',
      keyboardDragDelta: 0.5, // nm
      keyboardShiftDragDelta: 0.1, // nm

      // Adjust drag bounds for xOffset.
      dragBoundsProperty: new DerivedProperty( [ potential.xOffsetProperty ],
        xOffset => new Bounds2(
          chartTransform.modelToViewX( xOffset + wellWidthProperty.range.min ),
          energyDiagramRectangleBounds.minY,
          chartTransform.modelToViewX( xOffset + wellWidthProperty.range.max ),
          energyDiagramRectangleBounds.maxY ) ),

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