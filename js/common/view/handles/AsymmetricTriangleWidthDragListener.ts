// Copyright 2026, University of Colorado Boulder

/**
 * AsymmetricTriangleWidthDragListener is the drag listener for changing the well width of an Asymmetric Triangle potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import AsymmetricTrianglePotential from '../../model/potentials/AsymmetricTrianglePotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import AsymmetricTriangleWidthHandleNode from './AsymmetricTriangleWidthHandleNode.js';
import PotentialDragListener from './PotentialDragListener.js';

export default class AsymmetricTriangleWidthDragListener extends PotentialDragListener<AsymmetricTrianglePotential> {

  public constructor( handleNode: AsymmetricTriangleWidthHandleNode,
                      potential: AsymmetricTrianglePotential,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      parentTandem: Tandem ) {

    const wellWidthProperty = potential.wellWidthProperty;
    const chartTransform = energyDiagramNode.chartTransform;
    const energyDiagramRectangleBounds = energyDiagramNode.getChartRectangleGlobalBounds();

    super( handleNode, wellWidthProperty, chartTransform, time, {
      tandem: parentTandem,

      orientation: 'horizontal',
      keyboardDragDelta: 0.5, // nm
      keyboardShiftDragDelta: 0.1, // nm

      // Since we are not providing options.transform, dragBoundsProperty is in view coordinates.
      dragBoundsProperty: new DerivedProperty( [ potential.xOffsetProperty ],
        // The handle is to the left of the potential's center, so subtract well width.
        xOffset => new Bounds2(
          chartTransform.modelToViewX( xOffset - wellWidthProperty.range.max ),
          energyDiagramRectangleBounds.minY,
          chartTransform.modelToViewX( xOffset - wellWidthProperty.range.min ),
          energyDiagramRectangleBounds.maxY ) ),

      drag: ( event, listener ) => {

        // Since we are not providing options.transform, listener.modelDelta is in view coordinates.
        const viewDeltaX = listener.modelDelta.x;

        // Remember the Property's previous value for sound feedback.
        const previousWellWidth = wellWidthProperty.value;

        // Update the Property. The handle is on the left wall (xOffset - wellWidth/2), so invert the sign used
        // by right-wall width handles (xOffset + wellWidth/2).
        const deltaWidth = -2 * chartTransform.viewToModelDeltaX( viewDeltaX );
        wellWidthProperty.value = wellWidthProperty.range.constrainValue( previousWellWidth + deltaWidth );

        // Play sound to communicate how the Property changed.
        this.playSoundForValueChange( wellWidthProperty.value, previousWellWidth );
      }
    } );
  }
}