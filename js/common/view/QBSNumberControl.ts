// Copyright 2026, University of Colorado Boulder

/**
 * QBSNumberControl is the base class for NumberControls that affect time when you interact with them.
 * Time is restarted when interaction begins. Time is paused while the user is interacting.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import NumberControl, { NumberControlOptions } from '../../../../scenery-phet/js/NumberControl.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import QBSTime from '../../common/model/QBSTime.js';
import { addPauseListeners } from './addPauseListeners.js';

type SelfOptions = EmptySelfOptions;

export type QBSNumberControlOptions = SelfOptions & NumberControlOptions;

export default class QBSNumberControl extends NumberControl {

  public constructor( title: string | TReadOnlyProperty<string> | Node,
                      numberProperty: NumberProperty,
                      time: QBSTime,
                      providedOptions: QBSNumberControlOptions ) {

    const options = optionize<QBSNumberControlOptions, SelfOptions, NumberControlOptions>()( {

      // NumberControlOptions
      isDisposable: false
    }, providedOptions );

    super( title, numberProperty, numberProperty.range, options );

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
}
