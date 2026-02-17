// Copyright 2026, University of Colorado Boulder

/**
 * TwoWellsScreenSummaryContent is the description screen summary for the 'Two Wells' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import quantumBoundStates from '../../quantumBoundStates.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';

export default class TwoWellsScreenSummaryContent extends ScreenSummaryContent {

  public constructor() {

    super( {
      isDisposable: false,
      playAreaContent: QuantumBoundStatesFluent.a11y.screens.twoWellsScreen.screenSummary.playAreaStringProperty,
      controlAreaContent: QuantumBoundStatesFluent.a11y.screens.twoWellsScreen.screenSummary.controlAreaStringProperty,
      currentDetailsContent: QuantumBoundStatesFluent.a11y.screens.twoWellsScreen.screenSummary.currentDetailsStringProperty,
      interactionHintContent: QuantumBoundStatesFluent.a11y.screens.twoWellsScreen.screenSummary.interactionHintStringProperty
    } );
  }
}

quantumBoundStates.register( 'TwoWellsScreenSummaryContent', TwoWellsScreenSummaryContent );