// Copyright 2026, University of Colorado Boulder

/**
 * WellDepthDragListener is the drag listener for changing the well depth of a quantum potential.
 * It works for quantum potentials that measure depth upward from the bottom of the well, and
 * quantum potentials that measure depth downward from the top of the well.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import { toFixedNumber } from '../../../../../dot/js/util/toFixedNumber.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import QuantumPotentialDepth from '../../model/potentials/QuantumPotentialDepth.js';
import QBSTime from '../../model/QBSTime.js';
import QBSConstants from '../../QBSConstants.js';
import PotentialDragListener from './PotentialDragListener.js';
import PotentialHandleNode from './PotentialHandleNode.js';

export default class WellDepthDragListener extends PotentialDragListener<QuantumPotentialDepth> {

  public constructor( handleNode: PotentialHandleNode<QuantumPotentialDepth>,
                      potential: QuantumPotentialDepth,
                      chartTransform: ChartTransform,
                      time: QBSTime,
                      parentTandem: Tandem ) {

    const wellDepthProperty = potential.wellDepthProperty;

    super( handleNode, wellDepthProperty, chartTransform, time, {
      tandem: parentTandem,
      orientation: 'vertical',
      keyboardDragDelta: PotentialDragListener.getKeyboardDragDelta( QBSConstants.WELL_DEPTH_DECIMAL_PLACES ), // eV
      keyboardShiftDragDelta: PotentialDragListener.getKeyboardShiftDragDelta( QBSConstants.WELL_DEPTH_DECIMAL_PLACES ), // eV
      updateProperty: ( viewPosition, viewDelta, isFromPDOM ) => {
        let wellDepth;
        if ( isFromPDOM ) {
          const modelDelta = chartTransform.viewToModelDelta( viewDelta );
          if ( potential.depthDirection === 'up' ) {
            wellDepth = wellDepthProperty.value + modelDelta.y;
          }
          else {
            wellDepth = wellDepthProperty.value - modelDelta.y;
          }
        }
        else {
          const modelPosition = chartTransform.viewToModelPosition( viewPosition );
          const xModel = chartTransform.viewToModelX( handleNode.x );
          const electricFieldOffset = potential.getElectricFieldOffset( xModel );
          if ( potential.depthDirection === 'up' ) {
            wellDepth = modelPosition.y - ( potential.yOffsetProperty.value + electricFieldOffset );
          }
          else {
            wellDepth = ( potential.yOffsetProperty.value + electricFieldOffset ) - modelPosition.y;
          }
        }
        wellDepthProperty.value = wellDepthProperty.range.constrainValue( toFixedNumber( wellDepth, QBSConstants.WELL_DEPTH_DECIMAL_PLACES ) );
      }
    } );
  }
}