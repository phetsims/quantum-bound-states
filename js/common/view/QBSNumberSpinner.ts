// Copyright 2026, University of Colorado Boulder

/**
 * QBSNumberSpinner is the base class for spinners that affect time when you interact with them.
 * Time is restarted when interaction begins. Time is paused while the user is interacting.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import NumberSpinner, { NumberSpinnerOptions } from '../../../../sun/js/NumberSpinner.js';
import QBSTime from '../../common/model/QBSTime.js';
import { addPauseListeners } from './addPauseListeners.js';

type SelfOptions = EmptySelfOptions;

export type QBSNumberSpinnerOptions = SelfOptions & NumberSpinnerOptions;

export default class QBSNumberSpinner extends NumberSpinner {

  protected constructor( numberProperty: NumberProperty, time: QBSTime, providedOptions: QBSNumberSpinnerOptions ) {

    const options = optionize<QBSNumberSpinnerOptions, SelfOptions, NumberSpinnerOptions>()( {

      // NumberSpinnerOptions
      isDisposable: false
    }, providedOptions );

    super( numberProperty, numberProperty.rangeProperty, options );

    // Restart time and pause while the user is interacting with this spinner.
    addPauseListeners( this, time, {
      //TODO keys relies on internal knowledge of NumberSpinner
      keys: [
        'arrowLeft', 'arrowRight', 'arrowUp', 'arrowDown',
        'shift+arrowLeft', 'shift+arrowRight', 'shift+arrowUp', 'shift+arrowDown',
        'home', 'end'
      ]
    } );
  }
}