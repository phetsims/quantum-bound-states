// Copyright 2026, University of Colorado Boulder

/**
 * WellWidthDragListener is the drag listener for changing the well width of a quantum potential.
 * This drag listener is for single-well potentials that are centered at the x-offset.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import { toFixedNumber } from '../../../../../dot/js/util/toFixedNumber.js';
import affirm from '../../../../../perennial-alias/js/browser-and-node/affirm.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import QuantumPotential from '../../model/potentials/QuantumPotential.js';
import QBSTime from '../../model/QBSTime.js';
import QBSConstants from '../../QBSConstants.js';
import PotentialDragListener from './PotentialDragListener.js';
import PotentialHandleNode from './PotentialHandleNode.js';

export default class WellWidthDragListener extends PotentialDragListener<QuantumPotential> {

  public constructor( handleNode: PotentialHandleNode<QuantumPotential>,
                      potential: QuantumPotential,
                      chartTransform: ChartTransform,
                      time: QBSTime,
                      parentTandem: Tandem ) {

    const wellWidthProperty = potential.wellWidthProperty;

    super( handleNode, wellWidthProperty, chartTransform, time, {
      tandem: parentTandem,
      orientation: 'horizontal',
      keyboardDragDelta: QBSConstants.WIDTH_KEYBOARD_DRAG_DELTA, // nm
      keyboardShiftDragDelta: QBSConstants.WIDTH_KEYBOARD_SHIFT_DRAG_DELTA, // nm
      updateProperty: ( viewPosition, viewDelta, isFromPDOM ) => {
        affirm( potential.numberOfWellsProperty.value === 1, 'numberOfWells must be 1' );
        let wellWidth;
        if ( isFromPDOM ) {
          const modelDelta = chartTransform.viewToModelDelta( viewDelta );
          wellWidth = wellWidthProperty.value + modelDelta.x;
        }
        else {
          const modelPosition = chartTransform.viewToModelPosition( viewPosition );
          wellWidth = 2 * ( modelPosition.x - potential.xOffsetProperty.value );
        }
        wellWidthProperty.value = wellWidthProperty.range.constrainValue( toFixedNumber( wellWidth, potential.wellWidthDecimalPlaces ) );
      }
    } );
  }
}