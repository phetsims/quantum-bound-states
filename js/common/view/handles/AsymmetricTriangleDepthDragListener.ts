// Copyright 2026, University of Colorado Boulder

//TODO This is identical to FiniteSquareDepthDragListener except for the type of @param potential.
/**
 * AsymmetricTriangleDepthDragListener is the drag listener for changing the well depth of an Asymmetric Triangle potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../../axon/js/Property.js';
import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import AsymmetricTrianglePotential from '../../model/potentials/AsymmetricTrianglePotential.js';
import QBSTime from '../../model/QBSTime.js';
import AsymmetricTriangleDepthHandleNode from './AsymmetricTriangleDepthHandleNode.js';
import PotentialDragListener from './PotentialDragListener.js';

export default class AsymmetricTriangleDepthDragListener extends PotentialDragListener<AsymmetricTrianglePotential> {

  public constructor( handleNode: AsymmetricTriangleDepthHandleNode,
                      potential: AsymmetricTrianglePotential,
                      chartTransform: ChartTransform,
                      time: QBSTime,
                      parentTandem: Tandem ) {

    const wellDepthProperty = potential.wellDepthProperty;

    // Since we are not providing options.transform, dragBoundsProperty is in view coordinates.
    const dragBoundsProperty = new Property( new Bounds2( 0, 0, 1, 1 ) );
    const updateDragBounds = () => {
      const minY = potential.yOffsetProperty.value + wellDepthProperty.range.min;
      const maxY = potential.yOffsetProperty.value + wellDepthProperty.range.max;
      dragBoundsProperty.value = new Bounds2( 0, chartTransform.modelToViewY( maxY ), 1, chartTransform.modelToViewY( minY ) );
    };
    potential.yOffsetProperty.lazyLink( () => updateDragBounds() );
    chartTransform.changedEmitter.addListener( () => updateDragBounds() );
    updateDragBounds();

    super( handleNode, wellDepthProperty, chartTransform, time, {
      tandem: parentTandem,
      orientation: 'vertical',
      keyboardDragDelta: 0.5, // eV
      keyboardShiftDragDelta: 0.1, // eV
      dragBoundsProperty: dragBoundsProperty,

      // Update the Property while dragging.
      updateProperty: viewDelta => {
        const deltaDepth = chartTransform.viewToModelDeltaY( viewDelta.y );
        wellDepthProperty.value = wellDepthProperty.range.constrainValue( wellDepthProperty.value + deltaDepth );
      }
    } );
  }
}