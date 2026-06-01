// Copyright 2026, University of Colorado Boulder

//TODO This is identical to FiniteSquareWidthDragListener except for the type of @param potential.
/**
 * CoulombWidthDragListener is the drag listener for changing the well width of a Coulomb potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import CoulombPotential from '../../model/potentials/CoulombPotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import CoulombWidthHandleNode from './CoulombWidthHandleNode.js';
import PotentialDragListener from './PotentialDragListener.js';

export default class CoulombWidthDragListener extends PotentialDragListener<CoulombPotential> {

  public constructor( handleNode: CoulombWidthHandleNode,
                      potential: CoulombPotential,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      parentTandem: Tandem ) {

    const wellWidthProperty = potential.wellWidthProperty;
    const chartTransform = energyDiagramNode.chartTransform;

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
          const energyDiagramRectangleBounds = energyDiagramNode.getChartRectangleGlobalBounds();
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