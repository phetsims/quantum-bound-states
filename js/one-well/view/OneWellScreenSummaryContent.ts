// Copyright 2026, University of Colorado Boulder

/**
 * OneWellScreenSummaryContent is the description screen summary for the 'One Well' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';

export default class OneWellScreenSummaryContent extends ScreenSummaryContent {

  public constructor() {

    super( {
      isDisposable: false,
      playAreaContent: QuantumBoundStatesFluent.a11y.screens.oneWellScreen.screenSummary.playAreaStringProperty,
      controlAreaContent: QuantumBoundStatesFluent.a11y.screens.oneWellScreen.screenSummary.controlAreaStringProperty,
      currentDetailsContent: QuantumBoundStatesFluent.a11y.screens.oneWellScreen.screenSummary.currentDetailsStringProperty,
      interactionHintContent: QuantumBoundStatesFluent.a11y.screens.oneWellScreen.screenSummary.interactionHintStringProperty
    } );
  }
}
