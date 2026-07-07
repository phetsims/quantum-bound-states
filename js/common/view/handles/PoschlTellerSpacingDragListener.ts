// Copyright 2026, University of Colorado Boulder

/**
 * PoschlTellerSpacingDragListener is the drag listener for changing spacing between wells of a Poschl-Teller potential.
 * The drag handle is assumed to be on the right wall of the center well if the number of wells is even, or the well to
 * the left of center if the number of wells is odd.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import { toFixedNumber } from '../../../../../dot/js/util/toFixedNumber.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import PoschlTellerPotential from '../../model/potentials/PoschlTellerPotential.js';
import QBSTime from '../../model/QBSTime.js';
import QBSConstants from '../../QBSConstants.js';
import PoschlTellerSpacingHandleNode from './PoschlTellerSpacingHandleNode.js';
import PotentialDragListener from './PotentialDragListener.js';

export default class PoschlTellerSpacingDragListener extends PotentialDragListener<PoschlTellerPotential> {

  public constructor( handleNode: PoschlTellerSpacingHandleNode,
                      potential: PoschlTellerPotential,
                      chartTransform: ChartTransform,
                      time: QBSTime,
                      parentTandem: Tandem ) {

    const spacingProperty = potential.spacingProperty;

    super( handleNode, spacingProperty, chartTransform, time, {
      tandem: parentTandem,
      orientation: 'horizontal',
      keyboardDragDelta: PotentialDragListener.getKeyboardDragDelta( QBSConstants.SPACING_DECIMAL_PLACES ), // nm
      keyboardShiftDragDelta: PotentialDragListener.getKeyboardShiftDragDelta( QBSConstants.SPACING_DECIMAL_PLACES ), // nm
      updateProperty: ( viewPosition, viewDelta, isFromPDOM ) => {
        let spacing;
        if ( isFromPDOM ) {
          const modelDelta = chartTransform.viewToModelDelta( viewDelta );
          spacing = spacingProperty.value + modelDelta.x;
        }
        else {
          const modelPosition = chartTransform.viewToModelPosition( viewPosition );
          const multiplier = ( potential.numberOfWellsProperty.value % 2 === 0 ) ? 2 : 1;
          spacing = multiplier * ( modelPosition.x - potential.xOffsetProperty.value );
        }
        spacingProperty.value = spacingProperty.range.constrainValue( toFixedNumber( spacing, QBSConstants.SPACING_DECIMAL_PLACES ) );
      }
    } );
  }
}