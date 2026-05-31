// Copyright 2026, University of Colorado Boulder

/**
 * FiniteSquareWidthDragListener is the drag listener for changing the well width of a Finite Square potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import FiniteSquarePotential from '../../model/potentials/FiniteSquarePotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import FiniteSquareWidthHandleNode from './FiniteSquareWidthHandleNode.js';
import PotentialDragListener from './PotentialDragListener.js';

export default class FiniteSquareWidthDragListener extends PotentialDragListener<FiniteSquarePotential> {

  public constructor( handleNode: FiniteSquareWidthHandleNode,
                      potential: FiniteSquarePotential,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      parentTandem: Tandem ) {

    const wellWidthProperty = potential.wellWidthProperty;
    const chartTransform = energyDiagramNode.chartTransform;
    const energyDiagramRectangleBounds = energyDiagramNode.getChartRectangleGlobalBounds();

    // Since we are not providing a transform option value, all drag events (including listener.modelDelta) are in view coordinates.
    super( handleNode, wellWidthProperty, chartTransform, time, {
      tandem: parentTandem,

      orientation: 'horizontal',
      keyboardDragDelta: 0.5, // nm
      keyboardShiftDragDelta: 0.1, // nm

      // Adjust drag bounds for xOffset and the handle position at getTotalWidth()/2.
      // Since we are not providing a transform option value, dragBoundsProperty is in view coordinates.
      dragBoundsProperty: new DerivedProperty( [ potential.xOffsetProperty, potential.numberOfWellsProperty, potential.separationProperty ],
        ( xOffset, numberOfWells, separation ) => {
          const totalSeparation = ( numberOfWells - 1 ) * separation;
          return new Bounds2(
            chartTransform.modelToViewX( xOffset + ( numberOfWells * wellWidthProperty.range.min + totalSeparation ) / 2 ),
            energyDiagramRectangleBounds.minY,
            chartTransform.modelToViewX( xOffset + ( numberOfWells * wellWidthProperty.range.max + totalSeparation ) / 2 ),
            energyDiagramRectangleBounds.maxY );
        } ),

      drag: ( event, listener ) => {

        // Since we are not providing a transform option value, listener.modelDelta is in view coordinates.
        const viewDeltaX = listener.modelDelta.x;

        // Remember the Property's previous value for sound feedback.
        const previousWellWidth = wellWidthProperty.value;

        // Compute new value, taking into account the number of wells.
        const deltaWidth = 2 * chartTransform.viewToModelDeltaX( viewDeltaX );
        wellWidthProperty.value = wellWidthProperty.range.constrainValue(
          previousWellWidth + deltaWidth / potential.numberOfWellsProperty.value );

        // Play sound to communicate how the Property changed.
        this.playSoundForValueChange( wellWidthProperty.value, previousWellWidth );
      }
    } );
  }
}