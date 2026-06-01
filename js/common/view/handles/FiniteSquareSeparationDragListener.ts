// Copyright 2026, University of Colorado Boulder

/**
 * FiniteSquareSeparationDragListener is the drag listener for changing separation between wells of a Finite Square potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import FiniteSquarePotential from '../../model/potentials/FiniteSquarePotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import FiniteSquareSeparationHandleNode from './FiniteSquareSeparationHandleNode.js';
import PotentialDragListener from './PotentialDragListener.js';

export default class FiniteSquareSeparationDragListener extends PotentialDragListener<FiniteSquarePotential> {

  public constructor( handleNode: FiniteSquareSeparationHandleNode,
                      potential: FiniteSquarePotential,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      parentTandem: Tandem ) {

    const separationProperty = potential.separationProperty;
    const chartTransform = energyDiagramNode.chartTransform;
    const energyDiagramRectangleBounds = energyDiagramNode.getChartRectangleGlobalBounds();

    // Since we are not providing options.transform, all drag events (including listener.modelDelta) are in view coordinates.
    super( handleNode, separationProperty, chartTransform, time, {
      tandem: parentTandem,

      orientation: 'horizontal',
      keyboardDragDelta: 0.5, // nm
      keyboardShiftDragDelta: 0.1, // nm

      // Adjust drag bounds. Since we are not providing options.transform, dragBoundsProperty is in view coordinates.
      dragBoundsProperty: new DerivedProperty( [ potential.xOffsetProperty, potential.numberOfWellsProperty, potential.wellWidthProperty ],
        ( xOffset, numberOfWells, wellWidth ) => {

          const minX = ( numberOfWells % 2 === 0 ) ?
                       xOffset + separationProperty.range.min / 2 :
                       xOffset + ( wellWidth / 2 + separationProperty.range.min );
          const maxX = ( numberOfWells % 2 === 0 ) ?
                       xOffset + separationProperty.range.max / 2 :
                       xOffset + ( wellWidth / 2 + separationProperty.range.max );

          return new Bounds2(
            chartTransform.modelToViewX( minX ),
            energyDiagramRectangleBounds.minY,
            chartTransform.modelToViewX( maxX ),
            energyDiagramRectangleBounds.maxY );
        } ),

      drag: ( event, listener ) => {

        // Since we are not providing options.transform, listener.modelDelta is in view coordinates.
        const viewDeltaX = listener.modelDelta.x;

        // Remember the Property's previous value for sound feedback.
        const previousSeparation = separationProperty.value;

        // Compute new value, taking into account the number of wells.
        const deltaSeparation = 2 * chartTransform.viewToModelDeltaX( viewDeltaX );
        separationProperty.value = separationProperty.range.constrainValue(
          previousSeparation + deltaSeparation / ( potential.numberOfWellsProperty.value - 1 ) );

        // Play sound to communicate how the Property changed.
        this.playSoundForValueChange( separationProperty.value, previousSeparation );
      }
    } );
  }
}