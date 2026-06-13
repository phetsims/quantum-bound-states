// Copyright 2026, University of Colorado Boulder

//TODO This is identical to MorseDepthDragListener except for the type of @param potential.
/**
 * MorseDepthDragListener is the drag listener for changing the well depth of a Poschl-Teller potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../../axon/js/Property.js';
import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import PoschlTellerPotential from '../../model/potentials/PoschlTellerPotential.js';
import QBSTime from '../../model/QBSTime.js';
import QBSConstants from '../../QBSConstants.js';
import PoschlTellerDepthHandleNode from './PoschlTellerDepthHandleNode.js';
import PotentialDragListener from './PotentialDragListener.js';

export default class PoschlTellerDepthDragListener extends PotentialDragListener<PoschlTellerPotential> {

  public constructor( handleNode: PoschlTellerDepthHandleNode,
                      potential: PoschlTellerPotential,
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
      // Depth is downward for Poschl-Teller, so reverse min and max.
      const minY = yOffset - wellDepthProperty.range.max + electricFieldOffset;
      const maxY = yOffset - wellDepthProperty.range.min + electricFieldOffset;
      dragBoundsProperty.value = new Bounds2( 0, chartTransform.modelToViewY( maxY ), 1, chartTransform.modelToViewY( minY ) );
    };
    potential.changedEmitter.addListener( () => updateDragBounds() );
    chartTransform.changedEmitter.addListener( () => updateDragBounds() );
    updateDragBounds();

    // Since we are not providing options.transform, all drag events (including listener.modelDelta) are in view coordinates.
    super( handleNode, wellDepthProperty, chartTransform, time, {
      tandem: parentTandem,
      orientation: 'vertical',
      keyboardDragDelta: QBSConstants.DEPTH_KEYBOARD_DRAG_DELTA, // eV
      keyboardShiftDragDelta: QBSConstants.DEPTH_KEYBOARD_SHIFT_DRAG_DELTA, // eV
      dragBoundsProperty: dragBoundsProperty,

      // Transform from view to model coordinates while dragging.
      // Depth is downward for Poschl-Teller, so invert the sign of the delta.
      viewToModelDelta: viewDelta => -chartTransform.viewToModelDeltaY( viewDelta.y )
    } );
  }
}