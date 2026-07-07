// Copyright 2026, University of Colorado Boulder

/**
 * FiniteSquareSeparationDragListener is the drag listener for changing separation between wells of a Finite Square potential.
 * The drag handle is assumed to be on the right wall of the center well if the number of wells is even, or the well to
 * the left of center if the number of wells is odd.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import { toFixedNumber } from '../../../../../dot/js/util/toFixedNumber.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import FiniteSquarePotential from '../../model/potentials/FiniteSquarePotential.js';
import QBSTime from '../../model/QBSTime.js';
import QBSConstants from '../../QBSConstants.js';
import FiniteSquareSeparationHandleNode from './FiniteSquareSeparationHandleNode.js';
import PotentialDragListener from './PotentialDragListener.js';

export default class FiniteSquareSeparationDragListener extends PotentialDragListener<FiniteSquarePotential> {

  public constructor( handleNode: FiniteSquareSeparationHandleNode,
                      potential: FiniteSquarePotential,
                      chartTransform: ChartTransform,
                      time: QBSTime,
                      parentTandem: Tandem ) {

    const separationProperty = potential.separationProperty;

    super( handleNode, separationProperty, chartTransform, time, {
      tandem: parentTandem,
      orientation: 'horizontal',
      keyboardDragDelta: PotentialDragListener.getKeyboardDragDelta( QBSConstants.SEPARATION_DECIMAL_PLACES ), // nm
      keyboardShiftDragDelta: PotentialDragListener.getKeyboardShiftDragDelta( QBSConstants.SEPARATION_DECIMAL_PLACES ), // nm
      updateProperty: ( viewPosition, viewDelta, isFromPDOM ) => {
        let separation;
        if ( isFromPDOM ) {
          const modelDelta = chartTransform.viewToModelDelta( viewDelta );
          separation = separationProperty.value + modelDelta.x;
        }
        else {
          const modelPosition = chartTransform.viewToModelPosition( viewPosition );
          if ( potential.numberOfWellsProperty.value % 2 === 0 ) {
            separation = 2 * ( modelPosition.x - potential.xOffsetProperty.value );
          }
          else {
            separation = modelPosition.x - potential.xOffsetProperty.value - ( potential.wellWidthProperty.value / 2 );
          }
        }
        separationProperty.value = separationProperty.range.constrainValue( toFixedNumber( separation, QBSConstants.SEPARATION_DECIMAL_PLACES ) );
      }
    } );
  }
}