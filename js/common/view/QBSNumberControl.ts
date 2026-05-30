// Copyright 2026, University of Colorado Boulder

/**
 * QBSNumberControl is the base class for NumberControls that affect time when you interact with them.
 * Time is restarted when interaction begins. Time is paused while the user is interacting.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import { toFixedNumber } from '../../../../dot/js/util/toFixedNumber.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import NumberControl, { NumberControlMajorTick, NumberControlOptions } from '../../../../scenery-phet/js/NumberControl.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import QBSTime from '../../common/model/QBSTime.js';
import QBSConstants from '../QBSConstants.js';
import { addPauseListeners } from './addPauseListeners.js';

type SelfOptions = EmptySelfOptions;

export type QBSNumberControlOptions = SelfOptions & NumberControlOptions;

export default class QBSNumberControl extends NumberControl {

  public constructor( title: string | TReadOnlyProperty<string> | Node,
                      numberProperty: NumberProperty,
                      time: QBSTime,
                      providedOptions: QBSNumberControlOptions ) {

    super( title, numberProperty, numberProperty.range, providedOptions );

    addPauseListeners( this, time, {
      //TODO keys relies on internal knowledge of NumberControl
      keys: [
        'arrowLeft', 'arrowRight', 'arrowUp', 'arrowDown',
        'shift+arrowLeft', 'shift+arrowRight', 'shift+arrowUp', 'shift+arrowDown',
        'pageUp', 'pageDown',
        'home', 'end'
      ]
    } );
  }

  /**
   * Creates major tick marks for min and max values.
   */
  public static createMinMaxTicks( range: Range, decimals: number ): NumberControlMajorTick[] {
    return [
      {
        value: toFixedNumber( range.min, decimals ),
        label: new Text( range.min, QBSConstants.TICK_TEXT_OPTIONS )
      },
      {
        value: toFixedNumber( range.max, decimals ),
        label: new Text( range.max, QBSConstants.TICK_TEXT_OPTIONS )
      }
    ];
  }
}
