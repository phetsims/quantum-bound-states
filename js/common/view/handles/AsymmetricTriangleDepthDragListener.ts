// Copyright 2026, University of Colorado Boulder

//TODO This is identical to FiniteSquareDepthDragListener except for the type of @param potential.
/**
 * AsymmetricTriangleDepthDragListener is the drag listener for changing the well depth of an Asymmetric Triangle potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import AsymmetricTrianglePotential from '../../model/potentials/AsymmetricTrianglePotential.js';
import QBSTime from '../../model/QBSTime.js';
import EnergyDiagramNode from '../EnergyDiagramNode.js';
import AsymmetricTriangleDepthHandleNode from './AsymmetricTriangleDepthHandleNode.js';
import PotentialDragListener from './PotentialDragListener.js';

export default class AsymmetricTriangleDepthDragListener extends PotentialDragListener<AsymmetricTrianglePotential> {

  public constructor( handleNode: AsymmetricTriangleDepthHandleNode,
                      potential: AsymmetricTrianglePotential,
                      energyDiagramNode: EnergyDiagramNode,
                      time: QBSTime,
                      parentTandem: Tandem ) {

    const wellDepthProperty = potential.wellDepthProperty;
    const chartTransform = energyDiagramNode.chartTransform;
    const energyDiagramRectangleBounds = energyDiagramNode.getChartRectangleGlobalBounds();

    // Since we are not providing a transform option value, all drag events (including listener.modelDelta) are in view coordinates.
    super( handleNode, wellDepthProperty, chartTransform, time, {
      tandem: parentTandem,

      orientation: 'vertical',
      keyboardDragDelta: 0.5, // eV
      keyboardShiftDragDelta: 0.1, // eV

      // Since we are not providing a transform option value, dragBoundsProperty is in view coordinates.
      dragBoundsProperty: new DerivedProperty( [ potential.yOffsetProperty ],
        yOffset => new Bounds2(
          energyDiagramRectangleBounds.minX,
          chartTransform.modelToViewY( yOffset + wellDepthProperty.range.max ),
          energyDiagramRectangleBounds.maxX,
          chartTransform.modelToViewY( yOffset + wellDepthProperty.range.min ) ) ),

      drag: ( event, listener ) => {

        // Since we are not providing a transform option value, listener.modelDelta is in view coordinates.
        const viewDeltaY = listener.modelDelta.y;

        // Remember the Property's previous value for sound feedback.
        const previousWellDepth = wellDepthProperty.value;

        // Update the Property.
        const deltaDepth = chartTransform.viewToModelDeltaY( viewDeltaY );
        wellDepthProperty.value = wellDepthProperty.range.constrainValue( previousWellDepth + deltaDepth );

        // Play sound to communicate how the Property changed.
        this.playSoundForValueChange( wellDepthProperty.value, previousWellDepth );
      }
    } );
  }
}