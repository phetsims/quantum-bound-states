// Copyright 2026, University of Colorado Boulder

/**
 * FiniteSquareWidthDragListener is the drag listener for changing the well width of a Finite Square potential.
 * The drag handle is assumed to be on the right wall of the rightmost well, and therefore is effectively
 * controlling the total width of the potential when dragging with the pointer.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import { toFixedNumber } from '../../../../../dot/js/util/toFixedNumber.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import FiniteSquarePotential from '../../model/potentials/FiniteSquarePotential.js';
import QBSTime from '../../model/QBSTime.js';
import FiniteSquareWidthHandleNode from './FiniteSquareWidthHandleNode.js';
import PotentialDragListener from './PotentialDragListener.js';

export default class FiniteSquareWidthDragListener extends PotentialDragListener<FiniteSquarePotential> {

  public constructor( handleNode: FiniteSquareWidthHandleNode,
                      potential: FiniteSquarePotential,
                      chartTransform: ChartTransform,
                      time: QBSTime,
                      parentTandem: Tandem ) {

    const wellWidthProperty = potential.wellWidthProperty;

    // keyboardShiftDragDelta operates at the same precision as the number of decimal places displayed in the visual UI.
    // keyboardDragDelta is coarser.
    const keyboardShiftDragDelta = Math.pow( 10, -potential.wellWidthDecimalPlaces ); // nm
    const keyboardDragDelta = 5 * keyboardShiftDragDelta; // nm

    super( handleNode, wellWidthProperty, chartTransform, time, {
      tandem: parentTandem,
      orientation: 'horizontal',
      keyboardShiftDragDelta: keyboardShiftDragDelta,
      keyboardDragDelta: keyboardDragDelta,
      updateProperty: ( viewPosition, viewDelta, isFromPDOM ) => {
        let wellWidth;
        if ( isFromPDOM ) {
          const modelDelta = chartTransform.viewToModelDelta( viewDelta );
          wellWidth = potential.wellWidthProperty.value + modelDelta.x;
        }
        else {
          const modelPosition = chartTransform.viewToModelPosition( viewPosition );
          const numberOfWells = potential.numberOfWellsProperty.value;
          const totalWidth = 2 * ( modelPosition.x - potential.xOffsetProperty.value );
          const totalSeparation = potential.separationProperty.value * ( numberOfWells - 1 );
          wellWidth = ( totalWidth - totalSeparation ) / numberOfWells;
        }
        potential.wellWidthProperty.value = potential.wellWidthProperty.range.constrainValue( toFixedNumber( wellWidth, potential.wellWidthDecimalPlaces ) );
      }
    } );
  }
}