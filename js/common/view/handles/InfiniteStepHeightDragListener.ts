// Copyright 2026, University of Colorado Boulder

/**
 * InfiniteStepHeightDragListener is the drag listener for changing the step height of an Infinite Step potential.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import { toFixedNumber } from '../../../../../dot/js/util/toFixedNumber.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import InfiniteStepPotential from '../../model/potentials/InfiniteStepPotential.js';
import QBSTime from '../../model/QBSTime.js';
import QBSConstants from '../../QBSConstants.js';
import InfiniteStepHeightHandleNode from './InfiniteStepHeightHandleNode.js';
import PotentialDragListener from './PotentialDragListener.js';

export default class InfiniteStepHeightDragListener extends PotentialDragListener<InfiniteStepPotential> {

  public constructor( handleNode: InfiniteStepHeightHandleNode,
                      potential: InfiniteStepPotential,
                      chartTransform: ChartTransform,
                      time: QBSTime,
                      parentTandem: Tandem ) {

    const stepHeightProperty = potential.stepHeightProperty;

    // Since we are not providing options.transform, all drag events (including listener.modelDelta) are in view coordinates.
    super( handleNode, stepHeightProperty, chartTransform, time, {
      tandem: parentTandem,
      orientation: 'vertical',
      keyboardDragDelta: PotentialDragListener.getKeyboardDragDelta( QBSConstants.STEP_HEIGHT_DECIMAL_PLACES ), // eV
      keyboardShiftDragDelta: PotentialDragListener.getKeyboardShiftDragDelta( QBSConstants.STEP_HEIGHT_DECIMAL_PLACES ), // eV
      updateProperty: ( viewPosition, viewDelta, isFromPDOM ) => {
        let stepHeight;
        if ( isFromPDOM ) {
          const modelDelta = chartTransform.viewToModelDelta( viewDelta );
          stepHeight = stepHeightProperty.value + modelDelta.y;
        }
        else {
          const modelPosition = chartTransform.viewToModelPosition( viewPosition );
          stepHeight = modelPosition.y - potential.yOffsetProperty.value;
        }
        stepHeightProperty.value = stepHeightProperty.range.constrainValue( toFixedNumber( stepHeight, QBSConstants.STEP_HEIGHT_DECIMAL_PLACES ) );
      }
    } );
  }
}