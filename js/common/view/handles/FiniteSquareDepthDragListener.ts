// Copyright 2026, University of Colorado Boulder

/**
 * FiniteSquareDepthDragListener is the drag listener for changing the well depth of a Finite Square potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../../axon/js/Property.js';
import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import FiniteSquarePotential from '../../model/potentials/FiniteSquarePotential.js';
import QBSTime from '../../model/QBSTime.js';
import QBSConstants from '../../QBSConstants.js';
import FiniteSquareDepthHandleNode from './FiniteSquareDepthHandleNode.js';
import PotentialDragListener from './PotentialDragListener.js';

export default class FiniteSquareDepthDragListener extends PotentialDragListener<FiniteSquarePotential> {

  public constructor( handleNode: FiniteSquareDepthHandleNode,
                      potential: FiniteSquarePotential,
                      chartTransform: ChartTransform,
                      time: QBSTime,
                      parentTandem: Tandem ) {

    const wellDepthProperty = potential.wellDepthProperty;

    // Since we are not providing options.transform, dragBoundsProperty is in view coordinates.
    const dragBoundsProperty = new Property( new Bounds2( 0, 0, 1, 1 ) );
    const updateDragBounds = () => {
      const x = handleNode.getModelX();
      const electricFieldOffset = potential.getElectricFieldOffset( x );
      const yOffset = potential.yOffsetProperty.value;
      const minY = yOffset + wellDepthProperty.range.min + electricFieldOffset;
      const maxY = yOffset + wellDepthProperty.range.max + electricFieldOffset;
      dragBoundsProperty.value = new Bounds2( 0, chartTransform.modelToViewY( maxY ), 1, chartTransform.modelToViewY( minY ) );
    };
    potential.changedEmitter.addListener( () => updateDragBounds() );
    chartTransform.changedEmitter.addListener( () => updateDragBounds() );
    updateDragBounds();

    super( handleNode, wellDepthProperty, chartTransform, time, {
      tandem: parentTandem,
      orientation: 'vertical',
      keyboardDragDelta: QBSConstants.DEPTH_KEYBOARD_DRAG_DELTA, // eV
      keyboardShiftDragDelta: QBSConstants.DEPTH_KEYBOARD_SHIFT_DRAG_DELTA, // eV
      dragBoundsProperty: dragBoundsProperty,

      // Update the Property while dragging.
      updateProperty: viewDelta => {
        const deltaDepth = chartTransform.viewToModelDeltaY( viewDelta.y );
        wellDepthProperty.value = wellDepthProperty.range.constrainValue( wellDepthProperty.value + deltaDepth );
      }
    } );
  }
}