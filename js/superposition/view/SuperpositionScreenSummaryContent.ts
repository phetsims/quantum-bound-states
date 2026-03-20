// Copyright 2026, University of Colorado Boulder

/**
 * SuperpositionScreenSummaryContent is the description screen summary for the 'Superposition' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';

export default class SuperpositionScreenSummaryContent extends ScreenSummaryContent {

  public constructor() {

    super( {
      isDisposable: false,
      playAreaContent: QuantumBoundStatesFluent.a11y.screens.superpositionScreen.screenSummary.playAreaStringProperty,
      controlAreaContent: QuantumBoundStatesFluent.a11y.screens.superpositionScreen.screenSummary.controlAreaStringProperty,
      currentDetailsContent: QuantumBoundStatesFluent.a11y.screens.superpositionScreen.screenSummary.currentDetailsStringProperty,
      interactionHintContent: QuantumBoundStatesFluent.a11y.screens.superpositionScreen.screenSummary.interactionHintStringProperty
    } );
  }
}
