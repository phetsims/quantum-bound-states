// Copyright 2026, University of Colorado Boulder

/**
 * ManyWellsScreenSummaryContent is the description screen summary for the 'Many Wells' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import QuantumBoundStatesFluent from '../../QuantumBoundStatesFluent.js';

export default class ManyWellsScreenSummaryContent extends ScreenSummaryContent {

  public constructor() {

    super( {
      isDisposable: false,
      playAreaContent: QuantumBoundStatesFluent.a11y.screens.manyWellsScreen.screenSummary.playAreaStringProperty,
      controlAreaContent: QuantumBoundStatesFluent.a11y.screens.manyWellsScreen.screenSummary.controlAreaStringProperty,
      currentDetailsContent: QuantumBoundStatesFluent.a11y.screens.manyWellsScreen.screenSummary.currentDetailsStringProperty,
      interactionHintContent: QuantumBoundStatesFluent.a11y.screens.manyWellsScreen.screenSummary.interactionHintStringProperty
    } );
  }
}
